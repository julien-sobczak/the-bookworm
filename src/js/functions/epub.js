import JSZip from 'jszip';

/**
 * Determines if a link is internal to the EPUB bundle.
 * Indeed, the EPUB specification accepts external links, mainly for videos or audios files,
 * which can be very large.
 *
 * @param {string} uri A href attribute value.
 * @returns {bool} True if the link corresponds to a file in the EPUB bundle.
 */
function isInternalUri(uri) {
    return uri.indexOf('http://') === -1 && uri.indexOf('https://') === -1
}

/**
 * Extract the filepath and the anchor name from a URL.
 * If the URL contains GET parameters, they are ignored and not returned.
 *
 * @param {string} uri A href attribute value.
 * @returns {Array} A pair containing the filepath and the optional anchor name.
 */
function splitUriParts(uri) {
    const indexSeparator = uri.indexOf('#');
    if (indexSeparator === -1) return [uri, undefined];
    const indexParams = uri.indexOf('?');
    if (indexParams !== -1) {
        uri = uri.substring(0, indexParams);
    }
    return [uri.substring(0, indexSeparator), uri.substring(indexSeparator+1)];
}

/**
 * Return the directory of the linked file.
 * Ex: "xhtml/ch01.html" => "xhtml"
 *
 * @param {string} uri A href attirbute value.
 * @return {string} The base directory.
 */
function basedir(uri) {
    const indexLastSeparator = uri.lastIndexOf('/');
    if (indexLastSeparator === -1) return "";
    return uri.substring(0, indexLastSeparator + 1);
}

/**
 * Filters the element children to keep only the tag with a given name.
 *
 * @param {HTMLElement} element A HTML element.
 * @param {string} tagName The tag name of children to return.
 */
function directDescendants(element, tagName) {
    if (!element) return [];
    // Same as querySelectorAll(":scope > li")
    // But this method bugs in HTMLLitElement when running with Node.js.
    return [...element.children].filter(child => child.tagName.toUpperCase() === tagName.toUpperCase());
}


const DEFAULT_SUPPORTED_TAGS = ['p', 'h*', 'img', 'figure', 'ol', 'ul', 'dl', 'table']; // TODO what about tr, td, colgroup, caption, etc.
// => Rework

/**
 * EPUB 3 Parser.
 *
 * We don't reuse an lib available on GitHub.
 * The goal of the application is not to be an Epub reader and we don't render them using the stylesheets present in the bundle.
 *
 * We need to apply specific rules on Epub:
 * - Ignore small images.
 * - Simplify the HTML to keep only relevant tags (drop <sup>, <nav>, or <div> used for styling purposes)
 * - Ignore Front Matter and Back Matter.
 * - etc.
 */
export class EpubParser {

    /**
     * Initiates a new parser.
     *
     * Available options:
     *
     * - skipImages: Ignore completely images present in the EPUB text.
     * - imagePixelsMin: Minimum number of pixels for an image to be included (when skipImages is disabled)
     * - skipNonLinear: Drop all sections marked as optional.
     * TODO complete
     *
     * @param {Object} options The various parsing settings.
     */
    constructor({
        skipImages=false,
        skipTables=false,
        skipNonLinear=false,
        imagePixelsMin=400*200,
        tocMaxDepth=2,
        includeTags=DEFAULT_SUPPORTED_TAGS,
        flattenAsides=true }) {

        this.skipImages = skipImages;
        this.skipTables = skipTables;
        this.skipNonLinear = skipNonLinear;
        this.imagePixelsMin = imagePixelsMin;
        this.tocMaxDepth = tocMaxDepth;
        this.includeTags = includeTags;
        this.flattenAsides = flattenAsides;

        this.metadata = undefined; // Book metadata
        this.items = new Map(); // Manifest files metadata
        this.tocEpub2 = undefined; // EPUB 2 Table of Content
        this.tocEpub3 = undefined; // EPUB 3 Table of Content
    }

    async parse(file) {
        // Implementation: This method extract as much information as possible from the EPUB bundle.
        // Metadata are stored in properties and reused by the method _generateEpub().

        const new_zip = new JSZip();
        const domparser = new DOMParser();

        const zip = await new_zip.loadAsync(file)

        // Read container file to find OPF file.
        const container = await zip.file('META-INF/container.xml').async("string");
        const containerDoc = domparser.parseFromString(container, 'application/xml');
        const opfPath = containerDoc.querySelector('rootfile').getAttribute('full-path');
        this.basedir = basedir(opfPath);

        // Read Open Package Format (OPF) file
        const opf = await zip.file(opfPath).async('string');
        const opfDoc = domparser.parseFromString(opf, 'application/xml');

        // Extract metadata
        const metadataElement = opfDoc.querySelector('metadata');
        // const titleElement = opfDoc.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'title').item(0);
        const identifierElements = metadataElement.querySelectorAll('dc\\:identifier'); // Can contains multiple identifier.
        const descriptionElement = metadataElement.querySelector('dc\\:description');
        const titleElements = metadataElement.querySelectorAll('dc\\:title'); // Can contains title, subtitle, short title, etc.
        const authorElements = metadataElement.querySelectorAll('dc\\:creator'); // Can have several authors for the same book.
        const publisherElement = metadataElement.querySelector('dc\\:publisher');
        const languageElements = metadataElement.querySelectorAll('dc\\:language');
        this.metadata = {
            // Keep only the first one when multiple results are found. Not ideal but acceptable if most cases (except for authors).
            identifier: identifierElements ? identifierElements[0].innerHTML : undefined,
            description: descriptionElement ? descriptionElement.innerHTML : undefined,
            language: languageElements ? languageElements[0].innerHTML : undefined,
            title: titleElements ? titleElements[0].innerHTML : undefined,
            author: authorElements ? [...authorElements].map(e => e.innerHTML).join(', ') : undefined,
            publisher: publisherElement ? publisherElement.innerHTML : undefined,
        };
        // console.log(metadata);

        // Check manifest files
        const manifestElement = opfDoc.querySelector('manifest');
        [...manifestElement.querySelectorAll('item')].forEach(itemElement => {
            const id = itemElement.getAttribute('id');
            const href = itemElement.getAttribute('href');
            const mediaType = itemElement.getAttribute('media-type');
            const properties = itemElement.getAttribute('properties');
            const item = {
                id: id,
                href: this.basedir + href,
                mediaType: mediaType,
                properties: properties,
            };
            this.items.set(id, item);
        });

        // Read the spine
        const spineElement = opfDoc.querySelector('spine');
        const orderedItems = [];
        [...spineElement.querySelectorAll('itemref')].forEach(refElement => {

            if (!refElement.hasAttribute('idref')) return;

            const id = refElement.getAttribute('idref');

            if (this.items.has(id)) {
                const item = this.items.get(id);
                if (refElement.hasAttribute('linear') && refElement.getAttribute('linear') === 'no') {
                    item.linear = false;
                } else {
                    item.linear = true;
                }
                orderedItems.push(id);
            }
        });

        // Inspect files individually
        for (const [id, item] of this.items.entries()) {
            const optionalProperties = await this._loadItem(zip, item);
            this.items.set(id, {
                ...item,
                ...optionalProperties,
            });
        }

        return this._generateEpub();
    }

    async _loadItem(zip, item) {
        const result = {};

        if (!isInternalUri(item.href)) {
            // The EPUB specification allows an EPUB to reference external files like video or audio files.
            // We can safely ignore these files.
            result.ignore = true;
            return result;
        }

        switch (item.mediaType) {
            // HTML documents
            case 'application/xhtml':
            case 'application/xhtml+xml':
            case 'text/html':
                result.rawContent = await zip.file(item.href).async('string');
                // Extract body content
                const domparser = new DOMParser();
                const doc = domparser.parseFromString(result.rawContent, 'text/html');
                result.htmlContent = doc.querySelector('body').innerHTML;
                // EPUB 3 Table of Content is a basic HTML file
                if (item.properties === 'nav') this._loadEpub3Toc(item.href, result.rawContent);
                break;
            case 'application/x-dtbncx+xml':
                result.rawContent = await zip.file(item.href).async('string');
                this._loadEpub2Toc(item.href, result.rawContent);
                break;

            // Images
            case 'image/png':
                if (this.skipImages) break;
                // Image.onload doesn't work in Node.js environment:
                // https://github.com/testing-library/react-hooks-testing-library/issues/218
                const content = await zip.file(item.href).async('base64');
                const dimensions = await new Promise(resolve => {
                    var img = new Image();
                    img.src = `data:image/png;base64,${content}`;
                    img.onload = () => {
                        resolve({
                            width: img.width,
                            height: img.height,
                        });
                    };
                    img.onerror = (e) => {
                        reject(e);
                    };
                });
                result.content = content;
                result.width = dimensions.width;
                result.height = dimensions.height;
                break;
        }
        return result;
    }

    /**
     * Parse the Table of Content file in EPUB 2 format.
     * (see http://idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4.1)
     *
     * @param {string} href The file href.
     * @param {string} content The file content.
     */
    _loadEpub2Toc(href, content) {
        // Example: https://wiki.mobileread.com/wiki/NCX#:~:text=NCX%20is%20the%20short%20name,and%20optionally%20a%20page%20list.
        /*
            <?xml version="1.0"?>
            <!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN"
            "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">

            <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
            <head>
                <meta name="dtb:uid" content="RT8513Z9UM0NLKLF8QX9QDJ3E6ZFL2"/>
                <meta name="dtb:depth" content="3"/>
                <meta name="dtb:totalPageCount" content="0"/>
                <meta name="dtb:maxPageNumber" content="0"/>
            </head>
            <docTitle>
                <text>Document Title</text>
            </docTitle>
            <navMap>
                <navPoint id="navPoint-1" playOrder="1">
                    <navLabel>
                        <text>Section with no subsection</text>
                    </navLabel>
                    <content src="text/content001.xhtml"/>
                </navPoint>
                <navPoint id="navPoint-2" playOrder="2">
                    <navLabel>
                        <text>TOC entry name Section title
                        </text>
                    </navLabel>
                    <content src="text/content001.xhtml#heading_id_3"/>
                    <navPoint id="navPoint-3" playOrder="3">
                        <navLabel>
                            <text>Section entry name.</text>
                        </navLabel>
                        <content src="text/content002.xhtml"/>
                    </navPoint>
                    <navPoint id="navPoint-4" playOrder="4">
                        <navLabel>
                            <text>Introduction.</text>
                        </navLabel>
                        <content src="text/content003.xhtml"/>
                        <navPoint id="navPoint-5" playOrder="5">
                            <navLabel>
                                <text>Preserving the Text.</text>
                            </navLabel>
                            <content src="text/content003.xhtml#heading_id_217"/>
                        </navPoint>
                        <navPoint id="navPoint-6" playOrder="6">
                            <navLabel>
                                <text>Lower level chapter title</text>
                            </navLabel>
                            <content src="text/content003.xhtml#heading_id_218"/>
                        </navPoint>
                        <navPoint id="navPoint-7" playOrder="7">
                            <navLabel>
                                <text>Another lower level title.</text>
                            </navLabel>
                            <content src="text/content003.xhtml#heading_id_219"/>
                        </navPoint>
                    </navPoint>
                </navPoint>
            </navMap>
            </ncx>
        */
        const domparser = new DOMParser();
        const tocDoc = domparser.parseFromString(content, 'application/xml');

        const toc = [];

        const mapElement = tocDoc.querySelector('navMap');
        directDescendants(mapElement, 'navPoint').forEach(element => {
            toc.push(this._parseEpub2Section(href, element));
        });

        this.tocEpub2 = toc;
    }

    /**
     * Parse a single TOC entry in the NCX format.
     *
     * @param {string} href The file href.
     * @param {HTMLElement} sectionElement The section element.
     * @return {Object} The extracted section metadata.
     */
    _parseEpub2Section(href, sectionElement) {
        const sectionTitle = directDescendants(sectionElement, 'navLabel')[0].querySelector('text').innerHTML;
        const sectionHref = directDescendants(sectionElement, 'content')[0].getAttribute('src');
        let [sectionFile, sectionAnchor]  = splitUriParts(sectionHref);
        sectionFile = basedir(href) + sectionFile; // Links are relative in Epub files
        const sectionId = this._getItemByHref(sectionFile).id;

        const subsections = [];
        directDescendants(sectionElement, 'navPoint').forEach(subsectionElement => {
            subsections.push(this._parseEpub2Section(href, subsectionElement));
        });

        return {
            id: sectionId,
            href: sectionFile,
            anchor: sectionAnchor,
            title: sectionTitle,
            subsections: subsections,
        };
    }

    /**
     * Parse the Table of Content file in EPUB 3 format.
     * (@see http://kb.daisy.org/publishing/docs/navigation/toc.html)
     *
     * @param {string} href The file href.
     * @param {string} content The file content.
     */
    _loadEpub3Toc(href, content) {
        /**
            <?xml version="1.0" encoding="utf-8"?>
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
                <head>
                    <meta charset="utf-8" />
                    <title>EPUB 3 Specifications - Table of Contents</title>
                    <link rel="stylesheet" type="text/css" href="../css/epub-spec.css" />
                </head>
                <body>
                    <nav epub:type="toc" id="toc">
                        <h1 class="title">Table of Contents</h1>

                        <ol>
                            <li id="ttl"><a href="epub30-titlepage.xhtml">EPUB 3.0 Specification</a></li>
                            <li id="nav"><a href="epub30-nav.xhtml">EPUB 3 Specifications - Table of Contents</a></li>
                            <li id="term"><a href="epub30-terminology.xhtml">Terminology</a></li>
                            <li id="ovw"><a href="epub30-overview.xhtml">EPUB 3 Overview</a>
                                <ol>
                                    <li><a href="epub30-overview.xhtml#sec-intro">1. Introduction</a><ol>
                                            <li><a href="epub30-overview.xhtml#sec-intro-overview">1.1. Overview</a></li>
                                            <li><a href="epub30-overview.xhtml#sec-intro-roadmap">1.2. Roadmap</a></li>
                                        </ol>
                                    </li>
                                    <li><a href="epub30-overview.xhtml#sec-features">2. Features</a>
                                        <ol>
                                            <li><a href="epub30-overview.xhtml#sec-package-file">2.1. Package Document</a></li>
                                            <li><a href="epub30-overview.xhtml#sec-nav">2.2. Navigation</a>
                                                <ol hidden="">
                                                    <li><a href="epub30-overview.xhtml#sec-nav-order">2.2.1. Reading Order</a></li>
                                                    <li><a href="epub30-overview.xhtml#sec-nav-nav-doc">2.2.2. Navigation Document</a></li>
                                                </ol>
                                            </li>
                                        </ol>
                                    </li>
                                </ol>
                            </li>
                            <li id="ref"><a href="epub30-references.xhtml">References</a></li>
                        </ol>
                    </nav>

                    <nav epub:type="landmarks" hidden="">
                        <h2>Guide</h2>
                        <ol>
                            <li><a epub:type="toc" href="#toc">Table of Contents</a></li>
                            <li><a epub:type="bodymatter" href="epub30-overview.xhtml#sec-intro">Overview</a></li>
                            <li><a epub:type="bibliography" href="epub30-references.xhtml#references">References</a></li>
                            <li><a epub:type="glossary" href="epub30-terminology.xhtml#terminology">Terminology</a></li>
                        </ol>
                    </nav>

                </body>
            </html>
         */
        const domparser = new DOMParser();
        const tocDoc = domparser.parseFromString(content, 'text/html');

        const toc = [];

        const navElement = tocDoc.querySelector('nav#toc');
        const olElement = directDescendants(navElement, 'ol')[0];
        directDescendants(olElement, 'li').forEach(element => {
            toc.push(this._parseEpub3Section(href, element));
        });

        this.tocEpub3 = this._postProcessToc(toc);
    }

    /**
     * Parse a single TOC entry in the NCX format.
     *
     * @param {string} href The file href.
     * @param {HTMLElement} sectionElement The section element.
     * @return {Object} The extracted section metadata.
     */
    _parseEpub3Section(href, sectionElement) {
        const sectionLink = directDescendants(sectionElement, 'a')[0];
        const sectionTitle = sectionLink.innerHTML;
        const sectionHref = sectionLink.getAttribute('href');
        let [sectionFile, sectionAnchor]  = splitUriParts(sectionHref);
        sectionFile = basedir(href) + sectionFile; // Links are relative in Epub files
        const sectionId = this._getItemByHref(sectionFile).id;

        const subsections = [];
        directDescendants(directDescendants(sectionElement, 'ol')[0], 'li').forEach(subsectionElement => {
            subsections.push(this._parseEpub3Section(href, subsectionElement));
        });

        return {
            id: sectionId,
            href: sectionFile,
            anchor: sectionAnchor,
            title: sectionTitle,
            subsections: subsections,
            // Cannot extract content for now as we still don't know where start the next section
            // (NB: a section can be spreaded across several manifest files)
            htmlContent: undefined,
        };
    }

    _extractHTMLContentForSections(sections, nextSection = null) {
        if (!sections) return;
        for (let i = 0; i < sections.length; i++) {
            const currentSection = sections[i];
            const followingSection = (i === sections.length - 1) ? nextSection : sections[i+1];
            currentSection.htmlContent = this._extractHTMLContentBetweenSections(currentSection, followingSection);
            this._extractHTMLContentForSections(currentSection.subsections, followingSection);
        }
    }

    _extractHTMLContentBetweenSections(currentSection, nextSection) {
        this.orderedItems.indexOf(currentSection.id)
        let indexStart = this.orderedItems.indexOf(currentSection.id);
        let indexEnd = this.orderedItems.indexOf(nextSection.id);
        if (nextSection.anchor) {
            // Include this file and search for the anchor
            indexEnd++;
        }
        const ids = this.orderedItems.slice(indexStart, indexEnd);
        const htmlContent = "";
        ids.forEach(id => {
            htmlContent += this.items.get(id).htmlContent + "\n";
        });
        const htmlLines = htmlContent.split('\n');

        const domparser = new DOMParser();
        if (currentSection.anchor) {
            // Read from anchored element
            for (let i = 0; i < htmlLines.length; i++) {
                const line = htmlLines[i];
                const snippet = domparser.parseFromString(line, "text/html");
                snippet
            }

        }
        if (nextSection.anchor) {
            // Read until anchored next element
        }

    }

    /**
     * Determines the depth of a TOC section (or of the TOC itself if the section is the root).
     *
     * @param {Object} section A section object inside a TOC EPUB 2/3.
     * @return {bool} The depth.
     */
    static _sectionDepth(section) {
        if (!section) return 0;
        let maxDepth = 0;
        section.subsections.forEach(s => {
            const innerDepth = EpubParser._sectionDepth(s);
            if (innerDepth > maxDepth) {
                maxDepth = innerDepth;
            }
        });
        return 1 + maxDepth;
    }

    /**
     * Search for an item in the manifest based from its link.
     *
     * @param {string} href The link value.
     * @return {Object} The item if present.
     */
    _getItemByHref(href) {
        for (const [id, item] of this.items.entries()) {
            if (item.href === href) {
                return item;
            }
        }
        return undefined;
    }

    _generateEpub() {
        // Implementation: This method reuses metadata extracted during the parsing
        // and returns a user-friendly structure satisfying the options.

        const sections = [];

        const toc = this.tocEpub3 || this.tocEpub2; // Preferably use the EPUB 3 Table of Contents
        if (!toc) {
            throw new Error('No table of contents found');
        }



        const epub = new Epub(this.metadata, sections);

        return {
            metadata: this.metadata,
            // TODO keep only one of them
            ncx: this.ncx,
            nav: this.nav,
        };
    }

}

export class Epub {

    constructor(metadata, sections) {
        this.metadata = metadata;
        this.sections = sections;
    }

    stats() {
        // TODO
        return {};
    }
}

export class Section {

    constructor(title, linear, htmlContent) {
        this.title = title;
        this.linear = linear;
        this.htmlContent = htmlContent;
    }

    stats() {
        // TODO
        return {};
    }

}

// new EpubParser().
//     skipNonlinear()
//     includeImages()
//     skipImagesSmallerThan()

/*
const epub = new Epub({
    metadata: {
        author|title|publisher|etc|....
    },
    toc: [ // Array of Section
        {
            title: "",
            leaf: true|false, // subsections.length === 0
            optional: true|false,
            rawContent: "...",
            subsections: [
                { ... }
            ]
        }
    ]
})
*/

// epub = new EpubParser({ maxDepth: 2, includeTags: ['p', 'h*', 'img'], flattenAsides: true }).parse()
// epub.metadata.author
// epub.getStats()
// {
//   words: 10,
//   paragraphs: 2,
//   characters: 30,
// }
// section = epub.toc[0]
// section.stats()
// {
//   words: 10,
//   paragraphs: 2,
//   characters: 30,
// }
// section.htmlElements()
// [
//    { tag: "h1", innerHTML: "Title" },
//    { tag: "p", innerHTML: "..." },
//    { tag: "aside", innerHTML: "..." }
//    { tag: "img", innerHTML: "..." } # <img src="" />
// ],
// subsection = section.subsections[0]

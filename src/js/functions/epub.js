import JSZip from 'jszip';
import { Section } from './library';


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
 * EPUB 3 Parser.
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
     *
     * @param {Object} options The various parsing settings.
     */
    constructor({ skipImages=false, skipNonLinear=false, imagePixelsMin=400*200 }) {
        this.skipImages = skipImages;
        this.skipNonLinear = skipNonLinear;
        this.imagePixelsMin = imagePixelsMin;

        this.metadata = undefined; // Book metadata
        this.items = new Map(); // Manifest files metadata
        this.ncx = undefined; // EPUB 2 Table of Content
        this.nav = undefined; // EPUB 3 Table of Content
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
                href: href,
                mediaType: mediaType,
                properties: properties,
            };
            this.items.set(id, item);
        });
        // Inspect file individually
        for (const [id, item] of this.items.entries()) {
            const optionalProperties = await this._loadItem(zip, item);
            this.items.set(id, {
                ...item,
                ...optionalProperties,
            });
        }

        // Check the spine (aka TOC)
        const spineElement = opfDoc.querySelector('spine');
        // TODO

        return this._generateEpub();
    }

    _generateEpub() {
        // Implementation: This method reuses metadata extracted during the parsing
        // and returns a user-friendly structure satisfying the options.
        return {
            metadata: this.metadata,
            // TODO keep only one of them
            ncx: this.ncx,
            nav: this.nav,
        };
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
            case 'application/xml':
            case 'application/xhtml':
            case 'application/xhtml+xml':
            case 'text/html':
                result.content = await zip.file(this.basedir + item.href).async('string');
                if (item.properties === 'nav') this._loadNav(); // EPUB 3 TOC
                break;
            // EPUB 2 ncx file (often present for backward compatibility)
            case 'application/x-dtbncx+xml':
                result.content = await zip.file(this.basedir + item.href).async('string');
                this._loadNcx(result.content);
                break;

            // Images
            case 'image/png':
                if (this.skipImages) break;
                // Image.onload doesn't work in Node.js environment:
                // https://github.com/testing-library/react-hooks-testing-library/issues/218
                const content = await zip.file(this.basedir + item.href).async('base64');
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
     * @param {string} content The file content.
     */
    _loadNcx(content) {
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
        const sectionsElements = tocDoc.querySelectorAll('navPoint');
        const toc = [];
        for (let i = 0; i < sectionsElements.length; i++) {
            const sectionElement = sectionsElements[i];
            const sectionTitle = sectionElement.querySelector('navLabel text').innerHTML;
            const sectionHref = sectionElement.querySelector('content').getAttribute('src');
            const [sectionFile, sectionAnchor]  = splitUriParts(sectionHref);
            const sectionId = this._getItemByHref(sectionHref).id;
            toc.push({
                id: sectionId,
                href: sectionFile,
                anchor: sectionAnchor,
                title: sectionTitle,
            });
        }
        this.ncx = toc;
    }

    /**
     * Parse the Table of Content file in EPUB 3 format.
     * (@see http://kb.daisy.org/publishing/docs/navigation/toc.html)
     *
     * @param {string} content The file content.
     */
    _loadNav(content) {
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
        const sectionsElements = tocDoc.querySelectorAll('li');
        const toc = [];
        for (let i = 0; i < sectionsElements.length; i++) {
            const sectionElement = sectionsElements[i];
            const sectionTitle = sectionElement.querySelector('navLabel text').innerHTML;
            const sectionHref = sectionElement.querySelector('content').getAttribute('src');
            const sectionId = this._getItemByHref(sectionHref).id;
            toc.push({
                id: sectionId,
                href: sectionHref,
                title: sectionTitle,
            });
        }
        this.nav = toc;
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

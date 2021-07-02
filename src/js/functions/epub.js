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
 * Returns if an HTML element contains only text.
 *
 * @param {Node} element The element.
 * @returns {bool} True if the element contains only text.
 */
function isTextElement(element) {
    const stylingTags = ['B', 'STRONG', 'I', 'U', 'EM', 'MARK', 'SMALL', 'DEL', 'INS', 'SUB', 'SUP'] + ['A']; // Text can contains links

    const childNodes = [...element.childNodes];

    for (let i = 0; i < childNodes.length; i++) {
        const child = childNodes[i];

        // A text element

        // can contains text nodes
        if (child.nodeType === Node.TEXT_NODE) {
            continue;
        }

        // Or styling/formatted tag only
        if (child.nodeType === Node.DOCUMENT_NODE && !stylingTags.includes(child.tagName)) {
            continue;
        }

        // Found a non-matching node
        return false;
    }

    return true;
}

function isImageElement(element) {
    const imagesTags = ['IMG', 'SVG'];
    return imagesTags.includes(element.tagName);
}

/**
 * Returns if an HTML element is empty.
 *
 * @param {Node} element The element.
 * @returns {bool} True if the element contains no text under it.
 */
function isEmptyElement(element) {
    const exclusionTags = ['IMG', 'SVG'];
    return element.nodeType === Element.Node && !exclusionTags.includes(element.tagName) && element.textContent.trim() === "";
}

/**
 * Returns if an HTML element is a structural tag.
 *
 * @param {Node} element The element.
 * @returns {bool} True if the element is used to structure the document.
 */
function isStructuralElement(element) {
    const structuralTagNames = ['BODY', 'ASIDE', 'DIV', 'SECTION'];
    return structuralTagNames.includes(element.tagName) && !isTextElement(element);
}

/**
 * Returns a new clean P element.
 *
 * @param {Node} element The element.
 * @returns {Node} The cleaned element.
 */
function cleanParagraph(element) {
    const paragraph = document.createElement("p");

    const childNodes = [...element.childNodes];
    childNodes.forEach(c => {
        // TODO filter links?
        paragraph.appendChild(c.cloneNode(true));
    });

    return paragraph;
}

/**
 * Returns a new clean image element.
 *
 * @param {Node} element The element.
 * @returns {Node} The cleaned element.
 */
function cleanImage(element) {
    if (element.tagName === 'IMG') {
        const image = document.createElement("img");
        image.setAttribute('src', element.getAttribute('src'));
        if (element.hasAttribute('width')) {
            image.setAttribute('width', element.getAttribute('width'));
        }
        if (element.hasAttribute('height')) {
            image.setAttribute('height', element.getAttribute('height'));
        }
        return image;
    } else if (element.tagName === 'SVG') {
        return element.cloneNode(true);
    }

    return undefined;
}

function cleanHR() {
    return document.createElement("hr");
}


/**
 * Returns the clean content of the aside.
 *
 * @param {Node} element The element.
 * @returns {Node} The cleaned element.
 */
function cleanAside(element) {
    const results = [];
    const childNodes = [...element.childNodes];
    childNodes.forEach(c => {
        if (isTextElement(c)) {
            results.push(cleanParagraph(c));
        }
        // TODO support lists
        // TODO support <table>
        // TODO support images
    });
    return results;
}

 /**
  * Recursive function to clean a DOM tree.
  *
  * @param {Node} element The root element.
  * @param {Number} currentDepth The depth of the root element inside the complete HTML document.
  * @param {Number} paragraphsDepth The depth where the majority of paragraphs are present.
  * @returns {Array[HTMLElement]} The resulting elements to use in replacement of the root element in input.
  */
 export function cleanElement(element, anchors, currentDepth, paragraphsDepth) {
    const results = [];

    // Keep anchor used in the TOC
    if (element.tagName === 'A' && element.getAttribute('id') && anchors.includes(element.getAttribute('id'))) {
        const anchor = document.createElement("a");
        anchor.setAttribute('id', anchor);
        results.append(anchor)
    }

    if (isEmptyElement(element)) return results;

    // The content is wrapped inside tags
    if (currentDepth < paragraphsDepth && isStructuralElement(element)) {
        // Move into it
        [...element.children].forEach(child => {
            results.push(...cleanElement(child, anchors, currentDepth + 1, paragraphsDepth));
        });
        return results;
    }

    // TODO Complex images with caption

    // Aside
    if (currentDepth === paragraphsDepth && isStructuralElement(element)) {
        // We flatten the content of the aside and surround it by two separators.
        results.push(cleanHR());
        results.push(...cleanAside(element));
        results.push(cleanHR());
        return results;
    }

    // Images
    if (currentDepth >= paragraphsDepth && isImageElement(element)) {
        results.push(cleanImage(element));
        return results;
    }

    // Paragraph
    if (currentDepth == paragraphsDepth && isTextElement(element)) {
        results.push(cleanParagraph(element));
        return results;
    }

    // TODO support lists
    // TODO support <table>

    return results;
}

export class HTMLParser {

    parseNode(node, anchors=[]) {
        const body = node.querySelector('body');
        const root = (!body) ? node : body;
        const paragraphsDepth = HTMLParser.paragraphsDepth(root);
        return cleanElement(root, anchors, 0, paragraphsDepth);
    }

    parseText(html, anchors=[]) {
        const domparser = new DOMParser();
        const doc = domparser.parseFromString(html, 'text/html');
        return this.parseNode(doc, anchors);
    }

    /**
     * Traverses an HTML document to find the depth where most paragraphs are present.
     * This can be used to detect if a paragraph is part of an aside or not.
     *
     * @param {Node} document The HTML node.
     * @returns {Number} The 0-based depth.
     */
    static paragraphsDepth(document) {
        const getDepth = (element, depth) => {
            let maxDepth = 0;
            [...element.children].forEach(c => {
                const innerDepth = getDepth(c, depth + 1);
                if (innerDepth > maxDepth) {
                    maxDepth = innerDepth;
                }
            });
            return 1 + maxDepth;
        }

        const countParagraphsAtDepth = (element, targetDepth, currentDepth) => {
            if (element.tagName && element.tagName === 'P' && targetDepth === currentDepth) return 1;

            if (currentDepth >= targetDepth) return 0; // No need to search lower in the DOM.

            // Recurse
            const children = [...element.children];
            let sum = 0;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                sum += countParagraphsAtDepth(child, targetDepth, currentDepth + 1);
            }
            return sum;
        }

        // Iterate over all possible depths and calculate the number of paragraphs at that depth.
        const maxDepth = getDepth(document);
        let depthWithMostParagraphs = 0;
        let countWithMostParagraphs = 0;
        for (let i = 0; i <= maxDepth; i++) {
            const count = countParagraphsAtDepth(document, i, 0);
            if (count > countWithMostParagraphs) { // New maximum found
                depthWithMostParagraphs = i;
                countWithMostParagraphs = count;
            }
        }

        return depthWithMostParagraphs;
    }
}



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
        this.orderedItems = orderedItems;

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
                result.content = await zip.file(item.href).async('string');
                // EPUB 3 Table of Content is a basic HTML file
                if (item.properties === 'nav') this._loadEpub3Toc(item.href, result.content);
                break;
            case 'application/x-dtbncx+xml':
                result.content = await zip.file(item.href).async('string');
                this._loadEpub2Toc(item.href, result.content);
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

        this.tocEpub3 = toc;
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
        // TODO remove
        if (!sections) return;
        for (let i = 0; i < sections.length; i++) {
            const currentSection = sections[i];
            const followingSection = (i === sections.length - 1) ? nextSection : sections[i+1];
            currentSection.htmlContent = this._extractHTMLContentBetweenSections(currentSection, followingSection);
            this._extractHTMLContentForSections(currentSection.subsections, followingSection);
        }
    }

    _extractHTMLContentBetweenSections(currentSection, nextSection) {
        // TODO remove
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

    toc() {
        return this.tocEpub3 || this.tocEpub2; // Preferably use the EPUB 3 Table of Contents
    }

    parseContent() {
        const toc = this.toc();

        // Utility function to find sections referencing a given item.
        const findSectionsMatchingID = (sections, id) => {
            const results = [];
            results.push(...sections.filter(s => s.id === id));
            results.push(...sections.filter(s => s.subsections.length > 0).flatMap(s => findSectionsMatchingID(s.subsections, id)));
            return results;
        };

        // Create a single HTML document containing all spine files.
        const htmlParser = new HTMLParser();
        const domparser = new DOMParser();
        let fragment = document.createDocumentFragment();

        for (let i = 0; i < this.orderedItems.length; i++) {
            const id = this.orderedItems[i];
            const item = this.items.get(id);
            const doc = domparser.parseFromString(item.content, 'text/html');
            const relatedSections = findSectionsMatchingID(toc, id);
            const anchorsInSections = relatedSections.filter(s => s.anchor).map(s => s.anchor);

            // Surrounds the content with two anchor tags to make easy to find file delimiters inside the global document
            const startAnchor = document.createElement("a");
            startAnchor.setAttribute('id', id+'-start');
            const endAnchor = document.createElement("a");
            endAnchor.setAttribute('id', id+'-end');

            fragment.appendChild(startAnchor);
            const tags = htmlParser.parseNode(doc, anchorsInSections);
            tags.forEach(child => {
                fragment.appendChild(child);
            })
            fragment.appendChild(endAnchor);
        }

        return fragment;
    }

    parseSections(sections, nextSection) {
        if (!sections) return [];
        for (let i = 0; i < sections.length; i++) {
            const currentSection = sections[i];
            const followingSection = (i === sections.length - 1) ? nextSection : sections[i+1];
            currentSection.htmlContent = this.parseSections(currentSection, followingSection);
            this.parseSections(currentSection.subsections, followingSection);
        }
    }

    _generateEpub() {
        // Implementation: This method reuses metadata extracted during the parsing
        // and returns a user-friendly structure satisfying the options.

        const toc = this.toc();
        if (!toc) {
            throw new Error('No table of contents found');
        }

        const content = this.parseContent();

        let div = document.createElement("div");
        div.appendChild(content);
        console.log(div.innerHTML);

        // TODO extract each section content

        const epub = new Epub(this.metadata, toc);
        return epub;
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

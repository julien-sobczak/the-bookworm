/**
 * Utility functions to parse an Epub file.
 *
 * The code uses the zip library under the hood.
 *
 * @see https://github.com/gildas-lormeau/zip.js/blob/gh-pages/demos/demo2.js
 */

// Import zip.js
const zip = window.zip;

function getEntries(file) {
    return new Promise((resolve, reject) => {
        zip.createReader(new zip.BlobReader(file), zipReader => {
            zipReader.getEntries((entries) => {
                resolve(entries);
            });
        }, reject);
    });
}
function getEntryFile(entry) {
    return new Promise((resolve) => {
        const writer = new zip.BlobWriter();

        entry.getData(writer, blob => {
            var reader = new FileReader();
            reader.onload = () => {
                resolve({
                    filename: entry.filename,
                    content: reader.result,
                });
            };
            reader.readAsText(blob);
        });
    });
}


// Reads the TOC file and determine the list of chapters.
export function parseToc(content) {
    const toc = [];
    const tocDoc = new DOMParser().parseFromString(content, "application/xml");
    const chapters = [...tocDoc.querySelectorAll('navPoint')]; // converts NodeList to Array
    chapters.forEach(element => {
        const text = element.querySelector('text').innerHTML;
        let filename = element.querySelector('content').getAttribute('src');
        // Remove optional fragment. Ex: index_split_000.html#3
        const indexFragment = filename.indexOf('#');
        if (indexFragment !== -1) {
            filename = filename.substring(0, indexFragment);
        }
        toc.push({
            title: text,
            filename: filename,
        });
    });

    return toc;
}

// Parses a text files to extract the HTML readable content.
export function parseFile(content) {

    const cleanHTML = html => {
        // Keep the following tags in the resulting content
        const keepTags = ['i', 'strong', 'b'];
        // Keep the content of the following tags in the resulting content
        const keepTagsContent = ['a'];
        // Discard completely everything that does not match any of the above conditions

        const children = new DOMParser().parseFromString(html, "text/html").querySelector('body').childNodes;
        let result = '';
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.nodeType === Node.TEXT_NODE) {
                result += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const childTag = child.tagName.toLowerCase();
                if (keepTags.includes(childTag)) {
                    result += `<${childTag}>${child.textContent}<${childTag}/>`;
                } else if (keepTagsContent.includes(childTag)) {
                    result += `${child.textContent}`;
                }
            }
        }

        return result;
    };

    const keepTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'p'];
    const doc = new DOMParser().parseFromString(content, "text/html");

    // Queue containing HTML elements to process
    const elements = [];
    elements.push(...doc.querySelector('body').childNodes);

    const results = [];
    while (elements.length > 0) {
        const elt = elements.shift();
        if (elt.nodeType !== Node.ELEMENT_NODE) continue;
        if (keepTags.includes(elt.tagName.toLowerCase())) {
            const block = {
                tag: elt.tagName.toLowerCase(),
                content: cleanHTML(elt.innerHTML),
            };
            if (block.content.length > 0) {
                results.push(block);
            }
        } else {
            elements.push(...elt.childNodes);
        }
    }

    return results;
}

// Returns the first file whose filename matches the given regex
export function getFileMatching(files, regex) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (regex.test(file.filename)) {
            return file;
        }
    }
    return undefined;
}

// Reads the TOC file and determine the list of chapters
export function extractToc(files) {
    const tocFile = getFileMatching(files, /.*toc[.]ncx$/);
    if (!tocFile) {
        console.log("No Table of Contents found");
        return null;
    }
    return parseToc(tocFile.content);
}

// Predicate to determine if a chapter must be filtered based on the parsed content.
export function filterChapter(chapter) {
    // Remove sections without content
    return chapter.blocks.length < 2;
}

// Extracts the content from all chapters present in the ePub.
export function extractChapters(files) {
    const toc = extractToc(files);
    const chapters = [];
    for (let i = 0; i < toc.length; i++) {
        const chapter = toc[i];
        for (let f = 0; f < files.length; f++) {
            const file = files[f];
            if (file.filename.endsWith(chapter.filename)) {
                const newChapter = {
                    title: chapter.title,
                    blocks: parseFile(file.content),
                };
                if (!filterChapter(newChapter)) {
                    chapters.push(newChapter);
                }
                break;
            }
        }
    }
    return chapters;
}

/**
 * Extract the content from a raw ePub file.
 *
 * @param {File} file The first file of the FileList object received from a HTML input file.
 * @return {Object} The file content parsed in the standard format.
 */
export function readEpub(file) {

    return new Promise((resolve, reject) => {
        getEntries(file).then((entries) => {
            const promises = [];
            // Filter binary files like jpg
            const isTextEntry = (entry) => {
                const epubEntryExtensions = ["xhtml", "html", "xml", "ncx"];
                for (let i = 0; i < epubEntryExtensions.length; i++) {
                    if (entry.filename.endsWith(epubEntryExtensions[i])) {
                        return true;
                    }
                }
                return false;
            };

            // Traverse all entries
            entries.forEach(entry => {
                if (!isTextEntry(entry)) return;
                // Retrieve the file content for every chapter files
                promises.push(getEntryFile(entry));
            });
            Promise.all(promises).then(files => {
                const chapters = extractChapters(files);
                resolve({
                    id: `content-epub-${file.name}`,
                    type: "epub",
                    description: {
                        title: `ePub ${file.name}`, // TODO retrieve the book's name and author from the file
                        author: "Unknown",
                    },
                    content: {
                        sections: chapters,
                    },
                    size: file.size,
                    reloadable: false,
                    saveOnLocalStorage: false, // EPUBs can contain images and exceed the available space.
                });
            });
        }).catch(err => {
            reject(err);
        });
    });
}

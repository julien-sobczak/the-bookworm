

// Import zip.js
const zip = window.zip;

// Code based on https://github.com/gildas-lormeau/zip.js/blob/gh-pages/demos/demo2.js
const getEntries = file => {
    return new Promise((resolve, reject) => {
        zip.createReader(new zip.BlobReader(file), zipReader => {
            zipReader.getEntries((entries) => {
                resolve(entries);
            });
        }, reject)
    });
};
const getEntryFile = entry => {
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
};


// Reads the TOC file and determine the list of chapters
export const parseToc = content => {
    const toc = [];
    const tocDoc = new DOMParser().parseFromString(content, "application/xml");
    const chapters = [...tocDoc.querySelectorAll('navPoint')]; // converts NodeList to Array
    chapters.forEach(element => {
        const text = element.querySelector('text').innerHTML;
        const filename = element.querySelector('content').getAttribute('src');
        toc.push({
            title: text,
            filename: filename,
        })
    })

    return toc;
}

// Parses a text files to extract the HTML readable content.
export const parseFile = content => {

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
    }

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
export const getFileMatching = (files, regex) => {
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (regex.test(file.filename)) {
            return file;
        }
    }
    return undefined;
}

// Reads the TOC file and determine the list of chapters
export const extractToc = files => {
    const tocFile = getFileMatching(files, /.*toc[.]ncx$/);
    if (!tocFile) return null;

    return parseToc(tocFile.content);
}

export const filterChapter = chapter => {
    // Remove sections without content
    return chapter.blocks.length < 2;
}

// Extracts the content from all chapters present in the ePub.
export const extractChapters = (files) => {
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
                }
                if (!filterChapter(newChapter)) {
                    chapters.push(newChapter);
                }
                break;
            }
        }
    }
    return chapters;
}

export const readEpub = file => {

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
            }
            entries.forEach(entry => {
                if (!isTextEntry(entry)) return;
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
                    reloadable: false,
                    saveOnLocalStorage: true,
                });
            });
        })
        .catch(err => {
            reject(err);
        });
    });
}

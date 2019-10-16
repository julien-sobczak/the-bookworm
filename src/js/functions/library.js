import * as string from './string';

const CATALOG_URL = "https://open-library-books.firebaseapp.com/catalog.json";

/**
 * Download the catalog.
 *
 * @returns {Promise} a Promise containing the downloaded catalog.
 */
export function downloadCatalog() {
    console.log(`Downloading ${CATALOG_URL}...`);
    return fetch(CATALOG_URL)
        .then((response) => {
            return response.json();
        })
}

/**
 * Convert a Copy/Paste text to the standard format.
 *
 * @param {string} rawText The raw text pasted by the user
 * @return {Object} The parsed content
 */
export function parsePaste(rawText) {
    const blocks = [];

    const lines = rawText.split('\n');
    for (let l = 0; l < lines.length; l++) {

        const line = lines[l];

        if (line.trim() === '') {
            continue;
        }

        blocks.push({ tag: "p", content: line })
    }

    return {
        sections: [
            {
                title: string.headline(blocks[0].content),
                blocks: blocks,
            }
        ]
    };
}

/**
 * Convert a Gutenberg book to the standard format.
 *
 * @param {string} rawContent The Gutenberg TXT book content
 * @param {Object} metadata The book metadata
 * @return {Object} The parsed book
 */
export function parseLiterature(rawContent, metadata) {
    const content = {
        sections: [],
    };


    for (let c = 0; c < metadata.chapters.length; c++) {
        const chapterMetadata = metadata.chapters[c];
        const lines = rawContent.split('\r\n').slice(chapterMetadata.start - 1, chapterMetadata.end + 1);
        const chapterBlocks = [];

        // Parse the chapter lines
        let currentBlock = undefined;
        for (let l = 0; l < lines.length; l++) {
            const line = lines[l];

            // New file = end of the previous block
            if (line.trim() === '') {
                if (currentBlock) {
                    chapterBlocks.push(currentBlock);
                    currentBlock = undefined;
                }
            }

            // Block continuation?
            if (!currentBlock) {
                currentBlock = { tag: "p", content: line, sourceLine: l, };
            } else {
                currentBlock.content += ' ' + line;
            }
        }
        // Do not forget to add the last block
        if (currentBlock) {
            chapterBlocks.push(currentBlock);
        }

        content.sections.push({
            title: chapterMetadata.title,
            blocks: chapterBlocks,
        });
    }

    return content;
}

/**
 * Download a content.
 *
 * @param {Object} description The content description containing required information to locate the content.
 * @returns {Promise} a Promise containing the downloaded document.
 */
export function downloadContent(description) {
    if (description.type === "literature") {
        const contentUrl = `https://open-library-books.firebaseapp.com/gutenberg/${description.slug}.txt`;
        const metadataUrl = `https://open-library-books.firebaseapp.com/gutenberg/${description.slug}.json`;
        console.log(`Downloading ${contentUrl}...`);
        console.log(`Downloading ${metadataUrl}...`);

        return new Promise(function (resolve, reject) {
            Promise.all([
                fetch(contentUrl).then(response => { return response.text(); }),
                fetch(metadataUrl).then((response) => { return response.json(); }),
            ]).then(([rawContent, metadata]) => {
                const content = parseLiterature(rawContent, metadata)

                resolve({
                    id: `content-book-${description.slug}`,
                    type: "book",
                    description: description,
                    content: content,
                    reloadable: true,
                })
            });
        });
    }

    throw new Error(`Unsupported type ${description.type}`);
};

export function getReading(readings, content) {
    if (Array.isArray(readings)) {
        for (let i = 0; i < readings.length; i++) {
            const reading = readings[i];
            if (JSON.stringify(reading.description) === JSON.stringify(content.description)) {
                // Reading in-progress
                return reading;
            }
        }
        // New reading
        return {
            id: content.id,
            type: content.type,
            description: content.description,
            localStorage: content.id,
            position: {
                section: 0,
                block: 0,
                progress: 0,
            },
            reloadable: content.reloadable,
            lastDate: new Date().toJSON(),
        }
    } else {
        return readings;
    }
}

/**
 * Calculate the next blocks to read.
 *
 * @param {Array} reading The current reading
 * @param {Object} content The content currently selected
 * @param {Object} The content to read compatible with text-based drills.
 */
export function next(reading, content) {
    const { section, block } = reading.position;

    const currentSection = content.content.sections[section];
    const text = [];
    if (currentSection.title) {
        text.push({ tag: "h2", content: currentSection.title });
    }
    text.push(...currentSection.blocks.slice(block));

    return {
        type: content.type,
        title: content.description.title,
        author: content.description.author,
        subtitle: currentSection.title,
        text: text,
    };
}

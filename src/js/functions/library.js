import * as string from './string';
import * as wpm from './wpm';

/** URL of the library catalog. */
const CATALOG_URL = "https://open-library-books.web.app/catalog.json";

// Based on table https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
const languagesISO = {
    "Abkhazian": "ab",
    "Afar": "aa",
    "Afrikaans": "af",
    "Akan": "ak",
    "Albanian": "sq",
    "Amharic": "am",
    "Arabic": "ar",
    "Aragonese": "an",
    "Armenian": "hy",
    "Assamese": "as",
    "Avaric": "av",
    "Avestan": "ae",
    "Aymara": "ay",
    "Azerbaijani": "az",
    "Bambara": "bm",
    "Bashkir": "ba",
    "Basque": "eu",
    "Belarusian": "be",
    "Bengali": "bn",
    "Bihari": "bh",
    "Bislama": "bi",
    "Bosnian": "bs",
    "Breton": "br",
    "Bulgarian": "bg",
    "Burmese": "my",
    "Catalan": "ca",
    "Chamorro": "ch",
    "Chechen": "ce",
    "Chichewa": "ny",
    "Chinese": "zh",
    "Chuvash": "cv",
    "Cornish": "kw",
    "Corsican": "co",
    "Cree": "cr",
    "Croatian": "hr",
    "Czech": "cs",
    "Danish": "da",
    "Divehi": "dv",
    "Dutch": "nl",
    "Dzongkha": "dz",
    "English": "en",
    "Esperanto": "eo",
    "Estonian": "et",
    "Ewe": "ee",
    "Faroese": "fo",
    "Fijian": "fj",
    "Finnish": "fi",
    "French": "fr",
    "Fulah": "ff",
    "Galician": "gl",
    "Georgian": "ka",
    "German": "de",
    "Greek": "el",
    "Guarani": "gn",
    "Gujarati": "gu",
    "Haitian": "ht",
    "Hausa": "ha",
    "Hebrew": "he",
    "Herero": "hz",
    "Hindi": "hi",
    "Hiri Motu": "ho",
    "Hungarian": "hu",
    "Interlingua": "ia",
    "Indonesian": "id",
    "Interlingue": "ie",
    "Irish": "ga",
    "Igbo": "ig",
    "Inupiaq": "ik",
    "Ido": "io",
    "Icelandic": "is",
    "Italian": "it",
    "Inuktitut": "iu",
    "Japanese": "ja",
    "Javanese": "jv",
    "Kalaallisut": "kl",
    "Kannada": "kn",
    "Kanuri": "kr",
    "Kashmiri": "ks",
    "Kazakh": "kk",
    "Central Khmer": "km",
    "Kikuyu": "ki",
    "Kinyarwanda": "rw",
    "Kirghiz": "ky",
    "Komi": "kv",
    "Kongo": "kg",
    "Korean": "ko",
    "Kurdish": "ku",
    "Kuanyama": "kj",
    "Latin": "la",
    "Luxembourgish": "lb",
    "Ganda": "lg",
    "Limburgan": "li",
    "Lingala": "ln",
    "Lao": "lo",
    "Lithuanian": "lt",
    "Luba-Katanga": "lu",
    "Latvian": "lv",
    "Manx": "gv",
    "Macedonian": "mk",
    "Malagasy": "mg",
    "Malay": "ms",
    "Malayalam": "ml",
    "Maltese": "mt",
    "Maori": "mi",
    "Marathi": "mr",
    "Marshallese": "mh",
    "Mongolian": "mn",
    "Nauru": "na",
    "Navajo": "nv",
    "North Ndebele": "nd",
    "Nepali": "ne",
    "Ndonga": "ng",
    "Norwegian": "no",
    "Sichuan Yi": "ii",
    "South Ndebele": "nr",
    "Occitan": "oc",
    "Ojibwa": "oj",
    "Oromo": "om",
    "Oriya": "or",
    "Ossetian": "os",
    "Punjabi": "pa",
    "Pali": "pi",
    "Persian": "fa",
    "Polish": "pl",
    "Pashto": "ps",
    "Portuguese": "pt",
    "Quechua": "qu",
    "Romansh": "rm",
    "Rundi": "rn",
    "Romanian": "ro",
    "Russian": "ru",
    "Sanskrit": "sa",
    "Sardinian": "sc",
    "Sindhi": "sd",
    "Northern Sami": "se",
    "Samoan": "sm",
    "Sango": "sg",
    "Serbian": "sr",
    "Gaelic": "gd",
    "Shona": "sn",
    "Sinhala": "si",
    "Slovak": "sk",
    "Slovenian": "sl",
    "Somali": "so",
    "Southern Sotho": "st",
    "Spanish": "es",
    "Sundanese": "su",
    "Swahili": "sw",
    "Swati": "ss",
    "Swedish": "sv",
    "Tamil": "ta",
    "Telugu": "te",
    "Tajik": "tg",
    "Thai": "th",
    "Tigrinya": "ti",
    "Tibetan": "bo",
    "Turkmen": "tk",
    "Tagalog": "tl",
    "Tswana": "tn",
    "Tonga": "to",
    "Turkish": "tr",
    "Tsonga": "ts",
    "Tatar": "tt",
    "Twi": "tw",
    "Tahitian": "ty",
    "Uighur": "ug",
    "Ukrainian": "uk",
    "Urdu": "ur",
    "Uzbek": "uz",
    "Venda": "ve",
    "Vietnamese": "vi",
    "Volapük": "vo",
    "Walloon": "wa",
    "Welsh": "cy",
    "Wolof": "wo",
    "Western Frisian": "fy",
    "Xhosa": "xh",
    "Yiddish": "yi",
    "Yoruba": "yo",
    "Zhuang": "za",
    "Zulu": "zu",
};

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
        });
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

        blocks.push({ tag: "p", content: line });
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
    if (description.origin === "gutenberg") {
        const contentUrl = `https://open-library-books.web.app/gutenberg/${description.slug}.txt`;
        const metadataUrl = `https://open-library-books.web.app/gutenberg/${description.slug}.json`;
        console.log(`Downloading ${contentUrl}...`);
        console.log(`Downloading ${metadataUrl}...`);

        return new Promise(function (resolve) {
            Promise.all([
                fetch(contentUrl).then(response => { return response.text(); }),
                fetch(metadataUrl).then((response) => { return response.json(); }),
            ]).then(([rawContent, metadata]) => {
                const content = parseLiterature(rawContent, metadata);

                resolve({
                    id: `content-book-${isoLanguage(description.language)}-${description.slug}`,
                    type: "book",
                    description: description,
                    content: content,
                    reloadable: true,
                    saveOnLocalStorage: true,
                });
            });
        });
    }

    throw new Error(`Unsupported origin ${description.origin}`);
}

/**
 * Convert the language name to the ISO code.
 *
 * @param {String} language The ISO language name
 * @return {String} The 639-1 ISO code
 */
export function isoLanguage(language) {
    if (language in languagesISO) return languagesISO[language];
    throw new Error(`Unsupported language ${language}`);
}

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
        };
    } else {
        return readings;
    }
}

/**
 * Calculate the next position from the last known position.
 *
 * @param {Object} lastPosition A position
 * @param {Object} content The parsed content
 * @return {Object} The new position
 */
export function nextPosition(lastPosition, content) {
    const completed = lastPosition.block === content.sections[lastPosition.section].blocks.length - 1; // Reach the end of the section
    const lastSection = lastPosition.section === content.sections.length - 1;
    const contentFinished = completed && lastSection;

    let newPosition = lastPosition;

    if (contentFinished) {
        newPosition = {
            // Start over
            section: 0,
            block: 0,
            progress: 100,
        };
    } else {
        if (completed) {
            // Advance to next section
            newPosition = {
                section: lastPosition.section + 1,
                block: 0,
            };
        } else {
            // Advance to next block
            newPosition = {
                section: lastPosition.section,
                block: lastPosition.block + 1,
            };
        }
        // TODO Tune the formula to consider blocks and section length
        newPosition.progress = newPosition.section * 100 / content.sections.length;
    }

    return newPosition;
}

/**
 * Calculate the next blocks to read.
 *
 * @param {Array} position The current position
 * @param {Object} content The content currently selected
 * @return {Object} The content to read compatible with text-based drills.
 */
export function nextContent(position, content) {
    const { section, block } = position;

    const currentSection = content.content.sections[section];
    const blocks = [];
    if (currentSection.title) {
        blocks.push({ tag: "h2", content: currentSection.title });
    }
    blocks.push(...currentSection.blocks.slice(block));

    return {
        type: content.type,
        title: content.description.title,
        author: content.description.author,
        subtitle: currentSection.title,
        blocks: blocks,
    };
}

function stripTags(str) {
    if (str === null || str === '') return str;
    str = str.toString();
    return str.replace(/<[^>]*>/g, '');
}

/**
 * Count the number of words based on the spaces.
 *
 * @param {string} str A text
 * @return {Number} The number of words
 */
export function countWords(str) {
    return stripTags(str).split(' ')
        .filter(function (n) { return n !== ''; })
        .length;
}

/**
 * Count the number of letters.
 *
 * @param {string} str A text
 * @return {Number} The number of readable letters
 */
export function countLetters(str) {
    // Filter HTML entities first
    return stripTags(str).length;
}

/**
 * Calculates drill statistics based on the input content.
 *
 * @param {Object} content The standard content format used by drills
 * @param {Number} durationInSeconds The elapsed drill duration
 * @return {Object} An object containing the list of statistics.
 */
export function statsContent(content, durationInSeconds) {
    let letters = 0;
    let words = 0;
    let paragraphs = 0;

    for (let b = 0; b < content.blocks.length; b++) {
        const block = content.blocks[b];
        paragraphs++;
        letters += block.content.length;
        words += countWords(block.content);
    }

    return {
        letters: letters,
        words: words,
        paragraphs: paragraphs,
        durationInSeconds: durationInSeconds,
        wpm: wpm.wpmFromLetters(letters, durationInSeconds),
    };
}

/**
 * Extract a subcontent from a content. Useful when the reader stops before the end of the drill.
 * In this case, statistics should only be evaluated on the read section.
 *
 * @param {Object} content
 * @param {Number} blockStart 0-based index of the first block to extract
 * @param {Number} blockEnd 0-based index of the last block to extract (not inclusive)
 * @return {Object} The "sub-"content
 */
export function extractContent(content, blockStart, blockEnd) {
    const subContent = {
        ...content,
        blocks: content.blocks.slice(blockStart, blockEnd),
    };
    return subContent;
}

/**
 * Calculates the drill statistics based on the pages.
 *
 * @param {Object} pages Pages as returned by the <Pager> component
 * @return {Object} An object containing the statistics
 */
export function statsPages(pages) {
    let chunks = 0;

    for (let p = 0; p < pages.length; p++) {
        const page = pages[p];
        for (let b = 0; b < page.blocks.length; b++) {
            const block = page.blocks[b];
            if (block.chunks) {
                chunks += block.chunks.filter(chunk => chunk.trim() !== '').length;
            }
        }
    }

    return {
        pages: pages.length,
        chunks: chunks,
    };
}

/**
 * Calculates the drill statistics based on the chunks.
 *
 * @param {Object} chunks Chunks as returned by the <Chunker> component
 * @return {Object} An object containing the statistics
 */
export function statsChunks(chunks) {
    return {
        chunks: chunks.length,
    };
}

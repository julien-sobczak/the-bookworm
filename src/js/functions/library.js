import * as string from './string';
import * as wpm from './wpm';
import { parseEpub } from '@gxl/epub-parser';
import { readEpub } from './epub';

/** URL of the library catalog. */
export const CATALOG_URL = "https://open-library-books.web.app/catalog.json";

/** List of languages present in the library. */
export const SUPPORTED_LANGUAGES = ['Dutch', 'English', 'French', 'German', 'Italian', 'Polish', 'Portuguese', 'Spanish'];

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

export class PasteParser {

    /**
     * Convert a Copy/Paste text to the standard format.
     *
     * @param {string} str The raw text pasted by the user
     * @return {Text} The parsed content
     */
    parse(str) {
        const blocks = [];

        const lines = str.split('\n');
        for (let l = 0; l < lines.length; l++) {

            const line = lines[l];

            if (line.trim() === '') {
                continue;
            }

            blocks.push({ tag: "p", content: line.trim() });
        }

        const content = {
            // Only one section
            sections: [
                {
                    title: string.headline(blocks[0].content),
                    blocks: blocks,
                }
            ]
        };

        return new Text(content);
    }
}

export class GutenbergParser {

    /**
     * Convert a Gutenberg book to the standard format.
     *
     * @param {string} rawContent The Gutenberg TXT book content
     * @param {Object} metadata The book metadata
     * @return {Object} The parsed book
     */
    parse(rawContent, metadata) {
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

        // Post-processing
        content.sections.forEach(section => {
            section.blocks.forEach(block => {
                block.content = GutenbergParser.postProcessBlock(block.content);
            });
        });

        return new GutenbergText(content, metadata.description);
    }

    /**
     * Apply some post-processing rules to the book content.
     *
     * @param {string} content A block content.
     * @returns {string} The updated content.
     */
    static postProcessBlock(content) {

        // Replace unusual space character 160 by the commonly found 32
        content = content.replace(new RegExp(String.fromCharCode(160), "g"), ' ');
        content = content.replace(/\s{2}/g, ' '); // <= Otherwise, this would not work.

        // Use emdash
        content = content.replace(/--/g, '—');

        // Use italic tags
        content = content.replace(/_(\w)/g, '<i>$1');
        content = content.replace(/(\w)_/g, '$1</i>');

        return content;
    }
}

export class EpubParser {

    /**
     * Extract the content from a raw ePub file.
     *
     * @param {File} file The first file of the FileList object received from a HTML input file.
     * @return {Promise<Text>} The parsed file text.
     */
    parse(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            parseEpub(Buffer.from(event.target.result)).then(result => {
                const htmlObjects = result.sections[1].toHtmlObjects();
                console.log(htmlObjects);
            });
        };
        reader.readAsArrayBuffer(file);
        return readEpub(file).then(content => new Text(content));
    }

}


/**
 * Download a content.
 *
 * @param {Object} description The content description containing required information to locate the content.
 * @returns {Promise} a Promise containing the downloaded document.
 */
export function downloadContent(description) { // TODO rename downloadFromCatalog
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
                const content = new GutenbergParser().parse(rawContent, metadata);

                resolve({
                    id: `content-book-${isoLanguage(description.language)}-${description.slug}`,
                    type: "book",
                    description: description,
                    content: content,
                    reloadable: true,
                    size: 0,
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
            },
            progress: 0,
            size: content.size,
            reloadable: content.reloadable,
            lastDate: new Date().toJSON(),
        };
    } else {
        return readings;
    }
}


/**
 * Initial position inside a text.
 */
const STARTING_POSITION = {
    section: 0, // First section
    block: 0, // First block
};

/**
 * Standard format for drills requiring a text.
 */
export class Text {

    constructor(content, description) {
        if (!Text.valid(content)) {
            throw new Error("Content is malformed");
        }
        this.content = content;
        this.description = description;
        this.reloadable = false;
        this.size = 0;
        this.saveOnLocalStorage = false;
        this.position = STARTING_POSITION;
    }

    /**
     * Places the reading cursor at a new position.
     *
     * @param {Object} position The new position.
     */
    seekPosition(position) {
        this.position = position;
    }

    /**
     * Moves right after the given position.
     *
     * @param {Object} referencePosition The position.
     */
    seekAfterPosition({ section, block }) {
        const referenceSection = this.content.section[section];
        if (referenceSection.blocks.length > block) { // In the middle of a section
            this.position = {
                section: section,
                block: block + 1,
            };
        } else if (section === this.content.sections.length - 1) { // End of the text
            // Move to last block
            this.position = {
                section: this.content.sections.length - 1,
                block: this.content.sections[this.content.sections.length - 1].blocks.length - 1,
            };
        } else { // End of a section
            // Move to next section
            this.position = {
                section: section + 1,
                block: 0,
            };
        }
    }

    /**
     * Returns the reading progress based on the current position.
     *
     * @return {Number} The percent between 0-100 inclusive.
     */
    progress() {
        // Not started
        if (!this.inProgress()) return 0;

        // Finished
        if (this.finished()) return 100;

        let readBlocks = 0;
        let remainingBlocks = 0;
        const { section, block } = this.position;
        this.content.sections.forEach((s, i) => {
            if (i < section) {
                readBlocks += s.blocks.length;
            } else if (i > section) {
                remainingBlocks += s.blocks.length;
            } else {
                readBlocks += block;
                remainingBlocks += s.blocks.length - block;
            }
        });
        const totalBlocks = readBlocks + remainingBlocks;
        return Math.floor(readBlocks * 100 / totalBlocks);
    }

    /**
     * Returns if the current reading has started or not.
     *
     * @returns {bool} True if the position has changed.
     */
    inProgress() {
        return this.position.section !== 0 || this.position.block !== 0;
    }

    /**
     * Returns if the current reading is finished.
     *
     * @returns {bool} True if there is no more text to read.
     */
    finished() {
        const { section, block } = this.position;
        const lastSection = section === this.content.sections.length - 1;
        const lastBlock = block === this.content.sections[section].blocks.length - 1;
        return lastSection && lastBlock;
    }

    /**
     * Returns the current section.
     *
     * @return {Section} The section.
     */
    currentSection() {
        return new Section(this.content.content[this.position.section]);
    }

    /**
     * Calculate the next position from the last known position.
     *
     * @return {Object} The new position
     */
    nextPosition() {
        const lastPosition = this.position;
        const content = this.content;

        const sectionCompleted = lastPosition.block === content.sections[lastPosition.section].blocks.length - 1; // Reach the end of the section
        const lastSection = lastPosition.section === content.sections.length - 1;
        const contentFinished = sectionCompleted && lastSection;

        let newPosition = lastPosition;

        if (contentFinished) {
            newPosition = {
                section: this.content.sections.length - 1,
                block: this.content.sections[this.content.sections.length - 1].blocks.length - 1,
            };
        } else {
            if (sectionCompleted) {
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
     * Returns an extract of the next section or the end of the current section if not finished.
     *
     * @param {Array} position The current position
     * @param {Object} content The content currently selected
     * @return {Extract} The extract to read during the drill session.
     */
    extractUntilNextSection() {
        const { section, block } = this.position;

        const currentSection = this.currentSection();
        const blocks = [];
        if (currentSection.title) {
            blocks.push({ tag: "h2", content: currentSection.title });
        }
        blocks.push(...currentSection.blocks.slice(block));

        const startPosition = this.position;
        const endPosition = {
            section: section,
            block: currentSection.blocks.length - 1,
        };

        return new Extract(this, currentSection.title, blocks, startPosition, endPosition);
    }

    /**
     * Returns an extract that the user could complete in the given number of minutes when reading at the specified WPM.
     *
     * @param {Number} durationInMin The maximum reading duration.
     * @param {Number} targetWPM The WPM.
     * @return {Extract} The extract to read during the drill session.
     */
    extractForNMinutes(durationInMin, targetWPM) {
        const maxDurationInMs = durationInMin * 60 * 1000;
        const currentSection = this.currentSection();

        const blocks = [];

        let { s, b } = this.position;
        let totalDurationInMs = 0;

        const startPosition = this.position;
        let endPosition = {
            section: s,
            block: b,
        };

        let found = false;
        while (!found) {
            const nextBlock = this.content.sections[s].blocks[b];
            const blockDurationInMs = wpm.textDuration(nextBlock.content, targetWPM);
            if (totalDurationInMs + blockDurationInMs > maxDurationInMs) {
                found = true;
                break;
            }
            blocks.push(nextBlock);
            endPosition = {
                section: s,
                block: b,
            };

            if (b + 1 === this.content.sections[s].blocks.length) { // End of section
                if (s + 1 === this.content.sections.length) { // End of text
                    found = true;
                    break;
                }
                s++;
            } else {
                b++;
            }
        }

        return new Extract(this, currentSection.title, blocks, startPosition, endPosition);
    }

    /**
     * Returns various statistics about the text.
     *
     * @return {Object} The statistics.
     */
    stats() {
        return {
            // TODO
        };
    }

    get id() {
        return `content-${this.type}-${isoLanguage(this.description.language)}-${this.description.slug}`;
    }

    /**
     * Test a content.
     *
     * @param {Object} content The content to read
     * @returns {bool} True if the content is valid and can be read.
     */
    static valid(content) {
        // Must contains at least one section
        return content && content.sections && content.sections.length > 0;
    }

}

class GutenbergText extends Text {
    constructor(content, description) {
        super(content, description);
        this.type = 'book';
        this.reloadable = true;
        this.size = 0;
        this.saveOnLocalStorage = true;
    }
}

/**
 * Represents a single section inside the text.
 */
export class Section {

    constructor(section) {
        this.blocks = section.block;
    }

    /**
     * Returns various statistics about the text.
     *
     * @return {Object} The statistics.
     */
    stats() {
        return {
            // TODO
        };
    }
}

/**
 * Represents an extract of th text to read during a drill session.
 */
export class Extract {

    constructor(text, title, blocks, startPosition, endPosition) {
        this.type = text.type;
        this.title = text.description.title;
        this.author = text.description.author;
        this.subtitle = title;
        this.blocks = blocks;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
    }

    /**
     * Returns various statistics about the text.
     *
     * @return {Object} The statistics.
     */
    stats() {
        return {
            // TODO
        };
    }
}



/**
 * Calculates drill statistics based on the input content.
 *
 * @param {Object} content The standard content format used by drills
 * @param {Number} durationInSeconds The elapsed drill duration
 * @return {Object} An object containing the list of statistics.
 */
export function statsContent(content, durationInSeconds) { // TODO remove
    let letters = 0;
    let words = 0;
    let paragraphs = 0;

    for (let b = 0; b < content.blocks.length; b++) {
        const block = content.blocks[b];
        paragraphs++;
        letters += block.content.length;
        words += string.countWords(block.content);
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
export function extractContent(content, blockStart, blockEnd) { // TODO remove
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

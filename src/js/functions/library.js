import * as string from './string';
import * as wpm from './wpm';

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
                    id: `content-book-${isoLanguage(description.language)}-${description.slug}`,
                    type: "book",
                    description: description,
                    content: content,
                    reloadable: true,
                    saveOnLocalStorage: true,
                })
            });
        });
    }

    throw new Error(`Unsupported type ${description.type}`);
};

/**
 * Convert the language name to the ISO code. 
 * 
 * @param {String} language The ISO language name
 * @return {Stirng} The 639-1 ISO code 
 */
export function isoLanguage(language) {
    // Based on table https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    switch (language) {
        case "Abkhazian":
            return "ab";
        case "Afar":
            return "aa";
        case "Afrikaans":
            return "af";
        case "Akan":
            return "ak";
        case "Albanian":
            return "sq";
        case "Amharic":
            return "am";
        case "Arabic":
            return "ar";
        case "Aragonese":
            return "an";
        case "Armenian":
            return "hy";
        case "Assamese":
            return "as";
        case "Avaric":
            return "av";
        case "Avestan":
            return "ae";
        case "Aymara":
            return "ay";
        case "Azerbaijani":
            return "az";
        case "Bambara":
            return "bm";
        case "Bashkir":
            return "ba";
        case "Basque":
            return "eu";
        case "Belarusian":
            return "be";
        case "Bengali":
            return "bn";
        case "Bihari":
            return "bh";
        case "Bislama":
            return "bi";
        case "Bosnian":
            return "bs";
        case "Breton":
            return "br";
        case "Bulgarian":
            return "bg";
        case "Burmese":
            return "my";
        case "Catalan":
            return "ca";
        case "Chamorro":
            return "ch";
        case "Chechen":
            return "ce";
        case "Chichewa":
            return "ny";
        case "Chinese":
            return "zh";
        case "Chuvash":
            return "cv";
        case "Cornish":
            return "kw";
        case "Corsican":
            return "co";
        case "Cree":
            return "cr";
        case "Croatian":
            return "hr";
        case "Czech":
            return "cs";
        case "Danish":
            return "da";
        case "Divehi":
            return "dv";
        case "Dutch":
            return "nl";
        case "Dzongkha":
            return "dz";
        case "English":
            return "en";
        case "Esperanto":
            return "eo";
        case "Estonian":
            return "et";
        case "Ewe":
            return "ee";
        case "Faroese":
            return "fo";
        case "Fijian":
            return "fj";
        case "Finnish":
            return "fi";
        case "French":
            return "fr";
        case "Fulah":
            return "ff";
        case "Galician":
            return "gl";
        case "Georgian":
            return "ka";
        case "German":
            return "de";
        case "Greek":
            return "el";
        case "Guarani":
            return "gn";
        case "Gujarati":
            return "gu";
        case "Haitian":
            return "ht";
        case "Hausa":
            return "ha";
        case "Hebrew":
            return "he";
        case "Herero":
            return "hz";
        case "Hindi":
            return "hi";
        case "Hiri Motu":
            return "ho";
        case "Hungarian":
            return "hu";
        case "Interlingua":
            return "ia";
        case "Indonesian":
            return "id";
        case "Interlingue":
            return "ie";
        case "Irish":
            return "ga";
        case "Igbo":
            return "ig";
        case "Inupiaq":
            return "ik";
        case "Ido":
            return "io";
        case "Icelandic":
            return "is";
        case "Italian":
            return "it";
        case "Inuktitut":
            return "iu";
        case "Japanese":
            return "ja";
        case "Javanese":
            return "jv";
        case "Kalaallisut":
            return "kl";
        case "Kannada":
            return "kn";
        case "Kanuri":
            return "kr";
        case "Kashmiri":
            return "ks";
        case "Kazakh":
            return "kk";
        case "Central Khmer":
            return "km";
        case "Kikuyu":
            return "ki";
        case "Kinyarwanda":
            return "rw";
        case "Kirghiz":
            return "ky";
        case "Komi":
            return "kv";
        case "Kongo":
            return "kg";
        case "Korean":
            return "ko";
        case "Kurdish":
            return "ku";
        case "Kuanyama":
            return "kj";
        case "Latin":
            return "la";
        case "Luxembourgish":
            return "lb";
        case "Ganda":
            return "lg";
        case "Limburgan":
            return "li";
        case "Lingala":
            return "ln";
        case "Lao":
            return "lo";
        case "Lithuanian":
            return "lt";
        case "Luba-Katanga":
            return "lu";
        case "Latvian":
            return "lv";
        case "Manx":
            return "gv";
        case "Macedonian":
            return "mk";
        case "Malagasy":
            return "mg";
        case "Malay":
            return "ms";
        case "Malayalam":
            return "ml";
        case "Maltese":
            return "mt";
        case "Maori":
            return "mi";
        case "Marathi":
            return "mr";
        case "Marshallese":
            return "mh";
        case "Mongolian":
            return "mn";
        case "Nauru":
            return "na";
        case "Navajo":
            return "nv";
        case "North Ndebele":
            return "nd";
        case "Nepali":
            return "ne";
        case "Ndonga":
            return "ng";
        case "Norwegian":
            return "no";
        case "Sichuan Yi":
            return "ii";
        case "South Ndebele":
            return "nr";
        case "Occitan":
            return "oc";
        case "Ojibwa":
            return "oj";
        case "Oromo":
            return "om";
        case "Oriya":
            return "or";
        case "Ossetian":
            return "os";
        case "Punjabi":
            return "pa";
        case "Pali":
            return "pi";
        case "Persian":
            return "fa";
        case "Polish":
            return "pl";
        case "Pashto":
            return "ps";
        case "Portuguese":
            return "pt";
        case "Quechua":
            return "qu";
        case "Romansh":
            return "rm";
        case "Rundi":
            return "rn";
        case "Romanian":
            return "ro";
        case "Russian":
            return "ru";
        case "Sanskrit":
            return "sa";
        case "Sardinian":
            return "sc";
        case "Sindhi":
            return "sd";
        case "Northern Sami":
            return "se";
        case "Samoan":
            return "sm";
        case "Sango":
            return "sg";
        case "Serbian":
            return "sr";
        case "Gaelic":
            return "gd";
        case "Shona":
            return "sn";
        case "Sinhala":
            return "si";
        case "Slovak":
            return "sk";
        case "Slovenian":
            return "sl";
        case "Somali":
            return "so";
        case "Southern Sotho":
            return "st";
        case "Spanish":
            return "es";
        case "Sundanese":
            return "su";
        case "Swahili":
            return "sw";
        case "Swati":
            return "ss";
        case "Swedish":
            return "sv";
        case "Tamil":
            return "ta";
        case "Telugu":
            return "te";
        case "Tajik":
            return "tg";
        case "Thai":
            return "th";
        case "Tigrinya":
            return "ti";
        case "Tibetan":
            return "bo";
        case "Turkmen":
            return "tk";
        case "Tagalog":
            return "tl";
        case "Tswana":
            return "tn";
        case "Tonga":
            return "to";
        case "Turkish":
            return "tr";
        case "Tsonga":
            return "ts";
        case "Tatar":
            return "tt";
        case "Twi":
            return "tw";
        case "Tahitian":
            return "ty";
        case "Uighur":
            return "ug";
        case "Ukrainian":
            return "uk";
        case "Urdu":
            return "ur";
        case "Uzbek":
            return "uz";
        case "Venda":
            return "ve";
        case "Vietnamese":
            return "vi";
        case "Volapük":
            return "vo";
        case "Walloon":
            return "wa";
        case "Welsh":
            return "cy";
        case "Wolof":
            return "wo";
        case "Western Frisian":
            return "fy";
        case "Xhosa":
            return "xh";
        case "Yiddish":
            return "yi";
        case "Yoruba":
            return "yo";
        case "Zhuang":
            return "za";
        case "Zulu":
            return "zu";
        default:
            throw new Error(`Unsupported language ${language}`);
    }



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
        }
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
            }
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
        .filter(function (n) { return n !== '' })
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
    }
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
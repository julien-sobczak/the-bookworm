
/**
 * Returns the input text with the first letter capitalized.
 *
 * @param {string} s A text
 * @returns {string} The same text capitalized
 */
export function capitalize(s) {
    if (typeof s !== 'string') return '' + s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Return a randomly generated 15-characters string.
 *
 * @returns {string} A random string
 */
export function uid() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (let i = 0; i < 15; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Returns a short string containing the beginning of the text
 *
 * @param {string} text A text
 */
export function headline(text, maxCharacters = 20) {
    if (text.length < maxCharacters) {
        return text;
    }
    const ellipsis = '...';
    const maxPrintableText = text.substring(0, maxCharacters - ellipsis.length);
    const splitIndex = maxPrintableText.lastIndexOf(' ');
    if (splitIndex > 10) {
        // Found a space where to split
        return maxPrintableText.substring(0, splitIndex) + ellipsis;
    } else {
        // No acceptable space to split
        return maxPrintableText + ellipsis;
    }
}


/**
 * Formats a raw date to a more human readable format.
 * Example:
 * "2019-04-23T18:25:43.511Z" => "6 month ago"
 * "2019-09-23T18:25:43.511Z" => "last week"
 * "2019-09-29T18:25:43.511Z" => "yesterday, 18:25"
 *
 * @param {string} jsonDate A date formatted using `Date.toJson`.
 * @param {string} reference The date for comparison. Mainly for testing purposes.
 * @param {string} useUTC Use UTC hour in the output. Mainly for testing purposes.
 * @returns {string} The formatted date
 */
export function humanReadableDate(jsonDate, reference=new Date(), useUTC=false) {
    const date = new Date(jsonDate);
    const now = reference;

    if (date.getFullYear() !== now.getFullYear()) {
        const diff = now.getFullYear() - date.getFullYear();
        if (diff === 1) {
            return "last year";
        } else {
            return `${diff} years ago`;
        }
    }

    if (date.getMonth() !== now.getMonth()) {
        const diff = now.getMonth() - date.getMonth();
        if (diff === 1) {
            return "last month";
        } else {
            return `${diff} months ago`;
        }
    }

    const hour = (useUTC) ?
        `${date.getUTCHours()}:${date.getUTCMinutes()}` :
        `${date.getHours()}:${date.getMinutes()}`;

    if (date.getDate() !== now.getDate()) {
        const diff = now.getDate() - date.getDate();
        if (diff === 1) {
            return `yesterday, ${hour}`;
        } else {
            return `${diff} days ago`;
        }
    }

    return `today, ${hour}`;
}

/**
 * Formats the number of bytes to the closest logical unit.
 * Based on https://stackoverflow.com/a/20732091.
 *
 * @param {Number} size A number of bytes
 * @return {string} The formated size
 */
export function humanReadableSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const precision = (i < 2) ? 0 : 2; // Ignore decimals for small units
    return (size / Math.pow(1024, i)).toFixed(precision) * 1 + ' ' + ['bytes', 'kb', 'mb', 'gb', 'tb'][i];
}

/**
 * Formats the number of seconds to the closest logical temporal unit.
 *
 * @param {Number} durationInSeconds A number of seconds
 * @return {string} The formated duration
 */
export function humanReadableShortDuration(durationInSeconds) {
    if (durationInSeconds < 60) {
        return `${durationInSeconds}s`;
    }
    const minutes = parseInt(durationInSeconds / 60);
    const seconds = durationInSeconds - minutes * 60;

    let result = `${minutes}min`;
    if (seconds > 0) {
        result += ` ${seconds}s`;
    }
    return result;
}


/**
 * Formats the number of seconds to the closest logical temporal unit.
 *
 * @param {Number} durationInSeconds A number of seconds
 * @return {string} The formated duration
 */
export function humanReadableLongDuration(durationInSeconds) {
    if (!durationInSeconds) return "0 second";
    if (durationInSeconds < 60) {
        if (durationInSeconds === 1) {
            return '1 second';
        } else {
            return `${durationInSeconds} seconds`;
        }
    }
    const minutes = parseInt(durationInSeconds / 60);
    const seconds = durationInSeconds - minutes * 60;

    let result = `${minutes} minutes`;
    if (minutes === 1) {
        result = '1 minute';
    }
    if (seconds > 0) {
        if (seconds === 1) {
            result += ' 1 second';
        } else {
            result += ` ${seconds} seconds`;
        }
    }
    return result;
}

/**
 * Strips HTML tags from the input string and returns the results.
 *
 * @param {string} str A string containing optional HTML tags
 */
export function stripTags(str) {
    return str.replace(/(<([^>]+)>)/ig,"");
}

/** Valid separators between two words. */
export const WORD_DELIMETERS = [
    ' ', '\t',      // spaces
    '--', '—', '–', // em-dash in text files in Gutenberg, em dash, en dash
];

/**
 * Returns the start/end indices of each word present in the line.
 *
 * @param {string} line A text line
 */
export function wordDelims(line) {
    const words = [];
    let start = 0;
    for (let i = 0; i < line.length; i++) {
        const extract = line.substring(i, i+2); // Separators have maximum 2 characters
        for (let d = 0; d < WORD_DELIMETERS.length; d++) {
            const delimiter = WORD_DELIMETERS[d];
            if (extract.startsWith(delimiter)) {
                if (i - start >= 1) { // A word must have at least one character
                    words.push([start, i-1]);
                }
                start = i+delimiter.length;
                break;
            }
        }
    }
    // Don't forget the last word
    if (start < line.length) {
        words.push([start, line.length-1]);
    }
    return words;
}

/**
 * Split the line into words.
 * Ex: "This is a test": => [
 *   { text: "This", start: 0,  end: 3,  word: true  },
 *   { text: " ",    start: 4,  end: 4,  word: false },
 *   { text: "is",   start: 5,  end: 6,  word: true  },
 *   { text: " ",    start: 7,  end: 7,  word: false },
 *   { text: "a",    start: 8,  end: 8,  word: true  },
 *   { text: " ",    start: 9,  end: 9,  word: false },
 *   { text: "test", start: 10, end: 13, word: true  },
 * ]
 * @param {string} line The line to parse
 */
export function splitWords(line) {
    const words = wordDelims(line);
    if (words.length === 0) {
        return [];
    }

    const results = [];
    let lastCharacter = 0;
    words.forEach(([start, end]) => {
        if (lastCharacter !== start) {
            results.push({
                text: line.substring(lastCharacter, start),
                start: lastCharacter,
                end: start-1,
                word: false,
            });
        }
        results.push({
            text: line.substring(start, end+1),
            start: start,
            end: end,
            word: true,
        });
        lastCharacter = end+1;
    });
    if (lastCharacter < line.length - 1) {
        results.push({
            text: line.substring(lastCharacter),
            start: lastCharacter,
            end: line.length-1,
            word: false,
        });
    }

    return results;
}

/**
 * Display the line with the words highlighted with brackets.
 * Example: "This is a--test" => "[This] [is] [a]--[test]"
 *
 * @param {string} line The line to parse
 */
export function showWords(line) {
    const words = wordDelims(line);
    if (words.length === 0) {
        return line;
    }

    let result = "";
    let currentWordIndex = -1;
    let lastWordIndex = -1;
    for (let i = 0; i < line.length; i++) {
        if (currentWordIndex === -1 && i === words[lastWordIndex+1][0]) {
            currentWordIndex = lastWordIndex+1;
            result += "[";
        }
        result += line[i];
        if (currentWordIndex !== -1 && i === words[currentWordIndex][1]) {
            result += "]";
            lastWordIndex = currentWordIndex;
            currentWordIndex = -1;
        }

    }

    return result;
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

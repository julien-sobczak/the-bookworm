
/**
 * Return the input text with the first letter capitalized.
 *
 * @param {string} s A text
 * @returns {string} The same text capitalized
 */
export function capitalize(s) {
    if (typeof s !== 'string') return '';
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
 * Return a short string containing the beginning of the text
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
 * Format a raw date to a more human readable format.
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
 * Format the number of bytes to the closest logical unit.
 * Based on https://stackoverflow.com/a/20732091.
 *
 * @param {Number} size A number of bytes
 * @return {string} The formated size
 */
export function humanReadableSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const precision = (i < 2) ? 0 : 2; // Ignore decimals for small units
    return (size / Math.pow(1024, i)).toFixed(precision) * 1 + ' ' + ['bytes', 'kb', 'mb', 'gb', 'tb'][i];
};

/**
 * Format the number of seconds to the closest logical temporal unit.
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
};


/**
 * Format the number of seconds to the closest logical temporal unit.
 *
 * @param {Number} durationInSeconds A number of seconds
 * @return {string} The formated duration
 */
export function humanReadableLongDuration(durationInSeconds) {
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
};
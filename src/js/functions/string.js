
/**
 * Return the input text with the first letter capitalized.
 *
 * @param {string} s A text
 * @returns {string} The same text capitalized
 */
export function capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
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

const charactersPerWord = 5; // https://en.wikipedia.org/wiki/Words_per_minute
const minimumEyeFixationDuration = 275;

/**
 * Return how many milliseconds the user is allowed to read this chunk.
 * @param {string} chunk
 * @returns {number} The number of ms to wait before the next chunk
 */
export function textDuration(text, wpm) {
    if (!text || !wpm) return 0;

    // Remove HTML tags in the text
    let stripedText = text.replace(/<[^>]+>/g, '');

    // How to calculate the duration?
    // 150 words per minute = 150 * 5 characters per minute = 750 characters per minute
    // A text with 750 characters takes one minute to read.
    // A text with 75 characters takes six seconds to read.
    // and so on.

    // The minimum pause time of the eye is estimated to be about 200 msec.
    // The second component involves stimulus processing, estimated to require a minimum of 50 to 100 msec.
    // https://www.ncbi.nlm.nih.gov/pubmed/7406068
    const theoricalTextReadingDuration = (stripedText.length * 60 * 1000) / (wpm * charactersPerWord);
    const duration = Math.max(minimumEyeFixationDuration, theoricalTextReadingDuration);
    // const duration = theoricalTextReadingDuration; // FIXME uncomment above line to add contraint on eye fixation duration

    return duration;
}

/**
 * Calculate the WPM from a number of letters read during an interval.
 * 
 * @param {Number} letters Total number of read letters
 * @param {Number} durationInSeconds Reading time in seconds
 * @param {Number} The WPM
 */
export function wpmFromLetters(letters, durationInSeconds) {
    const words = Math.round(letters / charactersPerWord);
    return Math.round(words * 60 / durationInSeconds);
}
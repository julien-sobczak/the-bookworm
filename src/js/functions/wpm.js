// Standard number of letter in a "word" (WPM).
// See https://en.wikipedia.org/wiki/Words_per_minute
const charactersPerWord = 5;

// Mimimum duration for the eye to fix a point.
// See https://journals.sagepub.com/doi/pdf/10.1177/1529100615623267
// See also https://www.ncbi.nlm.nih.gov/pubmed/7406068
// (Exact value is around 250 ms)
const minimumEyeFixationDuration = 150;

// Minimum duration for the eye for move to the next fixation point.
// See https://journals.sagepub.com/doi/pdf/10.1177/1529100615623267
// (Exact value depends on the distance and is between 20 and 25s for a 7 letters saccade)
const minimumEyeSaccadeDuration = 20;

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
    const duration = Math.max(minimumEyeFixationDuration + minimumEyeSaccadeDuration, theoricalTextReadingDuration);
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
/**
 * Return how many milliseconds the user is allowed to read this chunk.
 * @param {string} chunk
 * @returns {number} The number of ms to wait before the next chunk
 */
function chunkDuration(chunk, wpm) {
    if (!chunk) return 0;

    // Remove HTML tags in the chunk
    let stripedChunk = chunk.replace(/<[^>]+>/g, '');

    const characersPerWord = 5; // https://en.wikipedia.org/wiki/Words_per_minute

    // How to calculate the duration?
    // 150 words per minute = 150 * 5 characters per minute = 750 characters per minute
    // A chunk with 750 characters takes one minute to read.
    // A chunk with 75 characters takes six seconds to read.
    // and so on.

    // The minimum pause time of the eye is estimated to be about 200 msec.
    // The second component involves stimulus processing, estimated to require a minimum of 50 to 100 msec.
    // https://www.ncbi.nlm.nih.gov/pubmed/7406068
    const minimumEyeFixationDuration = 275;
    const theoricalChunkReadingDuration = (stripedChunk.length * 60 * 1000) / (wpm * characersPerWord);
    return Math.max(minimumEyeFixationDuration, theoricalChunkReadingDuration);
}

export { chunkDuration };
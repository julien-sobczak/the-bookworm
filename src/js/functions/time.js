
/**
 * Return the elapsed time in seconds from the start date.
 *
 * @param {Date} startDate The start date
 * @returns {Number} The number of seconds
 */
export function duration(startDate, endDate = new Date()) {
    return Math.round((endDate - startDate) / 1000);
}


/**
 * Return the input text with the first letter capitalized.
 *
 * @param {string} A text
 * @returns {string} The same text capitalized
 */
function capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export { capitalize };

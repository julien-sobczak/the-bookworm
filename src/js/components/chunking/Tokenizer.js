class Tokenizer {

    /**
     * Run the tokenizer on the given input text.
     *
     * Each returned token has two attributes:
     * - "token" and "type" where "type" can be one of these values: "space", "word".
     *
     * @param {string} text The raw content to tokenize
     * @returns {Array} The list of tokens.
     */
    tokenize(text) {
        const separators = [
            { characters: ' ', preserve: true },
            { characters: '(?=--)', preserver: false }
        ];

        let tokens = [
            // Will be progressively splitted into several tokens
            { token: text, type: "word" },
        ];

        separators.forEach(function(s, idx) {
            const r = new RegExp(s.characters, 'g');
            const newTokens = [];
            tokens.forEach(function(t, idx) {
                if (t.type === 'space') {
                    newTokens.push(t);
                } else {
                    // Try to split the token even more
                    const subtokens = t.token.split(r);
                    subtokens.forEach(function(st, idx) {
                        newTokens.push({ token: st, type: "word" });
                        if (s.preserve && idx < subtokens.length - 1) {
                            newTokens.push({ token: s.characters, type: "space" });
                        }
                    });
                }
            });
            tokens = newTokens;
        });

        return tokens;
    }

}

export default Tokenizer;

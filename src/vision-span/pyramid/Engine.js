import * as helpers from '../../toolbox/EngineHelpers';

class Engine {

    /**
     * Create a new drill.
     *
     * @param {number} lines the number of lines
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(lines, onDrillFinished=undefined) {
        this.lines = lines;
        this.callbackDrillFinished = onDrillFinished;  
        this.shuffle();
    }

    /**
     * Shuffle generates a new drill content.
     *
     * The drill object has the following structure:
     *
     *    drill = {
     *       lines: [
     *           columns: [
     *               {
     *                   label: "A",
     *                   valid: true,
     *               },
     *               {
     *                   label: "A",
     *                   valid: null,
     *               },
     *               {
     *                   label: "A",
     *                   valid: null,
     *               },
     *           ]
     *       ]
     *    }
     */
    shuffle() {
        const drill = {
            lines: [],
        };

        for (let i = 0; i < this.lines; i++) {
            drill.lines.push({
                columns: [
                    {
                        label: helpers.randomLetter(),
                        valid: null,
                    },
                    {
                        label: helpers.CHARACTERS[i % helpers.CHARACTERS.length], // Cycle over the alphabet for the middle column
                        valid: null,
                    },
                    {
                        label: helpers.randomLetter(),
                        valid: null,
                    },
                ]
            })
        }
        this.drill = drill;
        this.currentLineIndex = 0;
        this.errorCount = 0;
    }

    getDrill() {
        return this.drill;
    }

    getStats() {
        return {};
    }

    registerInput(input) {
        let finished = true;
        let error = true;
        let matchFound = false; // We want to match only one character, even the same character appears twice on the line

        const currentLine = this.drill.lines[this.currentLineIndex];
        for (let i = 0; i < 3; i++) {
            const element = currentLine.columns[i];
            if (!element.valid && element.label === input.toUpperCase() && !matchFound) {
                element.valid = true;
                matchFound = true;
                error = false;
            } else if (element.valid !== true) { // Still (at least) a missing column
                finished = false
            }
        }
        if (error) {
            this.errorCount++;
        }
        if (finished) {
            if (this.currentLineIndex < this.drill.lines.length - 1) {
                this.currentLineIndex++;
            } else {
                this.callbackDrillFinished && this.callbackDrillFinished({
                    errorCount: this.errorCount,
                })
                this.shuffle();
            }
        }
    }

}

export default Engine;

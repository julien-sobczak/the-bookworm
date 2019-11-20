import * as helpers from '../../../functions/engine';
import * as time from '../../../functions/time';

class Engine {

    /**
     * Creates a new drill.
     *
     * @param {number} lines the number of lines
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(lines, onDrillFinished=undefined) {
        // Settings
        this.lines = lines;
        this.callbackDrillFinished = onDrillFinished;  

        // Stats
        this.totalWrongAnswers = 0;
        this.totalCorrectAnswers = 0;
        this.totalAnswers = 0;
        this.startDate = undefined;

        // Generate drill
        this.shuffle();
    }

    /**
     * Generates a new drill content.
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
        this.inputCount = 0;
        if (!this.startDate) this.startDate = new Date();
    }

    /**
     * Returns the current drill.
     *
     * @return {Object} The drill content
     */
    getDrill() {
        return this.drill;
    }

    /**
     * Returns the statistics collected during the current session.
     *
     * @return {Object} The Game statistics
     */
    getStats() {
        return {
            wrongAnswers: this.totalWrongAnswers,
            correctAnswers: this.totalCorrectAnswers,
            totalAnswers: this.totalAnswers,
            durationInSeconds: time.duration(this.startDate),
        };
    }

    /**
     * Validates the user input.
     *
     * @param {string} input The character entered by the user
     */
    registerInput(input) {
        this.inputCount++;
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
                finished = false;
            }
        }
        if (error) {
            this.errorCount++;
        }
        if (finished) {
            if (this.currentLineIndex < this.drill.lines.length - 1) {
                this.currentLineIndex++;
            } else {
                this.totalWrongAnswers += this.errorCount;
                this.totalCorrectAnswers += this.lines * 3 /* columns */;
                this.totalAnswers += this.inputCount;
                this.callbackDrillFinished && this.callbackDrillFinished({
                    errorCount: this.errorCount,
                });
            }
        }
    }

    /**
     * Return a new drill.
     *
     * @return {Object} The drill content
     */
    newDrill() {
        this.shuffle();
        return this.getDrill();
    }

}

export default Engine;

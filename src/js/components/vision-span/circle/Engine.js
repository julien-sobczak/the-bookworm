import * as helpers from '../../../functions/engine';
import * as time from '../../../functions/time';

class Engine {

    POSITIONS = ["center", "top", "topRight", "right", "bottomRight", "bottom", "bottomLeft", "left", "topLeft"];

    /**
     * Creates a new drill.
     *
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(onDrillFinished=undefined) {
        this.onDrillFinished = onDrillFinished;

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
     *       top: {
     *           label: "A",
     *           valid: true,
     *       },
     *       topRight: {
     *           label: "A",
     *           valid: null,
     *       },
     *       ... // right, bottomRight, bottom, bottomLeft, left, topLeft + center
     *    }
     */
    shuffle() {
        const drill = {};
        this.POSITIONS.forEach((p) => {
            drill[p] = {
                label: helpers.randomLetter(),
                valid: null,
            }
        });
        this.drill = drill;
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

        this.POSITIONS.forEach((p) => {
            const element = this.drill[p];
            if (!element.valid && element.label === input.toUpperCase() && !matchFound) {
                element.valid = true;
                matchFound = true;
                error = false;
            } else if (element.valid !== true) { // Still (at least) a missing column
                finished = false
            }
        });
        if (error) {
            this.errorCount++;
        }
        if (finished) {
            this.totalWrongAnswers += this.errorCount;
            this.totalCorrectAnswers += this.POSITIONS.length; 
            this.totalAnswers += this.inputCount;
            this.onDrillFinished && this.onDrillFinished({
                errorCount: this.errorCount,
            });
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

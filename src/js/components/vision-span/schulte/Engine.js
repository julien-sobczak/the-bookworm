import * as engine from '../../../functions/engine';
import * as time from '../../../functions/time';

class Engine {

    /**
     * Creates a new drill.
     *
     * @param {number} size the size of the table (number of lines/columns)
     * @param {function} onDrillFinished zack when a drill is finished
     */
    constructor(size=3, onDrillFinished=undefined) {
        if (size < 3 || size % 2 === 0) {
            throw new Error(`Size ${size} is not supported. Only even sizes starting from 3 are supported: 3, 5, 7, ...`);
        }

        // Settings
        this.size = size;
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
     *        lines: [
     *            columns: [
     *                {
     *                    label: "A",
     *                    valid: true,
     *                },
     *                {
     *                    label: "A",
     *                    valid: null,
     *                },
     *                {
     *                    label: "A",
     *                    valid: null,
     *                },
     *            ]
     *        ]
     *    }
     */
    shuffle() {
        const drill = { lines: [] };
        for (let i = 0; i < this.size; i++) {
            const line = { columns: [] };
            for (let j = 0; j < this.size; j++) {
                const column = {
                    label: engine.randomLetter(),
                    valid: null,
                }
                line.columns.push(column);
            }
            drill.lines.push(line);
        }
        this.drill = drill;
        this.currentCircle = 0;
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
        let drillFinished = true;
        let error = true;
        let matchFound = false; // We want to match only one character, even the same character appears twice on the line

        // Ex: (5-5 Schulte Table)
        // A F G V J
        // H G K U A
        // A P Q K Q
        // A J H E V
        // N M L Z Q
        // First iteration: Q (center)
        // Second iteration: G K U K E H J P (inner perimeter)
        // Third iteration: A F G V J A Q V Q Z L M N A A H (outer perimenter)

        let squares = [];
        const center = Math.floor(this.size / 2);
        if (this.currentCircle === 0) {
            // Only the center square
            squares.push([center, center]);
        } else {
            // A perimeter
            const xLeft = center - this.currentCircle;
            const xRight = center + this.currentCircle;
            const yTop = center - this.currentCircle;
            const yBottom = center + this.currentCircle;
            for (let i = xLeft; i <= xRight; i++) {
                squares.push([i, yTop]);
                squares.push([i, yBottom]);
            }
            for (let i = yTop + 1; i < yBottom; i++) {
                squares.push([xLeft, i]);
                squares.push([xRight, i]);
            }
        }

        for (let i = 0; i < squares.length; i++) {
            const [x, y] = squares[i];
            const element = this.drill.lines[x].columns[y];
            if (!element.valid && element.label === input.toUpperCase() && !matchFound) {
                element.valid = true;
                matchFound = true;
                error = false;
            } else if (element.valid !== true) { // Still (at least) a missing column
                drillFinished = false;
            }
        }

        if (error) {
            this.errorCount++;
        }

        if (drillFinished) {
            const iterationCount = Math.floor(this.size / 2);
            if (this.currentCircle < iterationCount) {
                this.currentCircle++;
            } else {
                this.totalWrongAnswers += this.errorCount;
                this.totalCorrectAnswers += this.size * this.size;
                this.totalAnswers += this.inputCount;
                this.onDrillFinished && this.onDrillFinished({
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
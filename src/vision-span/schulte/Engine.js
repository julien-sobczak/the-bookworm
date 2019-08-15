import * as helpers from '../../toolbox/EngineHelpers';

class Engine {

    /**
     * Create a new drill.
     *
     * @param {number} size the size of the table (number of lines/columns)
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(size=3, onDrillFinished=undefined) {
        this.size = size;
        this.callbackDrillFinished = onDrillFinished;
        this.shuffle();
    }

    /**
     * Shuffle generates a new drill content.
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
                    label: helpers.randomLetter(),
                    valid: null,
                }
                line.columns.push(column);
            }
            drill.lines.push(line);
        }
        this.drill = drill;
        this.currentCircle = 0;
        this.errorCount = 0;
    }

    getDrill() {
        return this.drill;
    }

    getStats() {
        return {};
    }

    registerInput(input) {
        let circleFinished = true;
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
                circleFinished = false
            }
        }

        if (error) {
            this.errorCount++;
        }

        if (circleFinished) {
            const iterationCount = Math.floor(this.size / 2);
            if (this.currentCircle < iterationCount) {
                this.currentCircle++;
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
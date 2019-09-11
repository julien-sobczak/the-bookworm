import * as helpers from '../../../functions/engine';

class Engine {

    /**
     * Creates a new drill.
     *
     * @param {number} lines the number of lines per series
     * @param {number} columns the number of columns per series
     * @param {number} series the number of series
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(lines, columns, series=1, onDrillFinished=undefined) {
        if (columns < 3 || columns % 2 === 0) {
            throw new Error(`Drill with ${columns} columns is not supported. Only even sizes starting from 3 are supported: 3, 5, 7, ...` );
        }
        this.lines = lines;
        this.columns = columns;
        this.seriesCount = series;
        this.onDrillFinished = onDrillFinished;
        this.shuffle();
    }

    /**
     * Generates a new drill content.
     *
     * The drill object has the following structure:
     *
     *    drill = [
     *        {
     *            lines: [
     *                columns: [
     *                    {
     *                        label: "A",
     *                        valid: true,
     *                    },
     *                    {
     *                        label: "A",
     *                        valid: null,
     *                    },
     *                    {
     *                        label: "A",
     *                        valid: null,
     *                    },
     *                ]
     *            ]
     *        },
     *        ...
     *   ]
     */
    shuffle() {
        const series = [];

        for (let i = 0; i < this.seriesCount; i++) {
            const serie = {
                lines: []
            };
            for (let j = 0; j < this.lines; j++) {
                const line = {
                    columns: []
                };
                for (let k = 0; k < this.columns; k++) {
                    line.columns.push({
                        label: helpers.randomLetter(),
                        valid: null,
                        center: (k === this.columns / 2),
                    })
                }
                serie.lines.push(line);
            }
            series.push(serie);
        }
        this.series = series;
        this.currentSerieIndex = 0;
        this.currentLineIndex = 0;
        this.errorCount = 0;
    }

    /**
     * Returns the current drill.
     *
     * @return {Object} The drill content
     */
    getDrill() {
        return this.series;
    }

    /**
     * Validates the user input.
     *
     * @param {string} input The character entered by the user
     */
    registerInput(input) {
        const currentSerie = this.series[this.currentSerieIndex];
        const currentLine = currentSerie.lines[this.currentLineIndex];
        let lineFinished = true;
        let error = true;
        let matchFound = false; // We want to match only one character, even the same character appears twice on the line
        for (let i = 0; i < currentLine.columns.length; i++) {
            const column = currentLine.columns[i];
            if (!column.valid && column.label === input.toUpperCase() && !matchFound) {
                column.valid = true;
                matchFound = true;
                error = false;
            } else if (column.valid !== true) { // Still (at least) a missing column
                lineFinished = false
            }
        }
        if (error) {
            this.errorCount++;
        }
        if (lineFinished) {
            if (this.currentLineIndex < currentSerie.lines.length - 1) {
                this.currentLineIndex++;
            } else if (this.currentSerieIndex < this.series.length - 1) {
                this.currentSerieIndex++;
                this.currentLineIndex = 0;
            } else {
                this.onDrillFinished && this.onDrillFinished({
                    errorCount: this.errorCount,
                })
                this.shuffle();
            }
        }
    }

    /**
     * Returns the statistics collected during the current session.
     *
     * @return {Object} The Game statistics
     */
    getStats() {
       return {};
    }

}

export default Engine;
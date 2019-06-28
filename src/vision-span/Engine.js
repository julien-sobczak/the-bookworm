/**
 * Drill implements the logic behind the Vision-Span drill.
 * Numerous properties are available to customize the drill format.
 */
class Engine {

    // Characters to use in drill
    CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    /**
     * Create a new drill.
     *
     * @param {number} lines the number of lines per series
     * @param {number} columns the number of columns per series
     * @param {number} series the number of series
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(lines, columns, series=1, onDrillFinished=undefined) {
        this.lines = lines;
        this.columns = columns;
        this.seriesCount = series;
        this.callbackDrillFinished = onDrillFinished;
        this.shuffle();
    }

    randomLetter() {
        return this.CHARACTERS.charAt(Math.floor(Math.random() * this.CHARACTERS.length))
    }

    /**
     * Shuffle generates a new drill content.
     *
     * The drill object has the following structure:
     *
     *    drill = {
     *       series: [
     *           lines: [
     *               columns: [
     *                   {
     *                       label: "A",
     *                       valid: true,
     *                   },
     *                   {
     *                       label: "A",
     *                       valid: null,
     *                   },
     *                   {
     *                       label: "A",
     *                       valid: null,
     *                   },
     *               ]
     *           ]
     *       ]
     *    }
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
                        label: this.randomLetter(),
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
                this.callbackDrillFinished && this.callbackDrillFinished({
                    errorCount: this.errorCount,
                })
                this.shuffle();
            }
        }
    }

}

export default Engine;
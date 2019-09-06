import * as helpers from '../../functions/engine';

class Engine {

    POSITIONS = ["center", "top", "topRight", "right", "bottomRight", "bottom", "bottomLeft", "left", "topLeft"];
    /**
     * Create a new drill.
     *
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(onDrillFinished=undefined) {
        this.callbackDrillFinished = onDrillFinished;
        this.shuffle();
    }

    /**
     * Shuffle generates a new drill content.
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

        this.POSITIONS.forEach((p) => {
            const element = this.drill[p];
            if (!element.valid && element.label === input.toUpperCase() && !matchFound) {
                element.valid = true;
                matchFound = true;
                error = false;
            } else if (element.valid !== true) { // Still (at least) a missing column
                circleFinished = false
            }
        });
        if (error) {
            this.errorCount++;
        }
        if (circleFinished) {
            this.callbackDrillFinished && this.callbackDrillFinished({
                errorCount: this.errorCount,
            })
            this.shuffle();
        }
    }
}

export default Engine;

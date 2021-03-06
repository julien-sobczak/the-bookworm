// Only these span values are supported (by proceed by 0.25 increment as encountered in the book Triple Your Reading Speed by Wade E. Cutler)
export const SPANS = ['0in', '0.25in', '0.5in', '0.75in', '1in', '1.25in', '1.5in', '1.75in', '2in', '2.25in', '2.5in', '2.75in', '3in', '3.25in', '3.5in', '3.75in', '4in'];
export const MIN_SPAN = SPANS[0];
export const MAX_SPAN = SPANS[SPANS.length - 1];

export function isMinSpan(span) {
    if (Array.isArray(span)) {
        return span.includes(MIN_SPAN);
    } else {
        return span === MIN_SPAN;
    }
}

export function isMaxSpan(span) {
    if (Array.isArray(span)) {
        return span.includes(MAX_SPAN);
    } else {
        return span === MAX_SPAN;
    }
}

export function reduceSpan(span) {
    if (isMinSpan(span)) return span;

    if (Array.isArray(span)) {
        return span.map((s) => SPANS[SPANS.indexOf(s) - 1]);
    } else {
        return SPANS[SPANS.indexOf(span) - 1];
    }
}

export function globalSpan(spans) {
    let total = 0;

    // Add spaces between letters
    for (let i = 0; i < spans.length; i++) {
        total += SPANS.indexOf(spans[i]);
    }

    // Add spaces occcupied by letters
    total += spans.length + 1; // We consider each letter measures 0.25in on screen (as declared in CSS)

    const inches = parseInt(total / 4); // We reach one inch every 4 steps
    const subinches = total % 4;
    switch (subinches) {
    case 0:
        return `${inches}in`;
    case 1:
        return `${inches}.25in`;
    case 2:
        return `${inches}.5in`;
    case 3:
        return `${inches}.75in`;
    default:
        throw new Error('Should not happen');
    }
}

export function increaseSpan(span) {
    if (isMaxSpan(span)) return span;

    if (Array.isArray(span)) {
        return span.map((s) => SPANS[SPANS.indexOf(s) + 1]);
    } else {
        return SPANS[SPANS.indexOf(span) + 1];
    }
}

// Characters to use in drill
export const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DIGITS = '0123456789';

/**
 * Returns a random letter from the list of allowed letters.
 *
 * @returns {string} A single letter
 */
export function randomLetter() {
    return CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
}

/**
 * Returns a random digit.
 *
 * @returns {string} The digit character
 */
export function randomDigit() {
    return DIGITS.charAt(Math.floor(Math.random() * DIGITS.length));
}

/**
 * Returns random letters.
 *
 * @returns {number} The number of letters to return.
 * @returns {boolean} The letters must all be different.
 * @returns {string} The letters.
 */
export function randomLetters(n, unique=true, ...excludedLetters) {
    if (unique && n > 26) { // letters in the alphabet
        throw new Error('Cannot generate more than the number of unique characters in the alphabet.');
    }
    const result = [];
    for (let i = 0; i < n; i++) {
        const letter = unique ? randomUniqueLetter(...result, ...excludedLetters) : randomLetter();
        result.push(letter);
    }
    return result;
}

/**
 * Returns a random letter omitting the letters already in use.
 *
 * @param {...any} letters The letters already in use.
 * @returns {string} A single letter.
 */
export function randomUniqueLetter(...letters) {
    let haystack = CHARACTERS;
    letters.forEach(l => {
        haystack = haystack.replace(l, '');
    });

    return haystack.charAt(Math.floor(Math.random() * haystack.length));
}

/**
 * Returns a random letter omitting the letters already in use.
 * This method may be used only in tests to simulate errors.
 *
 * @param {...any} letters The letters already in use.
 * @returns {string} A single letter.
 */
export function differentLetter(...letters) {
    const characters = CHARACTERS.split("").sort(() => Math.random() - 0.5); // shuffle CHARACTERS

    // Try each one until find a match
    for (let i = 0; i < characters.length; i++) {
        const character = CHARACTERS[i];
        let inUsed = false;
        for (let l = 0; l <= letters.length; l++) {
            if (character === letters[l]) {
                inUsed = true;
            }
        }
        if (!inUsed) {
            return character;
        }
    }

    // All letters are already in use...
    return undefined;
}

export class Timer {

    constructor() {
        this.reset();
    }

    reset() {
        this._intervals = [];
        this._started = false;
        this._paused = false;
        this._ended = false;
    }

    start(t = new Date()) {
        if (this.started()) {
            throw new Error('Timer is already started.');
        }
        this._intervals.push({
            startTime: t,
            endTime: undefined,
        });
        this._started = true;
    }

    pause(t = new Date()) {
        if (!this.started()) {
            throw new Error('Timer is not started.');
        }
        if (this.ended()) {
            throw new Error('Timer is already finished.');
        }
        this._lastInterval().endTime = t;
        this._paused = true;
    }

    resume(t = new Date()) {
        if (!this.started()) {
            throw new Error('Timer is not started.');
        }
        if (!this.paused()) {
            throw new Error('Timer is not paused.');
        }
        this._intervals.push({
            startTime: t,
            endTime: undefined,
        });
        this._started = true;
        this._paused = false;
    }

    stop(t = new Date()) {
        if (!this.started()) {
            throw new Error('Timer is not started.');
        }
        this._lastInterval().endTime = t;
        this._started = false;
        this._ended = true;
    }

    _lastInterval() {
        return this._intervals[this._intervals.length - 1];
    }

    elapsedDurationInMs() {
        let totalInMs = 0;
        this._intervals.forEach(interval => {
            if (interval.endTime) {
                totalInMs += interval.endTime.getTime() - interval.startTime.getTime();
            } else {
                totalInMs += new Date().getTime() - interval.startTime.getTime();
            }
        });
        return totalInMs;
    }

    elapsedDurationInSeconds() {
        return parseInt(this.elapsedDurationInMs() / 1000);
    }

    durationInMs() {
        if (!this.ended()) {
            throw new Error("Timer is not finished.");
        }
        let totalInMs = 0;
        this._intervals.forEach(interval => {
            totalInMs += interval.endTime.getTime() - interval.startTime.getTime();
        });
        return totalInMs;
    }

    durationInSeconds() {
        return parseInt(this.durationInMs() / 1000);
    }

    pauseCount() {
        if (!this.ended()) {
            throw new Error("Timer is not finished.");
        }
        return this._intervals.length - 1;
    }

    started() {
        return this._started === true;
    }

    paused() {
        return this._paused === true;
    }

    ended() {
        return this._ended === true;
    }
}

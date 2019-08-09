// Only these span values are supported (by proceed by 0.25 increment as encountered in the book Triple Your Reading Speed by Wade E. Cutler)
export const SPANS = ['0in', '0.25in', '0.5in', '0.75in', '1in', '1.25in', '1.5in', '1.75in', '2in', '2.25in', '2.5in', '2.75in', '3in', '3.25in', '3.5in', '3.75in', '4in'];

export function isMinSpan(span) {
    if (Array.isArray(span)) {
        return span.includes(SPANS[0]);
    } else {
        return SPANS.indexOf(span) === 0;
    }
}

export function isMaxSpan(span) {
    if (Array.isArray(span)) {
        return span.includes(SPANS[SPANS.length-1]);
    } else {
        return SPANS.indexOf(span) === SPANS.length-1;
    }
}

export function reduceSpan(span) {
    if (isMinSpan(span)) return;

    if (Array.isArray(span)) {
        return span.map((s) => SPANS[SPANS.indexOf(s) - 1])
    } else {
        return SPANS[SPANS.indexOf(span) - 1];
    }
}

export function increaseSpan(span) {
    if (isMaxSpan(span)) return;

    if (Array.isArray(span)) {
        return span.map((s) => SPANS[SPANS.indexOf(s) + 1])
    } else {
        return SPANS[SPANS.indexOf(span) + 1];
    }
}

// Characters to use in drill
export const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DIGITS = '0123456789';

export function randomLetter() {
    return CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
}

export function randomDigit() {
    return DIGITS.charAt(Math.floor(Math.random() * DIGITS.length));
}

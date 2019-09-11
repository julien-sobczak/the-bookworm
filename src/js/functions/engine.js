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
        return span.map((s) => SPANS[SPANS.indexOf(s) - 1])
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

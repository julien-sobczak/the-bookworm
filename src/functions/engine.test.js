import { MIN_SPAN, MAX_SPAN, isMinSpan, isMaxSpan, reduceSpan, increaseSpan, randomLetter, randomDigit } from './engine'

describe('isMinSpan', () => {

    it('checks with the minimum span', () => {
        expect(isMinSpan(MIN_SPAN)).toBeTruthy();
        expect(isMinSpan('0.25in')).not.toBeTruthy();
    });

    it('checks if one of the element is minimal', () => {
        expect(isMinSpan(['0.25in', MIN_SPAN])).toBeTruthy();
        expect(isMinSpan(['0.25in', '0.5in'])).not.toBeTruthy();
    });

});

describe('isMaxSpan', () => {

    it('checks with the maximum span', () => {
        expect(isMaxSpan(MAX_SPAN)).toBeTruthy();
        expect(isMaxSpan('0.25in')).not.toBeTruthy();
    });

    it('checks if one of the element is maximal', () => {
        expect(isMaxSpan(['0.25in', MAX_SPAN])).toBeTruthy();
        expect(isMaxSpan(['0.25in', '0.5in'])).not.toBeTruthy();
    });

});

describe('reduceSpan', () => {

    it('reduces the value(s) by one increment', () => {
        // Single value
        expect(reduceSpan('0.25in')).toBe('0in');
        expect(reduceSpan('1.25in')).toBe('1in');
        // Multiple values
        expect(reduceSpan(['0.25in', '1.25in', '2.5in', MAX_SPAN])).toEqual([MIN_SPAN, '1in', '2.25in', '3.75in']);
    });

    it('does nothing is the minimum is already reached', () => {
        expect(reduceSpan(MIN_SPAN)).toBe(MIN_SPAN);
        expect(reduceSpan([MIN_SPAN, MAX_SPAN])).toEqual([MIN_SPAN, MAX_SPAN]);
    });

});

describe('increaseSpan', () => {

    it('increases the value(s) by one increment', () => {
        // Single value
        expect(increaseSpan('0in')).toBe('0.25in');
        expect(increaseSpan('1.25in')).toBe('1.5in');
        // Multiple values
        expect(increaseSpan([MIN_SPAN, '1in', '2.25in', '3.75in'])).toEqual(['0.25in', '1.25in', '2.5in', MAX_SPAN]);
    });

    it('does nothing is the maximum is already reached', () => {
        expect(increaseSpan(MAX_SPAN)).toBe(MAX_SPAN);
        expect(increaseSpan([MIN_SPAN, MAX_SPAN])).toEqual([MIN_SPAN, MAX_SPAN]);
    });

});

describe('randomLetter', () => {

    it('returns a single letter', () => {
        expect(randomLetter()).toMatch(/[A-Z]/);
    });

});

describe('randomDigit', () => {

    it('returns a single digit', () => {
        expect(randomDigit()).toMatch(/[0-9]/);
    });

});
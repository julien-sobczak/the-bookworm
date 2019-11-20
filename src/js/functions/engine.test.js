import * as engine from './engine'

describe('isMinSpan', () => {

    it('checks with the minimum span', () => {
        expect(engine.isMinSpan(engine.MIN_SPAN)).toBeTruthy();
        expect(engine.isMinSpan('0.25in')).not.toBeTruthy();
    });

    it('checks if one of the element is minimal', () => {
        expect(engine.isMinSpan(['0.25in', engine.MIN_SPAN])).toBeTruthy();
        expect(engine.isMinSpan(['0.25in', '0.5in'])).not.toBeTruthy();
    });

});

describe('isMaxSpan', () => {

    it('checks with the maximum span', () => {
        expect(engine.isMaxSpan(engine.MAX_SPAN)).toBeTruthy();
        expect(engine.isMaxSpan('0.25in')).not.toBeTruthy();
    });

    it('checks if one of the element is maximal', () => {
        expect(engine.isMaxSpan(['0.25in', engine.MAX_SPAN])).toBeTruthy();
        expect(engine.isMaxSpan(['0.25in', '0.5in'])).not.toBeTruthy();
    });

});

describe('reduceSpan', () => {

    it('reduces the value(s) by one increment', () => {
        // Single value
        expect(engine.reduceSpan('0.25in')).toBe('0in');
        expect(engine.reduceSpan('1.25in')).toBe('1in');
        // Multiple values
        expect(engine.reduceSpan(['0.25in', '1.25in', '2.5in', engine.MAX_SPAN])).toEqual([engine.MIN_SPAN, '1in', '2.25in', '3.75in']);
    });

    it('does nothing is the minimum is already reached', () => {
        expect(engine.reduceSpan(engine.MIN_SPAN)).toBe(engine.MIN_SPAN);
        expect(engine.reduceSpan([engine.MIN_SPAN, engine.MAX_SPAN])).toEqual([engine.MIN_SPAN, engine.MAX_SPAN]);
    });

});

describe('increaseSpan', () => {

    it('increases the value(s) by one increment', () => {
        // Single value
        expect(engine.increaseSpan('0in')).toBe('0.25in');
        expect(engine.increaseSpan('1.25in')).toBe('1.5in');
        // Multiple values
        expect(engine.increaseSpan([engine.MIN_SPAN, '1in', '2.25in', '3.75in'])).toEqual(['0.25in', '1.25in', '2.5in', engine.MAX_SPAN]);
    });

    it('does nothing is the maximum is already reached', () => {
        expect(engine.increaseSpan(engine.MAX_SPAN)).toBe(engine.MAX_SPAN);
        expect(engine.increaseSpan([engine.MIN_SPAN, engine.MAX_SPAN])).toEqual([engine.MIN_SPAN, engine.MAX_SPAN]);
    });

});

describe('randomLetter', () => {

    it('returns a single letter', () => {
        expect(engine.randomLetter()).toMatch(/[A-Z]/);
    });

});

describe('randomDigit', () => {

    it('returns a single digit', () => {
        expect(engine.randomDigit()).toMatch(/[0-9]/);
    });

});

describe('globalSpan', () => {

    it('calculates the total width between the left letter and the right letter', () => {
        expect(engine.globalSpan(["0.25in", "0.25in"])).toBe("1.25in"); // don't forget the 3 letters
        expect(engine.globalSpan(["0.5in", "0.5in"])).toBe("1.75in");
    });
});
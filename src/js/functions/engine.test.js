import * as engine from './engine';

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

describe('differentLetter', () => {

    it('returns a letter different from the ones in argument', () => {
        expect(engine.differentLetter()).toHaveLength(1);
        expect(engine.differentLetter('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', /* Y */ 'Z')).toBe('Y');
        expect(engine.differentLetter('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',  'Y', 'Z')).toBeUndefined();
    });

});

describe('randomLetters', () => {

    it('returns a specific number of random letters', () => {
        const letters = engine.randomLetters(10);
        expect(letters).toHaveLength(10);

        // count the number of occurrences in an array
        const count = (search) => letters.reduce((n, val) => {
            return n + (val === search);
        }, 0);

        letters.forEach(l => {
            expect(count(l)).toBe(1); // unique by default
        });
    });

    it('reports an error if the number of requested letters is too large', () => {
        expect(() => {
            engine.randomLetters(100, true);
        }).toThrow(/cannot generate/i);
    });

    it('allows to drop the unicity constraint', () => {
        const letters = engine.randomLetters(1000, false);
        expect(letters).toHaveLength(1000);
    });

    it('allows to exclude some letters', () => {
        const letters = engine.randomLetters(10, true, "A", "B", "C");
        expect(letters).toHaveLength(10);
        expect(letters.includes("A")).not.toBeTruthy();
        expect(letters.includes("B")).not.toBeTruthy();
        expect(letters.includes("C")).not.toBeTruthy();
    });

});

describe('globalSpan', () => {

    it('calculates the total width between the left letter and the right letter', () => {
        expect(engine.globalSpan(["0.25in", "0.25in"])).toBe("1.25in"); // don't forget the 3 letters
        expect(engine.globalSpan(["0.5in", "0.5in"])).toBe("1.75in");
    });
});

describe('Timer', () => {
    const timer = new engine.Timer();

    let t = new Date("2021-01-01 12:00:00.000");
    timer.start(t);

    t = new Date(t.getTime() + 50);
    timer.pause(t);// 50ms

    t = new Date(t.getTime() + 1000);
    timer.resume(t); // 1s

    t = new Date(t.getTime() + 150);
    timer.pause(t);// 150ms

    expect(timer.elapsedDurationInMs()).toBe(200);
    expect(timer.elapsedDurationInSeconds()).toBe(0);

    t = new Date(t.getTime() + 10000);
    timer.resume(t); // 10s

    t = new Date(t.getTime() + 1000);
    timer.stop(t); // 100ms

    expect(timer.durationInMs()).toBe(1200);
    expect(timer.durationInSeconds()).toBe(1);
    expect(timer.pauseCount()).toBe(2);
})

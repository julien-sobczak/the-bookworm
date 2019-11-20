import * as wpm from './wpm';

describe('textDuration()', () => {

    it('should calculate the chunk reading time', () => {
        const textContaining500Characters = "This is a long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long text.";
        expect(wpm.textDuration(textContaining500Characters, 100)).toBe(1 * 60 * 1000); // 100 WPM = 500 characters in one minnute
    });

    it('should take into account the physical eye limitations', () => {
        const veryShortChunk = "is";
        expect(wpm.textDuration(veryShortChunk, 500)).toBe(170); // See implementation
    });

    it('should ignore HTML tags in the chunk text', () => {
        const textWithTags = "This <i>text</i> contains<br/> HTML tags.";
        const textWithoutTags = "This text contains HTML tags.";
        const durationWithTags = wpm.textDuration(textWithTags, 100)
        const durationWithoutTags = wpm.textDuration(textWithoutTags, 100)
        expect(durationWithTags).toBe(durationWithoutTags);
    });

});

describe('wpmFromLetters', () => {

    it('should calculate the WPM', () => {
        expect(wpm.wpmFromLetters(10, 60)).toBe(2); // 2 words read in one minute
        expect(wpm.wpmFromLetters(500 * 2, 60 * 2)).toBe(100); // 100 words per minute
    });

})
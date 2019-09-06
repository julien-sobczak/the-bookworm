import { chunkDuration } from './wpm';

describe('chunkDuration()', () => {

    it('should calculate the chunk reading time', () => {
        const textContaining500Characters = "This is a long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long text.";
        expect(chunkDuration(textContaining500Characters, 100)).toBe(1 * 60 * 1000); // 100 WPM = 500 characters in one minnute
    });

    it('should take into account the physical eye limitations', () => {
        const veryShortChunk = "is";
        expect(chunkDuration(veryShortChunk, 500)).toBe(275); // See implementation
    });

    it('should ignore HTML tags in the chunk text', () => {
        const textWithTags = "This <i>text</i> contains<br/> HTML tags.";
        const textWithoutTags = "This text contains HTML tags.";
        const durationWithTags = chunkDuration(textWithTags, 100)
        const durationWithoutTags = chunkDuration(textWithoutTags, 100)
        expect(durationWithTags).toBe(durationWithoutTags);
    });

});
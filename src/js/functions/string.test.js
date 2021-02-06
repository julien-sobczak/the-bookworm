import * as string from './string';

describe('uid', () => {

    it('should return a random string with a fixed length', () => {
        expect(string.uid()).toHaveLength(15);
        expect(string.uid()).not.toEqual(string.uid());
    });

});

describe('capitalize', () => {

    it('should capitalize only the first letter', () => {
        expect(string.capitalize('span')).toEqual('Span');
        expect(string.capitalize('Span')).toEqual('Span');
        expect(string.capitalize('SPAN')).toEqual('SPAN');
    });

});

describe('humanReadableDate', () => {

    it('should return the most compact format', () => {
        const reference = new Date("2019-09-29T14:25:43.511Z");
        expect(string.humanReadableDate("2017-09-29T14:25:43.511Z", reference, true)).toEqual("2 years ago");
        expect(string.humanReadableDate("2018-09-29T14:25:43.511Z", reference, true)).toEqual("last year");
        expect(string.humanReadableDate("2019-01-29T14:25:43.511Z", reference, true)).toEqual("8 months ago");
        expect(string.humanReadableDate("2019-08-29T14:25:43.511Z", reference, true)).toEqual("last month");
        expect(string.humanReadableDate("2019-09-09T14:25:43.511Z", reference, true)).toEqual("20 days ago");
        expect(string.humanReadableDate("2019-09-28T14:25:43.511Z", reference, true)).toEqual("yesterday, 14:25");
        expect(string.humanReadableDate("2019-09-29T10:25:43.511Z", reference, true)).toEqual("today, 10:25");
    });

});

describe('humanReadableShortDuration', () => {

    it('should return the most compact format', () => {
        expect(string.humanReadableShortDuration(1)).toEqual("1s");
        expect(string.humanReadableShortDuration(59)).toEqual("59s");
        expect(string.humanReadableShortDuration(60)).toEqual("1min");
        expect(string.humanReadableShortDuration(61)).toEqual("1min 1s");
        expect(string.humanReadableShortDuration(130)).toEqual("2min 10s");
    });

});

describe('humanReadableLongDuration', () => {

    it('should return the most compact format', () => {
        expect(string.humanReadableLongDuration(1)).toEqual("1 second");
        expect(string.humanReadableLongDuration(2)).toEqual("2 seconds");
        expect(string.humanReadableLongDuration(59)).toEqual("59 seconds");
        expect(string.humanReadableLongDuration(60)).toEqual("1 minute");
        expect(string.humanReadableLongDuration(120)).toEqual("2 minutes");
        expect(string.humanReadableLongDuration(61)).toEqual("1 minute 1 second");
        expect(string.humanReadableLongDuration(130)).toEqual("2 minutes 10 seconds");
    });

});

describe('headline', () => {

    it('should return the beginning of the text', () => {
        expect(string.headline("This is the beginning of the sentence", 20)).toEqual("This is the...");
        expect(string.headline("Too short", 20)).toEqual("Too short");
        expect(string.headline("NotASingleSpaceWhereToSplitTheText", 20)).toEqual("NotASingleSpaceWh...");
    });

});

describe('stripTags', () => {

    it('should return the same string without the HTML tags', () => {
        expect(string.stripTags(`Do not contains HTML tags`)).toEqual("Do not contains HTML tags");
        expect(string.stripTags(`Contains <i>HTML</i> <b>tags</b>`)).toEqual("Contains HTML tags");
        expect(string.stripTags(`Contains <i class="abbr">HTML</i> tags with attributes`)).toEqual("Contains HTML tags with attributes");
    });

});

describe('wordDelims', () => {

    it('returns the indices of each word', () => {

        // With spaces
        expect(string.wordDelims("This is a \ttest")).
            toEqual([[0, 3]/* This */, [5, 6]/* is */, [8, 8]/* a */, [11, 14]/* test */]);

        // With dashes
        expect(string.wordDelims("“Dashes, for example, —em --em–en.”")).
            toEqual([[0, 7]/* “Dashes, */, [9, 11]/* for */, [13, 20]/* example, */, [23, 24]/* em */, [28, 29]/* em */, [31, 34]/* en */]);

    });

});

describe('showWords', () => {

    it('highlights the words', () => {
        expect(string.showWords("This is a--test")).toBe("[This] [is] [a]--[test]");
    });

});

describe('splitWords', () => {

    it('splits the line into words', () => {
        expect(string.splitWords("This is a--test.")).toEqual([
            {
                "text": "This",
                "start": 0,
                "end": 3,
                "word": true,
            },
            {
                "text": " ",
                "start": 4,
                "end": 4,
                "word": false,
            },
            {
                "text": "is",
                "start": 5,
                "end": 6,
                "word": true,
            },
            {
                "text": " ",
                "start": 7,
                "end": 7,
                "word": false,
            },
            {
                "text": "a",
                "start": 8,
                "end": 8,
                "word": true,
            },
            {
                "text": "--",
                "start": 9,
                "end": 10,
                "word": false,
            },
            {
                "text": "test.",
                "start": 11,
                "end": 15,
                "word": true,
            },
        ]);
    });

});

describe('countWords', () => {

    it('calculates the number of words', () => {
        const text = "A very, simple, but useful example!";
        expect(string.countWords(text)).toBe(6);
    });

});

describe('countLetters', () => {

    it('calculates the number of letters', () => {
        const textWithoutHTML = "A simple text";
        const textWithHTML = "“I ain't, aunt; it <i>is</i> all done.”";
        expect(string.countLetters(textWithoutHTML)).toBe(13);
        expect(string.countLetters(textWithHTML)).toBe(32);
    });
});

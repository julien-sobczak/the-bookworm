import * as string from './string'

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
        const reference = new Date("2019-09-29T14:25:43.511Z")
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
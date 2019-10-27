import { capitalize, humanReadableDate, humanReadableShortDuration, humanReadableLongDuration, uid, headline } from './string'

describe('uid', () => {

    it('should return a random string with a fixed length', () => {
        expect(uid()).toHaveLength(15);
        expect(uid()).not.toEqual(uid());
    });

});

describe('capitalize', () => {

    it('should capitalize only the first letter', () => {
        expect(capitalize('span')).toEqual('Span');
        expect(capitalize('Span')).toEqual('Span');
        expect(capitalize('SPAN')).toEqual('SPAN');
    });

});

describe('humanReadableDate', () => {

    it('should return the most compact format', () => {
        const reference = new Date("2019-09-29T14:25:43.511Z")
        expect(humanReadableDate("2017-09-29T14:25:43.511Z", reference, true)).toEqual("2 years ago");
        expect(humanReadableDate("2018-09-29T14:25:43.511Z", reference, true)).toEqual("last year");
        expect(humanReadableDate("2019-01-29T14:25:43.511Z", reference, true)).toEqual("8 months ago");
        expect(humanReadableDate("2019-08-29T14:25:43.511Z", reference, true)).toEqual("last month");
        expect(humanReadableDate("2019-09-09T14:25:43.511Z", reference, true)).toEqual("20 days ago");
        expect(humanReadableDate("2019-09-28T14:25:43.511Z", reference, true)).toEqual("yesterday, 14:25");
        expect(humanReadableDate("2019-09-29T10:25:43.511Z", reference, true)).toEqual("today, 10:25");
    });

});

describe('humanReadableShortDuration', () => {

    it('should return the most compact format', () => {
        expect(humanReadableShortDuration(1)).toEqual("1s");
        expect(humanReadableShortDuration(59)).toEqual("59s");
        expect(humanReadableShortDuration(60)).toEqual("1min");
        expect(humanReadableShortDuration(61)).toEqual("1min 1s");
        expect(humanReadableShortDuration(130)).toEqual("2min 10s");
    });

});

describe('humanReadableLongDuration', () => {

    it('should return the most compact format', () => {
        expect(humanReadableLongDuration(1)).toEqual("1 second");
        expect(humanReadableLongDuration(2)).toEqual("2 seconds");
        expect(humanReadableLongDuration(59)).toEqual("59 seconds");
        expect(humanReadableLongDuration(60)).toEqual("1 minute");
        expect(humanReadableLongDuration(120)).toEqual("2 minutes");
        expect(humanReadableLongDuration(61)).toEqual("1 minute 1 second");
        expect(humanReadableLongDuration(130)).toEqual("2 minutes 10 seconds");
    });

});

describe('headline', () => {

    it('should return the beginning of the text', () => {
        expect(headline("This is the beginning of the sentence", 20)).toEqual("This is the...");
        expect(headline("Too short", 20)).toEqual("Too short");
        expect(headline("NotASingleSpaceWhereToSplitTheText", 20)).toEqual("NotASingleSpaceWh...");
    });

});
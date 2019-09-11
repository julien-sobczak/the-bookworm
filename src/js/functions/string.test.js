import { capitalize, humanReadableDate } from './string'

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
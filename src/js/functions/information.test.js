import * as information from './information';

describe('getQuoteOfTheDay', () => {

    it('should return a random quote', () => {
        const quotation = information.getQuoteOfTheDay();
        // Text and author are required for all quotations
        expect(quotation.author).toMatch(/.+/);
        expect(quotation.text).toMatch(/.+/);
    });

});

describe('getTipOfTheDay', () => {

    it('should return a random tip', () => {
        const tip = information.getTipOfTheDay();
        // Only text is required for tips
        expect(tip.text).toMatch(/.+/);
    });

});

describe('getMessageOfTheDay', () => {

    it('should return a random message', () => {
        const message = information.getMessageOfTheDay();
        // Text is always required
        expect(message.text).toMatch(/.+/);
        // Type is used to determine the kind
        expect(message.type).toMatch(/.+/);
    });

});

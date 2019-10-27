import { getQuoteOfTheDay, getTipOfTheDay, getMessageOfTheDay } from './quote';

describe('getQuoteOfTheDay', () => {

    it('should return a random quote', () => {
        const quote = getQuoteOfTheDay();
        // Text and author are required for all quotations
        expect(quote.author).toMatch(/.+/);
        expect(quote.text).toMatch(/.+/);
    });

});

describe('getTipOfTheDay', () => {

    it('should return a random tip', () => {
        const tip = getTipOfTheDay();
        // Only text is required for tips
        expect(tip.text).toMatch(/.+/);
    });

});

describe('getMessageOfTheDay', () => {

    it('should return a random message', () => {
        const message = getMessageOfTheDay();
        // Text is always required
        expect(message.text).toMatch(/.+/);
        // Type is used to determine the kind
        expect(message.type).toMatch(/.+/);
    });

});

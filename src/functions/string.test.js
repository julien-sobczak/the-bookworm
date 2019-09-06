import { capitalize } from './string'

describe('capitalize', () => {

    it('should capitalize only the first letter', () => {
        expect(capitalize('span')).toEqual('Span');
        expect(capitalize('Span')).toEqual('Span');
        expect(capitalize('SPAN')).toEqual('SPAN');
    });

});

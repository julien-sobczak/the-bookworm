import * as time from './time';

describe('duration', () => {

    it('should return the elapsed time in seconds', () => {
        const start = new Date('1995-12-17T03:24:00');
        const end = new Date('1995-12-17T03:24:10');
        expect(time.duration(start, end)).toBe(10);
    });

});

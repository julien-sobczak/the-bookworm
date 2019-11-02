import * as sut from './interaction';

describe('getScreenZone', () => {

    // Fix window size
    window.innerWidth = 1024;
    window.innerHeight = 768;

    it('should return ZONE_LEFT when the user click on the left', () => {
        const eventTop = {
            clientX: 200,
            clientY: 200,
        };
        const eventBottom = {
            clientX: 200,
            clientY: 600,
        };
        expect(sut.getScreenZone(eventTop)).toBe(sut.ZONE_LEFT);
        expect(sut.getScreenZone(eventBottom)).toBe(sut.ZONE_LEFT);
    });

    it('should return ZONE_RIGHT when the user click on the right', () => {
        const eventTop = {
            clientX: 900,
            clientY: 200,
        };
        const eventBottom = {
            clientX: 900,
            clientY: 600,
        };
        expect(sut.getScreenZone(eventTop)).toBe(sut.ZONE_RIGHT);
        expect(sut.getScreenZone(eventBottom)).toBe(sut.ZONE_RIGHT);
    });

    it('should return ZONE_TOP when the user click on the top middle', () => {
        const eventLeft = {
            clientX: 200,
            clientY: 200,
        };
        const eventMiddle = {
            clientX: 500,
            clientY: 200,
        };
        const eventRight = {
            clientX: 900,
            clientY: 200,
        };
        expect(sut.getScreenZone(eventLeft)).toBe(sut.ZONE_LEFT);
        expect(sut.getScreenZone(eventMiddle)).toBe(sut.ZONE_TOP);
        expect(sut.getScreenZone(eventRight)).toBe(sut.ZONE_RIGHT);
    });

    it('should return ZONE_BOTTOM when the user click on the bottom middle', () => {
        const eventLeft = {
            clientX: 200,
            clientY: 600,
        };
        const eventMiddle = {
            clientX: 500,
            clientY: 600,
        };
        const eventRight = {
            clientX: 900,
            clientY: 600,
        };
        expect(sut.getScreenZone(eventLeft)).toBe(sut.ZONE_LEFT);
        expect(sut.getScreenZone(eventMiddle)).toBe(sut.ZONE_BOTTOM);
        expect(sut.getScreenZone(eventRight)).toBe(sut.ZONE_RIGHT);
    });

});

describe('isCharacterKey', () => {

    it('should return true for alphabet letters', () => {
        const eventA = { keyCode: sut.KEY_A };
        const eventL = { keyCode: sut.KEY_L };
        const eventZ = { keyCode: sut.KEY_Z };
        const event0 = { keyCode: sut.KEY_NUMPAD_0 };
        const eventArrowRight = { keyCode: sut.KEY_RIGHT };
        const eventComma = { keyCode: sut.KEY_COMMA };
        expect(sut.isCharacterKey(eventA)).toBeTruthy();
        expect(sut.isCharacterKey(eventL)).toBeTruthy();
        expect(sut.isCharacterKey(eventZ)).toBeTruthy();
        expect(sut.isCharacterKey(event0)).not.toBeTruthy();
        expect(sut.isCharacterKey(eventArrowRight)).not.toBeTruthy();
        expect(sut.isCharacterKey(eventComma)).not.toBeTruthy();
    });
    
});
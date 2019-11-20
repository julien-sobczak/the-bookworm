import * as interaction from './interaction';

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
        expect(interaction.getScreenZone(eventTop)).toBe(interaction.ZONE_LEFT);
        expect(interaction.getScreenZone(eventBottom)).toBe(interaction.ZONE_LEFT);
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
        expect(interaction.getScreenZone(eventTop)).toBe(interaction.ZONE_RIGHT);
        expect(interaction.getScreenZone(eventBottom)).toBe(interaction.ZONE_RIGHT);
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
        expect(interaction.getScreenZone(eventLeft)).toBe(interaction.ZONE_LEFT);
        expect(interaction.getScreenZone(eventMiddle)).toBe(interaction.ZONE_TOP);
        expect(interaction.getScreenZone(eventRight)).toBe(interaction.ZONE_RIGHT);
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
        expect(interaction.getScreenZone(eventLeft)).toBe(interaction.ZONE_LEFT);
        expect(interaction.getScreenZone(eventMiddle)).toBe(interaction.ZONE_BOTTOM);
        expect(interaction.getScreenZone(eventRight)).toBe(interaction.ZONE_RIGHT);
    });

});

describe('isCharacterKey', () => {

    it('should return true for alphabet letters', () => {
        const eventA = { keyCode: interaction.KEY_A };
        const eventL = { keyCode: interaction.KEY_L };
        const eventZ = { keyCode: interaction.KEY_Z };
        const event0 = { keyCode: interaction.KEY_NUMPAD_0 };
        const eventArrowRight = { keyCode: interaction.KEY_RIGHT };
        const eventComma = { keyCode: interaction.KEY_COMMA };
        expect(interaction.isCharacterKey(eventA)).toBeTruthy();
        expect(interaction.isCharacterKey(eventL)).toBeTruthy();
        expect(interaction.isCharacterKey(eventZ)).toBeTruthy();
        expect(interaction.isCharacterKey(event0)).not.toBeTruthy();
        expect(interaction.isCharacterKey(eventArrowRight)).not.toBeTruthy();
        expect(interaction.isCharacterKey(eventComma)).not.toBeTruthy();
    });

});
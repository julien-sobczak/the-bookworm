/*
 * Functions accepting a DOM event as parameters. 
 */

// Constants to use with the function getScreenZone()
export const ZONE_LEFT = "left";
export const ZONE_RIGHT = "right";
export const ZONE_TOP = "top";
export const ZONE_BOTTOM = "bottom";

// Constants to use when listening keyUp
// See http://gcctech.org/csc/javascript/javascript_keycodes.htm
export const KEY_BACKSPACE = 8;
export const KEY_TAB = 9;
export const KEY_ENTER = 13;
export const KEY_SHIFT = 16;
export const KEY_CTRL = 17;
export const KEY_ALT = 18;
export const KEY_PAUSE = 19;
export const KEY_CAPS_LOCK = 20;
export const KEY_ESCAPE = 27;
export const KEY_SPACE = 32;
export const KEY_PAGE_UP = 33;
export const KEY_PAGE_DOWN = 34;
export const KEY_END = 35;
export const KEY_HOME = 36;
export const KEY_LEFT = 37;
export const KEY_UP = 38;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
export const KEY_PRINT_SCREEN = 44;
export const KEY_INSERT = 45;
export const KEY_DELETE = 46;
export const KEY_0 = 48;
export const KEY_1 = 49;
export const KEY_2 = 50;
export const KEY_3 = 51;
export const KEY_4 = 52;
export const KEY_5 = 53;
export const KEY_6 = 54;
export const KEY_7 = 55;
export const KEY_8 = 56;
export const KEY_9 = 57;
export const KEY_A = 65;
export const KEY_B = 66;
export const KEY_C = 67;
export const KEY_D = 68;
export const KEY_E = 69;
export const KEY_F = 70;
export const KEY_G = 71;
export const KEY_H = 72;
export const KEY_I = 73;
export const KEY_J = 74;
export const KEY_K = 75;
export const KEY_L = 76;
export const KEY_M = 77;
export const KEY_N = 78;
export const KEY_O = 79;
export const KEY_P = 80;
export const KEY_Q = 81;
export const KEY_R = 82;
export const KEY_S = 83;
export const KEY_T = 84;
export const KEY_U = 85;
export const KEY_V = 86;
export const KEY_W = 87;
export const KEY_X = 88;
export const KEY_Y = 89;
export const KEY_Z = 90;
export const KEY_LEFT_WINDOW_KEY = 91;
export const KEY_RIGHT_WINDOW_KEY = 92;
export const KEY_SELECT = 93;
export const KEY_NUMPAD_0 = 96;
export const KEY_NUMPAD_1 = 97;
export const KEY_NUMPAD_2 = 98;
export const KEY_NUMPAD_3 = 99;
export const KEY_NUMPAD_4 = 100;
export const KEY_NUMPAD_5 = 101;
export const KEY_NUMPAD_6 = 102;
export const KEY_NUMPAD_7 = 103;
export const KEY_NUMPAD_8 = 104;
export const KEY_NUMPAD_9 = 105;
export const KEY_MULTIPLY = 106;
export const KEY_ADD = 107;
export const KEY_SUBTRACT = 109;
export const KEY_DECIMAL_POINT = 110;
export const KEY_DIVIDE = 111;
export const KEY_F1 = 112;
export const KEY_F2 = 113;
export const KEY_F3 = 114;
export const KEY_F4 = 115;
export const KEY_F5 = 116;
export const KEY_F6 = 117;
export const KEY_F7 = 118;
export const KEY_F8 = 119;
export const KEY_F9 = 120;
export const KEY_F10 = 121;
export const KEY_F11 = 122;
export const KEY_F12 = 123;
export const KEY_NUM_LOCK = 144;
export const KEY_SCROLL_LOCK = 145;
export const KEY_SEMICOLON = 186;
export const KEY_EQUAL_SIGN = 187;
export const KEY_COMMA = 188;
export const KEY_DASH = 189;
export const KEY_PERIOD = 190;
export const KEY_SLACK = 191;
export const KEY_OPEN_BRACKET = 219;
export const KEY_BACKSLASH = 220;
export const KEY_CLOSE_BRACKET = 221;
export const KEY_SINGLE_QUOTE = 222;

/**
 * Test a keyup event to detect if it is a character.
 * 
 * @param {Event} event A keyUp event
 * @return {bool} if the even represents an ASCII letter 
 */
export function isCharacterKey(event) {
    return event.keyCode >= KEY_A && event.keyCode <= KEY_Z;
}

/**
 * Determine the zone on screen based on the click position.
 *  
 * @param {Event} event A click event
 * @return {string} The zone on screen where the user clicked 
 */
export function getScreenZone(event) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const clickX = event.clientX;
    const clickY = event.clientY;
    if (clickX < 0.4 * width) {
        return ZONE_LEFT;
    } else if (clickX > 0.6 * width) {
        return ZONE_RIGHT;
    } else if (clickY < 0.5 * height) {
        return ZONE_TOP;
    } else {
        return ZONE_BOTTOM;
    }
}
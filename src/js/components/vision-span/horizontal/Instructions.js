import React from 'react';
import MobileDetect from 'mobile-detect';

import InfoIcon from '@material-ui/icons/Info';
import KeyboardIcon from '@material-ui/icons/Keyboard';

import Engine from './Engine';
import Viewer from './Viewer';
import Window from '../../toolbox/Window';

const columns = 5;
const lines = 3;
const drill = new Engine(lines, columns).getDrill();

function Instructions() {

    const md = new MobileDetect(window.navigator.userAgent);
    const keyboardDetected = md.mobile() == null;

    const viewer = <Viewer columns={columns} lines={lines} spans={["0.25in", "0.25in", "0.25in", "0.25in"]} drill={drill} />;
    return (
        <div>
            <h1>Horizontal Drill</h1>
            <div className="Text">
                <p><InfoIcon className="Icon" /> Focus on the middle column, and read alternatively the left and right columns from the inside out, one line at a time. Make only one fixation per line.</p>
                {keyboardDetected && <p><KeyboardIcon className="Icon" /> When the option <span className="Label">Enable Keyboard</span> is selected, you must enter each letter successively to validate a drill.</p>}
            </div>
            <Window content={viewer} />
        </div>
    );

}

export default Instructions;

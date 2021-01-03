import React from 'react';
import MobileDetect from 'mobile-detect';

import InfoIcon from '@material-ui/icons/Info';
import KeyboardIcon from '@material-ui/icons/Keyboard';

import Engine from './Engine';
import Viewer from './Viewer';
import Window from '../../toolbox/Window';

const size = 3;
const drill = new Engine(size).getDrill();

function Demo() {

    const md = new MobileDetect(window.navigator.userAgent);
    const keyboardDetected = md.mobile() == null;

    const viewer = <Viewer size={size} span={"0.5in"} drill={drill} />;
    return (
        <div>
            <h1>Schulte Drill</h1>
            <div className="Text">
                <p><InfoIcon className="Icon" /> Focus on the center cell, and read successively each surrounding cells until reaching the borders of the table. Make only one fixation.</p>
                {keyboardDetected && <p><KeyboardIcon className="Icon" /> When the option <span className="Label">Enable Keyboard</span> is selected, you must enter each letter successively to validate a drill.</p>}
            </div>
            <Window content={viewer} />
        </div>
    );

}

export default Demo;

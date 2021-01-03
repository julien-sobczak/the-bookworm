import React from 'react';
import MobileDetect from 'mobile-detect';

import InfoIcon from '@material-ui/icons/Info';
import KeyboardIcon from '@material-ui/icons/Keyboard';

import Engine from './Engine';
import Viewer from './Viewer';
import Window from '../../toolbox/Window';

const drill = new Engine().getDrill();

function Demo() {

    const md = new MobileDetect(window.navigator.userAgent);
    const keyboardDetected = md.mobile() == null;

    const viewer = <Viewer span={"0.75in"} drill={drill} />;
    return (
        <div>
            <h1>Circle Drill</h1>
            <div className="Text">
                <p><InfoIcon className="Icon" /> Focus on the center letter, and read successively the letters all around the circle. Make only one fixation at the center.</p>
                {keyboardDetected && <p><KeyboardIcon className="Icon" /> When the option <span className="Label">Enable Keyboard</span> is selected, you must enter each letter successively to validate a drill.</p>}
            </div>
            <Window content={viewer} />
        </div>
    );

}

export default Demo;

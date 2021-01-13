import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { ScreenStats } from "../core/UI.js";
import Screen from "../core/Screen.js";
import LargeButton from "../toolbox/LargeButton.js";
import * as string from '../../functions/string';

import TimerIcon from '@material-ui/icons/Timer';
import BookIcon from '@material-ui/icons/Book';
import ExtensionIcon from '@material-ui/icons/Extension';
import SpeedIcon from '@material-ui/icons/Speed';

function Stats({ stats, finished, onRestart, onContinue }) {

    return (
        <ScreenStats>
            <table>
                <tbody>
                    <tr>
                        <th><BookIcon/></th>
                        <td>{stats.words} <small>words</small></td>
                    </tr>
                    <tr>
                        <th><TimerIcon/></th>
                        <td>{string.humanReadableShortDuration(stats.durationInSeconds)}</td>
                    </tr>
                    <tr>
                        <th><SpeedIcon/></th>
                        <td>{stats.wpm} <small>WPM</small></td>
                    </tr>
                    <tr>
                        <th><ExtensionIcon/></th>
                        <td>{stats.chunks} <small>chunk(s)</small></td>
                    </tr>
                </tbody>
            </table>
            <div className="Actions">
                <LargeButton text="Retry" colorText="white" colorBackground="#111" onClick={onRestart} />
                {!finished && <LargeButton text="Continue" colorText="white" colorBackground="#111" onClick={onContinue} />}
                <Link to="/chunking/"><LargeButton text="Change" colorText="white" colorBackground="#111" /></Link>
            </div>
        </ScreenStats>
    );
}

Stats.propTypes = {
    stats: PropTypes.object,
    finished: PropTypes.bool,
    onRestart: PropTypes.func,
    onContinue: PropTypes.func,
};

Stats.defaultProps = {
    stats: undefined,
    finished: false,
    onRestart: () => {},
    onContinue: () => {},
};

export default Stats;

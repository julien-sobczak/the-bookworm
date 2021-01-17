import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { StatsScreen } from "../core/UI.js";
import LargeButton from "../toolbox/LargeButton.js";
import * as string from '../../functions/string';

import TimerIcon from '@material-ui/icons/Timer';
import BookIcon from '@material-ui/icons/Book';
import ExtensionIcon from '@material-ui/icons/Extension';
import SpeedIcon from '@material-ui/icons/Speed';
import LargeButtonGroup from '../toolbox/LargeButtonGroup.js';

function Stats({ stats, finished, onRestart, onContinue }) {

    return (
        <StatsScreen>
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
            <LargeButtonGroup>
                <LargeButton text="Retry" colorText="white" colorBackground="#111" onClick={onRestart} />
                {!finished && <LargeButton text="Continue" colorText="white" colorBackground="#111" onClick={onContinue} />}
                <Link to="/chunking/"><LargeButton text="Change" colorText="white" colorBackground="#111" /></Link>
            </LargeButtonGroup>
        </StatsScreen>
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

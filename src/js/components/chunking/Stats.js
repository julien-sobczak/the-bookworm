import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { StatsScreen } from "../core/UI.js";
import LargeButton from "../toolbox/LargeButton.js";
import LargeButtonGroup from '../toolbox/LargeButtonGroup.js';
import * as string from '../../functions/string';

import TimerIcon from '@material-ui/icons/Timer';
import BookIcon from '@material-ui/icons/Book';
import ExtensionIcon from '@material-ui/icons/Extension';
import SpeedIcon from '@material-ui/icons/Speed';

/**
 * Screen presenting various drill statistics.
 *
 * @param {Object} props The component properties.
 */
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
    /**
     * The statistics to display.
     */
    stats: PropTypes.object,
    /**
     * Indicates if the drill was finished until completion or aborted prematurely.
     */
    finished: PropTypes.bool,
    /**
     * Called when the user wants to restart the drill.
     * The callback receives no argument.
     */
    onRestart: PropTypes.func,
    /**
     * Called when the user wants to continue the reading using the same drill settings.
     * The callback receives no argument.
     */
    onContinue: PropTypes.func,
};

Stats.defaultProps = {
    stats: undefined,
    finished: false,
    onRestart: () => {},
    onContinue: () => {},
};

export default Stats;

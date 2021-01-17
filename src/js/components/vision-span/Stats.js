import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { StatsScreen } from "../core/UI.js";
import LargeButton from "../toolbox/LargeButton.js";
import * as string from '../../functions/string';

import TimerIcon from '@material-ui/icons/Timer';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import LargeButtonGroup from '../toolbox/LargeButtonGroup.js';

function Stats({ stats, onRestart }) {

    return (
        <StatsScreen>
            <table>
                <tbody>
                    <tr>
                        <th><TimerIcon/></th>
                        <td>{string.humanReadableShortDuration(stats.durationInSeconds)}</td>
                    </tr>
                    <tr>
                        <th><ThumbUpIcon/></th>
                        <td>{stats.correctAnswers}</td>
                    </tr>
                    <tr>
                        <th><ThumbDownIcon/></th>
                        <td>{stats.wrongAnswers}</td>
                    </tr>
                </tbody>
            </table>
            <LargeButtonGroup>
                <LargeButton text="Retry" colorText="white" colorBackground="#111" onClick={onRestart} />
                <Link to="/vision-span/"><LargeButton text="Change" colorText="white" colorBackground="#111" /></Link>
            </LargeButtonGroup>
        </StatsScreen>
    );
}

Stats.propTypes = {
    stats: PropTypes.object,
    onRestart: PropTypes.func,
};

Stats.defaultProps = {
    stats: undefined,
    onRestart: () => {},
};

export default Stats;

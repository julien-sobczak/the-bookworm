import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import LargeButton from "../toolbox/LargeButton.js";
import * as string from '../../functions/string';

import TimerIcon from '@material-ui/icons/Timer';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

function Stats({ stats, onRestart }) {

    return (
        <div className="FullScreen Stats Centered">
            <table className="Stats">
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
            <div className="Actions">
                <LargeButton text="Retry" colorText="white" colorBackground="#111" onClick={onRestart} />
                <Link to="/vision-span/"><LargeButton text="Change" colorText="white" colorBackground="#111" /></Link>
            </div>
        </div>
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

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { ScreenStats } from "../core/UI.js";
import LargeButton from "../toolbox/LargeButton.js";
import LargeButtonGroup from '../toolbox/LargeButtonGroup.js';
import * as string from '../../functions/string';

import TimerIcon from '@material-ui/icons/Timer';
import BookIcon from '@material-ui/icons/Book';
import NoteIcon from '@material-ui/icons/Note';
import SpeedIcon from '@material-ui/icons/Speed';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';

function Stats({ stats, finished, onRestart, onContinue }) {
    return (
        <ScreenStats>
            <table>
                <tbody>
                    {Object.prototype.hasOwnProperty.call(stats, 'winner') && <tr>
                        {stats.winner === true && <th><SentimentVerySatisfiedIcon/></th>}
                        {stats.winner === false && <th><SentimentDissatisfiedIcon/></th>}
                        {typeof stats.winner === 'undefined' && <th><SentimentSatisfiedIcon/></th>}
                        {stats.winner === true && <td>You WIN!</td>}
                        {stats.winner === false && <td>You LOSE!</td>}
                        {typeof stats.winner === 'undefined' && <td>TIE!</td>}
                    </tr>}
                    <tr>
                        <th><BookIcon/></th>
                        <td>{stats.words} <small>word(s)</small></td>
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
                        <th><NoteIcon/></th>
                        <td>{stats.pages} <small>page(s)</small></td>
                    </tr>
                </tbody>
            </table>
            <LargeButtonGroup>
                <LargeButton text="Retry" colorText="white" colorBackground="#111" onClick={onRestart} />
                {!finished && <LargeButton text="Continue" colorText="white" colorBackground="#111" onClick={onContinue} />}
                <Link to="/practice/"><LargeButton text="Change" colorText="white" colorBackground="#111" /></Link>
            </LargeButtonGroup>
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

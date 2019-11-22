import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import Button from "../toolbox/Button.js";
import * as string from '../../functions/string';

function Stats({ stats, finished, onRestart, onContinue }) {

    return (
        <div className="FullScreen Stats Centered">
            <table className="Stats">
                <tbody>
                    <tr>
                        <td className="Statistic StatisticStroke StatisticShadow">{stats.words}</td>
                        <td>word(s) in {string.humanReadableShortDuration(stats.durationInSeconds)}</td>
                        <td className="Statistic StatisticStrokeShadow">&#61; {stats.wpm}</td>
                        <td>WPM</td>
                    </tr>
                    <tr>
                        <td className="Statistic StatisticStroke StatisticShadow">{stats.chunks}</td>
                        <td>chunk(s)</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div className="Actions">
                <Button text="Retry" colorText="white" colorBackground="#111" onClick={onRestart} />
                {!finished && <Button text="Continue" colorText="white" colorBackground="#111" onClick={onContinue} />}
                <Link to="/chunking/"><Button text="Change" colorText="white" colorBackground="#111" /></Link>
            </div>
        </div>
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
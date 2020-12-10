import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import Button from "../toolbox/Button.js";
import * as string from '../../functions/string';

function Stats({ stats, onRestart }) {

    return (
        <div className="FullScreen Stats Centered">
            <table className="Stats">
                <tbody>
                    <tr>
                        <th>⏱</th>
                        <td>{string.humanReadableShortDuration(stats.durationInSeconds)}</td>
                    </tr>
                    <tr>
                        <th>👍</th>
                        <td>{stats.correctAnswers}</td>
                    </tr>
                    <tr>
                        <th>👎</th>
                        <td>{stats.wrongAnswers}</td>
                    </tr>
                </tbody>
            </table>
            <div className="Actions">
                <Button text="Retry" colorText="white" colorBackground="#111" onClick={onRestart} />
                <Link to="/vision-span/"><Button text="Change" colorText="white" colorBackground="#111" /></Link>
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

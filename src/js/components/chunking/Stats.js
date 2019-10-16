import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import ReactButton from '@material/react-button';
import '@material/react-button/dist/button.css';

function Stats({ stats, finished, onContinue }) {

    return (
        <div className="FullScreen Results Centered">
            Congratulations

            <h3>What's next?</h3>
            {!finished && <ReactButton onClick={onContinue}>Continue</ReactButton>}
            <Link to="/chunking" className="Clickable"><ReactButton onClick={onContinue}>End</ReactButton></Link>
        </div>
    );
}

Stats.propTypes = {
    stats: PropTypes.object,
};

Stats.defaultProps = {
    stats: undefined,
};

export default Stats;
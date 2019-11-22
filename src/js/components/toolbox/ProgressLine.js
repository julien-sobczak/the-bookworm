import React from 'react';
import PropTypes from 'prop-types';

function ProgressLine({ progress, color }) {

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: `${progress}%`,
            zIndex: 999,
            height: "0.2cm",
            backgroundColor: color,
            transition: "width 0.2s linear",
        }} />
    );
}

ProgressLine.propTypes = {
    // Number behind 0 and 100 inclusive
    progress: PropTypes.number,

    // CSS valid color
    color: PropTypes.string,
};

ProgressLine.defaultProps = {
    progress: 0,
    color: 'var(--chunk-color)',
};

export default ProgressLine;

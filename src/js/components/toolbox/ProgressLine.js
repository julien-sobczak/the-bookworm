import React from 'react';
import PropTypes from 'prop-types';

/**
 * Minimal bar visible at the top of the screen showing a progression.
 *
 * @param {Object} props The component properties.
 */
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
    /**
     * Current status.
     * The value must be comprise between 0 and 100 inclusive.
     */
    progress: PropTypes.number,
    /**
     * Color of the progress bar.
     * The value must be a valid CSS color.
     */
    color: PropTypes.string,
};

ProgressLine.defaultProps = {
    progress: 0,
    color: 'var(--chunk-color)',
};

export default ProgressLine;

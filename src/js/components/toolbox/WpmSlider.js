import React from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';

/**
 * Wrapper around MUI Slider to select a WPM value.
 *
 * @param {Object} props The component properties.
 */
function WpmSlider({ value, onChange }) {
    const handleChange = (event, newValue) => {
        if (newValue !== value) {
            onChange(newValue);
        }
    };
    return (
        <Slider
            value={value}
            min={100}
            max={2000}
            step={10}
            valueLabelDisplay="on"
            onChange={handleChange}
            style={{ width: "100%" }}
        />
    );
}
WpmSlider.propTypes = {
    /**
     * The WPM value.
     */
    value: PropTypes.number.isRequired,
    /**
     * Called when the value changed.
     * The callback receives the new numeric value as first argument.
     */
    onChange: PropTypes.func,
};

export default WpmSlider;

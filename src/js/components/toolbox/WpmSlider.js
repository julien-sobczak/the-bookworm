import React from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';

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
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func,
};

export default WpmSlider;

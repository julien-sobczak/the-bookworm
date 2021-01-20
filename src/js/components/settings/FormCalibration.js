import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CalibrationPreview from './CalibrationPreview';

/**
 * Form to configure the calibration value.
 *
 * @param {Object} props The component properties.
 */
const FormCalibration = (props) => {

    const [displayScale, setDisplayScale] = useState(props.displayScale);
    const onChange = props.onChange;

    const handleDisplayScaleChange = (newValue) => {
        if (displayScale === newValue) return;
        setDisplayScale(newValue);
        onChange({
            displayScale: newValue,
        });
    };

    return (
        <CalibrationPreview value={displayScale} onChange={handleDisplayScaleChange} />
    );
};

FormCalibration.propTypes = {
    /**
     * The calibration value.
     */
    displayScale: PropTypes.number,
    /**
     * Called when the value is changed.
     * The callback receives the new numeric value as first argument.
     */
    onChange: PropTypes.func,
};
FormCalibration.defaultProps = {
    displayScale: 1,
    onChange: () => {},
};

export default FormCalibration;

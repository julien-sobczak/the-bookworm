import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CalibrationPreview from './CalibrationPreview';

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
    displayScale: PropTypes.number,
    onChange: PropTypes.func,
};
FormCalibration.defaultProps = {
    displayScale: 1,
    onChange: () => {},
};

export default FormCalibration;

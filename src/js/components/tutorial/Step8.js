import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Text from '../toolbox/Text';

import FormCalibration from '../settings/FormCalibration';

/**
 * This step asks the user to measure a square on screen and adjust its size.
 *
 * @param {Object} props The component properties.
 */
function Step8({ onChange }) {

    let [displayScale, setDisplayScale] = useState(100);

    const handleChange = (settings) => {
        setDisplayScale(settings.displayScale);
        onChange(settings.displayScale);
    };

    return (
        <>
            <h2>Configure</h2>

            <p><em>The Bookworm</em> needs to know the real size of your screen. Indeed, web applications don&apos;t know how to display a text that measures exactly 1inch or 1cm on your screen. Web applications use pixels and there are huge variations between devices about the effective size of a pixel on screen. Therefore, grab a ruler, and scale the following table so that every cell is perfectly measuring 1 inch (= 2.54 cm).</p>

            <FormCalibration displayScale={displayScale} onChange={handleChange} />

            <p><Text manuscript>Congratulations!</Text> You have finished the tutorial. <strong>Ready to start?</strong></p>
        </>
    );
}

Step8.propTypes = {
    /**
     * Called when the user updates the calibration measurement.
     * The callback received the new numeric value as the first argument.
     */
    onChange: PropTypes.func.isRequired,
};

export default Step8;

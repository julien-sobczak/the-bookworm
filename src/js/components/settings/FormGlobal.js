import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Slider from '../toolbox/Slider';
import Help from '../toolbox/Help';

const StepVisualizer = () => {
    const stylesBar = {
        marginLeft: "0.5em",
        backgroundColor: "black",
        color: "white",
        textAlign: "center",
        padding: "0.5em 0"
    };
    const stylesLegend = {
        margin: "0.5em",
        fontWeight: "normal",
    };
    // We increment by "0.25in"
    return (
        <>
            <span className="Width0_25in" style={stylesBar}></span> <small style={stylesLegend}>👈 Must measure ideally 0.25in on your screen</small>
        </>
    );
};

const FormGlobal = (props) => {

    const [displayScale, setDisplayScale] = useState(props.displayScale);
    const onChange = props.onChange;

    const handleDisplayScaleChange = (event) => {
        const newValue = parseFloat(event.target.value);
        if (displayScale === newValue) return;
        setDisplayScale(newValue);
        onChange({
            displayScale: newValue,
        });
    };

    return (
        <table className="Setting">
            <tbody>
                <tr>
                    <th>
                        <label htmlFor="displayScale">Length calibration</label>
                        <Help tip="Determine the increment in space for every drill level"/>:
                    </th>
                    <td>
                        <Slider id="displayScale" min={0.5} value={displayScale} max={2} onChange={handleDisplayScaleChange} />
                        <StepVisualizer/>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

FormGlobal.propTypes = {
    displayScale: PropTypes.number,
    onChange: PropTypes.func,
};

export default FormGlobal;

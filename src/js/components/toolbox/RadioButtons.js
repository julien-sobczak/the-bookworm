import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as string from '../../functions/string';

const RadioButtons = (props) => {

    const [value, setValue] = useState(props.value);
    const onChange = props.onChange;
    const options = props.options;

    useEffect(() => {
        setValue(props.value);
    }, [props]);

    const parse = (value) => {
        const v = options[0].value; // Use the first option value to determine the type to use
        if (typeof v === 'boolean') {
            return value === 'true';
        } else if (typeof v === 'number') {
            return parseInt(value);
        } else if (typeof v === 'string') {
            return value;
        }
        throw new Error(`${typeof v} is not supported`);
    };

    const handleChange = (event) => {
        const newValue = parse(event.target.value);
        setValue(newValue);
        onChange({
            target: {
                value: newValue,
            },
        });
    };

    const radios = [];
    options.forEach((option, index) => {
        const optionLabel = string.capitalize(option.label || option.value);
        const optionAltText = option.alt || option.label;
        const optionClassName = option.className || "";
        radios.push(
            <span key={index} className={"GraphicOption " + (value === option.value ? ' selected' : '')}>
                <label className={`Clickable ${optionClassName}`}>
                    <input
                        type="radio"
                        value={option.value}
                        style={{ display: "none" }}
                        alt={optionAltText}
                        checked={value === option.value}
                        onChange={handleChange} />
                    {optionLabel}
                </label>
            </span>
        );
    });

    return (
        <>
            {radios}
        </>
    );
};

RadioButtons.propTypes = {
    id: PropTypes.string,
    /**
     * The value of the component. The DOM API casts this to a string.
     */
    value: PropTypes.any,
    // value: PropTypes.oneOfType([
    //     PropTypes.string,
    //     PropTypes.number,
    //     PropTypes.bool,
    // ]),
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func,
};

RadioButtons.defaultProps = {
    onChange: () => {},
};

export default RadioButtons;

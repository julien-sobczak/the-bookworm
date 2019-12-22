import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { OperationCanceledException } from 'typescript';

const RadioButtons = (props) => {

    const [value, setValue] = useState(props.value);
    const onChange = props.onChange;
    const options = props.options;

    const parse = (value) => {
        const v = options[0][0]; // Use the first option value to determine the type to use
        if (typeof v === 'boolean') {
            return value === 'true';
        } else if (typeof v === 'number') {
            return parseInt(value);
        } else if (typeof v === 'string') {
            return value;
        }
        throw `${typeof value} ${typeof v} is not supported`;
    }

    const handleChange = (event) => {
        const newValue = parse(event.target.dataset.value);
        setValue(newValue);
        onChange(newValue);
    }

    const buttons = [];
    options.forEach((option, index) => {
        let [optionValue, optionLabel] = option;
        buttons.push(
            <span 
                key={index}
                onClick={handleChange} 
                className={"GraphicOption" + (value === optionValue ? ' selected' : '')} 
                data-value={optionValue}>{optionLabel}</span>
        );
    });
    
    return (
        <>
            {buttons}
        </>
    );
}

RadioButtons.propTypes = {
    id: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
    ]),
    options: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    onChange: PropTypes.func,
};

RadioButtons.defaultProps = {
    onChange: () => {},
};

export default RadioButtons;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as string from '../../functions/string';

function Option({ text, value, selected, alt, className, onChange }) {
    const Button = styled.span`
        display: inline-block;
        height: 40px;
        line-height: 35px;
        vertical-align: baseline;
        border-radius: 2px;
        text-align: center;
        cursor: pointer;
        margin: 0 0.1em;

        &.selected {
            border: 1px solid black;
        }
        & .Clickable {
            display: block;
            padding: 0 0.7em;
        }
        & > span {
            /* When using an inner span for styling, the span should not capture click events
               and let propage the event to the parent .GraphicOption */
            pointer-events: none;
        }
    `;
    return (
        <Button className={classnames({ 'selected': selected })}>
            <label className={classnames('Clickable', className)}>
                <input
                    type="radio"
                    value={value}
                    style={{ display: "none" }}
                    alt={alt}
                    checked={selected}
                    onChange={onChange} />
                {text}
            </label>
        </Button>
    );
}
Option.propTypes = {
    text: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    selected: PropTypes.bool,
    alt: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
Option.defaultProps = {
    selected: false,
};

function RadioButtons(props) {

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
        radios.push(
            <Option
                key={index}
                text={optionLabel}
                value={option.value}
                selected={value === option.value}
                className={option.className}
                alt={option.alt || option.label}
                onChange={handleChange} />
        );
    });

    return (
        <>
            {radios}
        </>
    );
}

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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import OptionsDrill from './OptionsDrill';
import OptionsGame from '../OptionsGame';

/**
 * Form to configure the drill.
 */
function Form(props) {

    const [value, setValue] = useState(props);
    const onChange = props.onChange;

    useEffect(() => {
        setValue(props);
    }, [props]);

    const handleOptionsChange = (settings) => {
        const newValue = {
            ...value,
            ...settings,
        };
        setValue(newValue);
        onChange(newValue);
    };

    return (
        <>
            <OptionsDrill {...value} onChange={handleOptionsChange } />
            <OptionsGame {...value} onChange={handleOptionsChange } />
        </>
    );
}

Form.propTypes = {
    // Inherit properties
    ...Viewer.propTypes,

    /**
     * Called when a setting is updated.
     * The callback receives an object as first argument containing the new drill settings.
     */
    onChange: PropTypes.func,
};
Form.defaultProps = {
    ...Viewer.defaultProps,
};

export default Form;

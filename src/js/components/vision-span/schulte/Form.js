import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import OptionsDrill from './OptionsDrill';
import OptionsGame from '../OptionsGame';

const Form = (props) => {

    const [value, setValue] = useState(props);
    const onChange = props.onChange;

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
};

Form.propTypes = {
    ...Viewer.propTypes,
    onChange: PropTypes.func,
};

Form.defaultProps = {
    ...Viewer.defaultProps,
};

export default Form;

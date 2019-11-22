import React from 'react';

import OptionsDrill from './OptionsDrill';
import OptionsGame from '../OptionsGame';

const Form = (props) => {

    const onChange = props.onChange;

    const handleOptionsChange = (settings) => {
        onChange({
            ...props,
            ...settings,
        });
    };

    return (
        <>
            <OptionsDrill {...props} onChange={handleOptionsChange } />
            <OptionsGame {...props} onChange={handleOptionsChange } />
        </>
    );
};

export default Form;
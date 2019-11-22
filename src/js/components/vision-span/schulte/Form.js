import React from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
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

Form.propTypes = {
    ...Viewer.propTypes,
    onChange: PropTypes.func.isRequired,
};

Form.defaultProps = {
    ...Viewer.defaultProps,
};

export default Form;
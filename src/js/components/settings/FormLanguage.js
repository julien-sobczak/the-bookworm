import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Help from '../toolbox/Help';

const FormLanguage = (props) => {

    const [native, setNative] = useState(props.native);
    const onChange = props.onChange;

    const handleNativeChange = (event) => {
        const newNative = event.target.value;
        if (native === newNative) return;
        setNative(newNative);
        onChange({
            native: newNative,
        });
    };

    return (
        <table className="Setting">
            <tbody>
                <tr>
                    <th><label htmlFor="native">Default</label>:</th>
                    <td>
                        <Help title="Select your native language to filter books in the library." />
                    </td>
                    <td>
                        <select id="native" value={native} onChange={handleNativeChange}>
                            <option value="Dutch">Dutch</option>
                            <option value="English">English</option>
                            <option value="French">French</option>
                            <option value="Italian">Italian</option>
                            <option value="Portuguese">Portuguese</option>
                            <option value="Spanish">Spanish</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

FormLanguage.propTypes = {
    native: PropTypes.string,
    onChange: PropTypes.func,
};

export default FormLanguage;

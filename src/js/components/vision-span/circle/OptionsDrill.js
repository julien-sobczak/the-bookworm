import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Help from '../../toolbox/Help';
import Viewer from './Viewer';

import * as engine from '../../../functions/engine';

const OptionsDrill = (props) => {

    const [span, setSpan] = useState(props.span);

    React.useEffect(() => {
        setSpan(props.span);
    }, [props]);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            span: span,
        };
    };

    const handleSpanChange = (event) => {
        const newValue = event.target.value;
        setSpan(newValue);
        onChange({
            ...currentState(),
            span: newValue,
        });
    };

    return (
        <table className="Setting">
            <tbody>
                <tr>
                    <th><label htmlFor="span">Span</label>:</th>
                    <td>
                        <Help title="Determine the radius of the circle separating the center letter from other letters to read." />
                    </td>
                    <td>
                        <select id="span" name="span" onChange={handleSpanChange} value={span}>
                            {engine.SPANS.map((s, index) => {
                                return <option key={index} value={s}>{s}</option>;
                            })}
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

OptionsDrill.propTypes = {
    ...Viewer.propTypes,
    onChange: PropTypes.func,
};

OptionsDrill.defaultProps = {
    ...Viewer.defaultProps,
};

export default OptionsDrill;

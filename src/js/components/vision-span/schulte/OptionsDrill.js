import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import RadioButtons from '../../toolbox/RadioButtons';

import * as engine from '../../../functions/engine';

const OptionsDrill = (props) => {

    const [size, setSize] = useState(props.size);
    const [span, setSpan] = useState(props.span);

    React.useEffect(() => {
        setSize(props.size);
        setSpan(props.span);
    }, [props]);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            size: size,
            span: span,
        };
    };

    const handleSizeChange = (event) => {
        const newValue = event.target.value;
        setSize(newValue);
        onChange({
            ...currentState(),
            size: newValue,
        });
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
                    <th><label htmlFor="size">Size</label>:</th>
                    <td>
                        <RadioButtons
                            id="size"
                            options={[
                                { value: 3, alt: "witdh 3" },
                                { value: 5, alt: "width 5" },
                                { value: 7, alt: "width 7" },
                                { value: 9, alt: "width 9" },
                            ]}
                            onChange={handleSizeChange}
                            value={size} />
                    </td>
                </tr>
                <tr>
                    <th><label htmlFor="span">Span</label>:</th>
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

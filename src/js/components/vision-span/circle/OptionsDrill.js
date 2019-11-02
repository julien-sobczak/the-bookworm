import React, { useState } from 'react';

import * as helpers from '../../../functions/engine';

const OptionsDrill = (props) => {

    const [span, setSpan] = useState(props.span);

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
                    <th>Span:</th>
                    <td>
                        <select name="span" onChange={handleSpanChange} value={span}>
                            {helpers.SPANS.map((s, index) => {
                                return <option key={index} value={s}>{s}</option>
                            })}
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default OptionsDrill;
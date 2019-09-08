import React, { useState } from 'react';

import * as helpers from '../../functions/engine';

// Material Design UI forms
import Switch from '@material/react-switch';

import "@material/react-switch/dist/switch.css";

const Form = (props) => {

    const [span, setSpan] = useState(props.span);
    const [autoLevel, setAutoLevel] = useState(props.autoLevel);

    const onChange = props.onChange;

    const handleSpanChange = (event) => {
        const newSpan = event.target.value;
        setSpan(newSpan);
        onChange({
            span: newSpan,
            autoLevel: autoLevel,
        });
    };

    const handleAutoLevelChange = (event) => {
        const newAutoLevel = event.target.checked;
        setAutoLevel(newAutoLevel);
        onChange({
            span: span,
            autoLevel: newAutoLevel,
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
                <tr>
                    <th>Auto-Level:</th>
                    <td>
                        <Switch
                            nativeControlId='autoLevel'
                            checked={autoLevel}
                            onChange={handleAutoLevelChange} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default Form;
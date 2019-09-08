import React, { useState } from 'react';

import * as helpers from '../../functions/engine';

// Material Design UI forms
import Switch from '@material/react-switch';
import MaterialIcon from '@material/react-material-icon';

import "@material/react-switch/dist/switch.css";

const Form = (props) => {

    const [lines, setLines] = useState(props.lines);
    const [span, setSpan] = useState(props.span);
    const [autoLevel, setAutoLevel] = useState(props.autoLevel);

    const onChange = props.onChange;

    const handleSpanChange = (event) => {
        const newSpan = event.target.value;
        setSpan(newSpan);
        onChange({
            lines: lines,
            span: newSpan,
            autoLevel: autoLevel,
        });
    };

    const handleLinesChange = (event) => {
        const newLines = parseInt(event.target.dataset.value);
        setLines(newLines);
        onChange({
            lines: newLines,
            span: span,
            autoLevel: autoLevel,
        });
    };

    const handleAutoLevelChange = (event) => {
        const newAutoLevel = event.target.checked;
        setAutoLevel(newAutoLevel);
        onChange({
            lines: lines,
            span: span,
            autoLevel: newAutoLevel,
        });
    };

    return (
        <table className="Setting">
            <tbody>
                <tr>
                    <th>Lines:</th>
                    <td>
                        <span onClick={handleLinesChange} className={"GraphicOption" + (lines === 1 ? ' selected' : '')} data-value={1}>1</span>
                        <span onClick={handleLinesChange} className={"GraphicOption" + (lines === 2 ? ' selected' : '')} data-value={2}>2</span>
                        <span onClick={handleLinesChange} className={"GraphicOption" + (lines === 3 ? ' selected' : '')} data-value={3}>3</span>
                    </td>
                </tr>
                <tr>
                    <th>Span:</th>
                    <td>
                        <select name="span" onChange={handleSpanChange} value={span}>
                            {helpers.SPANS.map((s, index) => {
                                return <option key={index} value={s}>{s}</option>
                            })}
                        </select>
                        <MaterialIcon icon='flip' />
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
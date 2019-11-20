import React, { useState } from 'react';

import * as helpers from '../../../functions/engine';

import MaterialIcon from '@material/react-material-icon';

const OptionsDrill = (props) => {

    const [lines, setLines] = useState(props.lines);
    const [span, setSpan] = useState(props.span);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            lines: lines,
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

    const handleLinesChange = (event) => {
        const newValue = parseInt(event.target.dataset.value);
        setLines(newValue);
        onChange({
            ...currentState(),
            lines: newValue,
        });
    };

    return (
        <table className="Setting">
            <tbody>
                <tr>
                    <th>Lines:</th>
                    <td>
                        <span onClick={handleLinesChange} className={"GraphicOption" + (lines === 5  ? ' selected' : '')} data-value={5}>5</span>
                        <span onClick={handleLinesChange} className={"GraphicOption" + (lines === 10 ? ' selected' : '')} data-value={10}>10</span>
                        <span onClick={handleLinesChange} className={"GraphicOption" + (lines === 0  ? ' selected' : '')} data-value={0}>Fit Screen</span>
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
            </tbody>
        </table>
    );
}

export default OptionsDrill;
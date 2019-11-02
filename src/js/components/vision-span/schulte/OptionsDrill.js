import React, { useState } from 'react';

import * as helpers from '../../../functions/engine';

const OptionsDrill = (props) => {

    const [size, setSize] = useState(props.size);
    const [span, setSpan] = useState(props.span);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            size: size,
            span: span,
        }
    };

    const handleSizeChange = (event) => {
        const newValue = parseInt(event.target.dataset.value);
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
                    <th>Size:</th>
                    <td>
                        <span onClick={handleSizeChange} className={"GraphicOption" + (size === 3 ? ' selected' : '')} data-value={3}>3</span>
                        <span onClick={handleSizeChange} className={"GraphicOption" + (size === 5 ? ' selected' : '')} data-value={5}>5</span>
                        <span onClick={handleSizeChange} className={"GraphicOption" + (size === 7 ? ' selected' : '')} data-value={7}>7</span>
                        <span onClick={handleSizeChange} className={"GraphicOption" + (size === 9 ? ' selected' : '')} data-value={9}>9</span>
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
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default OptionsDrill;
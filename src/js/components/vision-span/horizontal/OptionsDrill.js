import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';

import * as helpers from '../../../functions/engine';

import MaterialIcon from '@material/react-material-icon';

const OptionsDrill = (props) => {

    const [multiple, setMultiple] = useState(props.multiple);
    const [lines, setLines] = useState(props.lines);
    const [columns, setColumns] = useState(props.columns);
    const [spans, setSpans] = useState(props.spans);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            multiple: multiple,
            lines: lines,
            columns: columns,
            spans: spans,
        };
    };

    const handleColumnsChange = (event) => {
        const newColumns = parseInt(event.target.dataset.value);
        const newSpans = Array(newColumns).fill(helpers.SPANS[1]);
        setColumns(newColumns);
        setSpans(newSpans);
        onChange({
            ...currentState(),
            columns: newColumns,
            spans: newSpans,
        });
    };

    const handleMultipleChange = (event) => {
        const newValue = event.target.dataset.value === 'true';
        setMultiple(newValue);
        onChange({
            ...currentState(),
            multiple: newValue,
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

    const handleSpansChange = (event) => {
        const spanIndex = event.target.dataset.span;
        const spanValue = event.target.value;
        const newSpans = spans.slice(0);
        newSpans[spanIndex] = spanValue;
        newSpans[columns-spanIndex-2] = spanValue; // spans are symmetrical
        setSpans(newSpans);
        onChange({
            ...currentState(),
            spans: newSpans,
        });
    };

    const spansElements = [];
    const spansCount = (columns - 1) / 2;
    for (let i = 0; i < spansCount; i++) {
        spansElements.push(
            <span key={i}>
                {i > 0 && <span className="DotSeparator"></span>}
                <select name="spans" onChange={handleSpansChange} data-span={i} value={spans[i]}>
                    {helpers.SPANS.map((s, index) => {
                        return <option key={index} value={s}>{s}</option>;
                    })}
                </select>
            </span>
        );
    }

    return (
        <table className="Setting">
            <tbody>
                <tr>
                    <th>Columns:</th>
                    <td>
                        <span onClick={handleColumnsChange} className={"GraphicOption" + (columns === 3 ? ' selected' : '')} data-value={3}>3</span>
                        <span onClick={handleColumnsChange} className={"GraphicOption" + (columns === 5 ? ' selected' : '')} data-value={5}>5</span>
                        <span onClick={handleColumnsChange} className={"GraphicOption" + (columns === 7 ? ' selected' : '')} data-value={7}>7</span>
                        <span onClick={handleColumnsChange} className={"GraphicOption" + (columns === 9 ? ' selected' : '')} data-value={9}>9</span>
                    </td>
                </tr>
                <tr>
                    <th>Series:</th>
                    <td>
                        <span onClick={handleMultipleChange} className={"GraphicOption" + (multiple === false ? ' selected' : '')} data-value={false}>Unique</span>
                        <span onClick={handleMultipleChange} className={"GraphicOption" + (multiple === true ? ' selected' : '')} data-value={true}>Multiple</span>
                    </td>
                </tr>
                {multiple && <tr>
                    <th>Lines:</th>
                    <td>
                        <span onClick={handleLinesChange} className={"GraphicOption" + (lines === 1 ? ' selected' : '')} data-value={1}>1</span>
                        <span onClick={handleLinesChange} className={"GraphicOption" + (lines === 2 ? ' selected' : '')} data-value={2}>2</span>
                        <span onClick={handleLinesChange} className={"GraphicOption" + (lines === 3 ? ' selected' : '')} data-value={3}>3</span>
                    </td>
                </tr>}
                <tr>
                    <th>Span:</th>
                    <td>
                        {spansElements}
                        <MaterialIcon icon='flip' />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

OptionsDrill.propTypes = {
    ...Viewer.propTypes,
    onChange: PropTypes.func.isRequired,
};

OptionsDrill.defaultProps = {
    ...Viewer.defaultProps,
};

export default OptionsDrill;
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FlipIcon from '@material-ui/icons/Flip';

import Viewer from './Viewer';
import RadioButtons from '../../toolbox/RadioButtons';

import * as helpers from '../../../functions/engine';

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
        const newColumns = event.target.value;
        const newSpans = Array(newColumns-1).fill(helpers.SPANS[1]);
        setColumns(newColumns);
        setSpans(newSpans);
        onChange({
            ...currentState(),
            columns: newColumns,
            spans: newSpans,
        });
    };

    const handleMultipleChange = (event) => {
        const newValue = event.target.value;
        setMultiple(newValue);
        onChange({
            ...currentState(),
            multiple: newValue,
        });
    };

    const handleLinesChange = (event) => {
        const newValue = event.target.value;
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
                <select data-testid={"span"+i} name="spans" onChange={handleSpansChange} data-span={i} value={spans[i]}>
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
                        <RadioButtons
                            options={[
                                { value: 3, alt: "3 columns" },
                                { value: 5, alt: "5 columns" },
                                { value: 7, alt: "7 columns" },
                                { value: 9, alt: "9 columns" },
                            ]} 
                            onChange={handleColumnsChange} 
                            value={columns} />
                    </td>
                </tr>
                <tr>
                    <th>Series:</th>
                    <td>
                        <RadioButtons 
                            options={[
                                { value: false, label: "Unique"   }, 
                                { value: true,  label: "Multiple" },
                            ]} 
                            onChange={handleMultipleChange} 
                            value={multiple} />
                    </td>
                </tr>
                {multiple && <tr>
                    <th>Lines:</th>
                    <td>
                        <RadioButtons
                            options={[
                                { value: 1, alt: "1 line"  }, 
                                { value: 2, alt: "2 lines" }, 
                                { value: 3, alt: "3 lines" },
                            ]} 
                            onChange={handleLinesChange} 
                            value={lines} />
                    </td>
                </tr>}
                <tr>
                    <th>Span:</th>
                    <td>
                        {spansElements}
                        <FlipIcon />
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
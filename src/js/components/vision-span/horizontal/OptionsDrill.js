import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FlipIcon from '@material-ui/icons/Flip';

import Viewer from './Viewer';
import RadioButtons from '../../toolbox/RadioButtons';
import Help from '../../toolbox/Help';

import * as engine from '../../../functions/engine';

const OptionsDrill = (props) => {
    const [multiple, setMultiple] = useState(props.multiple);
    const [lines, setLines] = useState(props.lines);
    const [columns, setColumns] = useState(props.columns);
    const [spans, setSpans] = useState(props.spans);

    useEffect(() => {
        setMultiple(props.multiple);
        setLines(props.lines);
        setColumns(props.columns);
        setSpans(props.spans);
    }, [props]);

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
        const newSpans = Array(newColumns-1).fill(engine.SPANS[1]);
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
                    {engine.SPANS.map((s, index) => {
                        return <option key={index} value={s}>{s}</option>;
                    })}
                </select>
            </span>
        );
    }

    return (
        <>
            <table className="Setting">
                <tbody>
                    <tr>
                        <th>
                            <label htmlFor="columns">Columns</label>:
                        </th>
                        <td>
                            <Help title="Determine how many columns to use. The number is even as you will always focus on the middle column." />
                        </td>
                        <td>
                            <RadioButtons
                                id="columns"
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
                        <th>
                            <label htmlFor="series">Series</label>:
                        </th>
                        <td>
                            <Help title="One fixation per line or one fixation per group of lines." />
                        </td>
                        <td>
                            <RadioButtons
                                id="series"
                                options={[
                                    { value: false, label: "Unique"   },
                                    { value: true,  label: "Multiple" },
                                ]}
                                onChange={handleMultipleChange}
                                value={multiple} />
                        </td>
                    </tr>
                    {multiple && <tr>
                        <th>
                            <label htmlFor="lines">Lines</label>:
                        </th>
                        <td>
                            <Help title="Determine the number of lines per group." />
                        </td>
                        <td>
                            <RadioButtons
                                id="lines"
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
                        <th>
                            Span:
                        </th>
                        <td>
                            <Help title="Determine the space between each column." />
                        </td>
                        <td>
                            {spansElements}
                            <FlipIcon />
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FlipIcon from '@material-ui/icons/Flip';

import Viewer from './Viewer';
import RadioButtons from '../../toolbox/RadioButtons';

import * as helpers from '../../../functions/engine';

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
        const newValue = event.target.value;
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
                    <th><span>Lines</span>:</th>
                    <td>
                        <RadioButtons
                            options={[
                                { value: 5,  label: "5",          alt: "5 lines"    },
                                { value: 10, label: "10",         alt: "10 lines"   },
                                { value: 0,  label: "Fit Screen", alt: "Fit Screen" },
                            ]} 
                            onChange={handleLinesChange} 
                            value={lines} />
                    </td>
                </tr>
                <tr>
                    <th><label htmlFor="span">Span</label>:</th>
                    <td>
                        <select id="span" name="span" onChange={handleSpanChange} value={span}>
                            {helpers.SPANS.map((s, index) => {
                                return <option key={index} value={s}>{s}</option>;
                            })}
                        </select>
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
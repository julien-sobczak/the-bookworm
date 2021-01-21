import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FlipIcon from '@material-ui/icons/Flip';

import Help from '../../toolbox/Help';
import Viewer from './Viewer';
import RadioButtons from '../../toolbox/RadioButtons';

import * as engine from '../../../functions/engine';

/**
 * Inner form to configure the drill specific settings.
 *
 * @param {Object} props The component properties.
 */
function OptionsDrill(props) {

    const [lines, setLines] = useState(props.lines);
    const [span, setSpan] = useState(props.span);

    useEffect(() => {
        setLines(props.lines);
        setSpan(props.span);
    }, [props]);

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
        <table>
            <tbody>
                <tr>
                    <th><span>Lines</span>:</th>
                    <td>
                        <Help title="Determine the number of lines to form the pyramid." />
                    </td>
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
                        <Help title="Determine the maximum space between columns on the last line of the pyramid." />
                    </td>
                    <td>
                        <select id="span" name="span" onChange={handleSpanChange} value={span}>
                            {engine.SPANS.map((s, index) => {
                                return <option key={index} value={s}>{s}</option>;
                            })}
                        </select>
                        <FlipIcon />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

OptionsDrill.propTypes = {
    // Inherit properties
    ...Viewer.propTypes,

    /**
     * Called when a setting is updated.
     * The callback receives as first argument the new drill settings.
     */
    onChange: PropTypes.func,
};

OptionsDrill.defaultProps = {
    ...Viewer.defaultProps,
};

export default OptionsDrill;

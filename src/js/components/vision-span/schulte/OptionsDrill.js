import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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

    const [size, setSize] = useState(props.size);
    const [span, setSpan] = useState(props.span);

    useEffect(() => {
        setSize(props.size);
        setSpan(props.span);
    }, [props]);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            size: size,
            span: span,
        };
    };

    const handleSizeChange = (event) => {
        const newValue = event.target.value;
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
        <table>
            <tbody>
                <tr>
                    <th><label htmlFor="size">Size</label>:</th>
                    <td>
                        <Help title="Determine the number of columns and rows." />
                    </td>
                    <td>
                        <RadioButtons
                            id="size"
                            options={[
                                { value: 3, alt: "witdh 3" },
                                { value: 5, alt: "width 5" },
                                { value: 7, alt: "width 7" },
                                { value: 9, alt: "width 9" },
                            ]}
                            onChange={handleSizeChange}
                            value={size} />
                    </td>
                </tr>
                <tr>
                    <th><label htmlFor="span">Span</label>:</th>
                    <td>
                        <Help title="Determine the width and height of a single cell." />
                    </td>
                    <td>
                        <select id="span" name="span" onChange={handleSpanChange} value={span}>
                            {engine.SPANS.map((s, index) => {
                                return <option key={index} value={s}>{s}</option>;
                            })}
                        </select>
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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Help from '../../toolbox/Help';
import Viewer from './Viewer';

import * as engine from '../../../functions/engine';

/**
 * Inner form to configure the drill specific settings.
 *
 * @param {Object} props The component properties.
 */
function OptionsDrill(props) {

    const [span, setSpan] = useState(props.span);

    useEffect(() => {
        setSpan(props.span);
    }, [props]);

    const onChange = props.onChange;

    const currentState = () => {
        return {
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

    return (
        <table>
            <tbody>
                <tr>
                    <th><label htmlFor="span">Span</label>:</th>
                    <td>
                        <Help title="Determine the radius of the circle separating the center letter from other letters to read." />
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

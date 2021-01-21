import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Engine from './Engine';
import Styled from '../../core/Styled';
import { Serie, Line, Cell } from '../UI';
import { SPANS } from '../../../functions/engine';

/**
 * Default properties.
 */
const defaultViewerSettings = {
    lines: 1,
    columns: 3,
    spans: ["0.5in", "0.5in"],
    multiple: false,
    autoLevel: true,
};

/**
 * Render the drill.
 *
 * @param {Object} props The component properties.
 */
function Viewer(props) {

    let drill = props.drill;
    if (!drill) {
        drill = new Engine(props.lines, props.columns, props.multiple ? 2 : 1).getDrill();
    }

    /** Evaluate the CSS classes from the drill options. */
    const cssSpan = function(index) {
        // Ex: spans: [0.75in, 0.5in, 0.5in, 0.75in]
        // Columns: A Z U A P
        // =>
        // A (0.75in) Z (0.5in) U (0.5in) A (0.75in) P

        const spanLeft = (index < 1) ? '0in' : props.spans[index - 1];
        const spanRight = (index > props.spans.length - 1) ? '0in' : props.spans[index];

        return "SpanLeft" + spanLeft.replace('.', '_') + ' SpanRight' + spanRight.replace('.', '_'); // . is forbidden in CSS class names
    };

    const Viewer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;

    return (
        <Styled {...props} centered>
            <Viewer>
                {drill && drill.map((serie, serieIndex) => {
                    return (
                        <Serie key={serieIndex}>
                            {serie.lines.map((line, lineIndex) => {
                                return (
                                    <Line key={lineIndex}>
                                        {line.columns.map((col, columnIndex) => {
                                            return (
                                                <Cell
                                                    key={columnIndex}
                                                    testId={'Serie' + serieIndex + 'Line' + lineIndex + 'Column' + columnIndex}
                                                    className={cssSpan(columnIndex)}
                                                    valid={col.valid}>
                                                    {col.label}
                                                </Cell>
                                            );
                                        })}
                                    </Line>
                                );
                            })}
                        </Serie>
                    );
                })}
            </Viewer>
        </Styled>
    );
}

Viewer.propTypes = {
    // Inherit properties
    ...Styled.propTypes,

    /**
     * One serie or as much as can fit on screen?
     */
    multiple: PropTypes.bool,
    /**
     * How many lines per series?
     */
    lines: PropTypes.number,
    /**
     * How many columns?
     */
    columns: PropTypes.number,
    /**
     * Negative space between two adjacent columns (should contains columns.length - 1 values).
     */
    spans: PropTypes.arrayOf(PropTypes.oneOf(SPANS)),
    /**
     * Adjust the level between drills automatically according to the number of errors.
     */
    autoLevel: PropTypes.bool,
    /**
     * The drill to display.
     */
    drill: PropTypes.arrayOf(PropTypes.object),
};
Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...defaultViewerSettings,
};

export { Viewer as default, defaultViewerSettings };

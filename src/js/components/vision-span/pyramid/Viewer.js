import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Line, Cell } from '../UI';
import Styled from '../../core/Styled';
import * as engine from '../../../functions/engine';

const defaultViewerSettings = {
    span: "2in",
    lines: 0,
    autoLevel: true,
};

function Viewer(props) {
    // How it works?
    // We start at span=0.25in
    // We end at span=props.span (e.g. 2in)
    // We have n lines
    // We have a list of increment possible for the span (e.g., 0.25in, 0.5in, 0.75in, 1in, 1.25in, ...)
    // We should increment progressively the span to reach the final span.

    let drill = props.drill;

    /** Evaluate the CSS classes from the drill options. */
    const cssSpan = function(span) {
        return "SpanLeft" + span.replace('.', '_') + ' SpanRight' + span.replace('.', '_');
    };

    let startSpanIndex = 0;
    let endSpanIndex = engine.SPANS.indexOf(props.span);
    let linesPerSpan = Math.floor(props.drill.lines.length / (endSpanIndex - startSpanIndex));
    let increment = 1;
    if (linesPerSpan === 0) {
        // Not enougth lines compared to the number of steps required to reach the end span
        // We need to proceed to several span increments between two successive lines.
        increment = Math.ceil(1.0 / (props.drill.lines.length / (endSpanIndex - startSpanIndex)));
        linesPerSpan = 1;
    }

    let currentSpanIndex = -1;
    let currentSpan = undefined;
    let countLinesInSpan = 0;

    const Viewer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;

    return (
        <Styled {...props} centered>
            <Viewer>
                {drill.lines.map((line, lineIndex) => {
                    if (!currentSpan) {
                        // Fist line: start at 0in
                        currentSpanIndex = 0;
                        currentSpan = engine.SPANS[currentSpanIndex];
                        countLinesInSpan = 1;
                    } else if (lineIndex === drill.lines.length - 1) {
                        // Last line: end at expected span
                        const end = engine.SPANS.indexOf(props.span);
                        currentSpan = engine.SPANS[end];
                        countLinesInSpan = 1;
                    } else if (countLinesInSpan === linesPerSpan) {
                        // Intermediate line requiring span increment
                        currentSpanIndex += increment;
                        currentSpan = engine.SPANS[currentSpanIndex];
                        countLinesInSpan = 1;
                    } else {
                        // Intermediate line still using the same span
                        countLinesInSpan++;
                    }

                    return (
                        <Line key={lineIndex}>
                            {line.columns.map((column, columnIndex) => {
                                return (
                                    <Cell
                                        key={columnIndex}
                                        testId={'Line' + lineIndex + 'Column' + columnIndex}
                                        className={cssSpan(currentSpan)}
                                        valid={column.valid}>
                                        {column.label}
                                    </Cell>
                                );
                            })}
                        </Line>
                    );
                })}
            </Viewer>
        </Styled>
    );
}

Viewer.propTypes = {
    ...Styled.propTypes,

    // How many lines
    lines: PropTypes.number,
    // Negative space between with the center column for the bottom values
    span: PropTypes.oneOf(engine.SPANS),
    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,
    // Drill to display
    drill: PropTypes.object,
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...defaultViewerSettings,
};

export { Viewer as default, defaultViewerSettings };

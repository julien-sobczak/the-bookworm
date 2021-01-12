import React from 'react';
import PropTypes from 'prop-types';

import Engine from './Engine';
import Styled from '../../toolbox/Styled';
import { SPANS } from '../../../functions/engine';

const defaultViewerSettings = {
    lines: 1,
    columns: 3,
    spans: ["0.5in", "0.5in"],
    multiple: false,
    autoLevel: true,
};

/**
 * Only responsible to display the drill.
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

    return (
        <Styled className="Viewer Centered" {...props}>
            {drill && drill.map((serie, serieIndex) => {
                return (
                    <div className="Serie" key={serieIndex}>
                        {serie.lines.map((line, lineIndex) => {
                            return (
                                <div className="Line" key={lineIndex}>
                                    {line.columns.map((col, columnIndex) => {
                                        return (
                                            <span
                                                key={columnIndex}
                                                data-testid={'Serie'+serieIndex+'Line'+lineIndex+'Column'+columnIndex}
                                                className={"Cell " + cssSpan(columnIndex) + " " + (col.valid === true ? 'valid' : '')}>
                                                {col.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </Styled>
    );
}

Viewer.propTypes = {
    ...Styled.propTypes,

    // One serie or as much as screen allows
    multiple: PropTypes.bool,
    // How many lines per series?
    lines: PropTypes.number,
    // How many columns?
    columns: PropTypes.number,
    // Negative space between two adjacent columns (should contains columns.length - 1 values)
    spans: PropTypes.arrayOf(PropTypes.oneOf(SPANS)),

    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,

    // The drill to display
    drill: PropTypes.arrayOf(PropTypes.object),
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...defaultViewerSettings,
};

export { Viewer as default, defaultViewerSettings };

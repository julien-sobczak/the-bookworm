import React from 'react';
import PropTypes from 'prop-types';

import Styled from '../../toolbox/Styled';

/**
 * Only responsible to display the drill.
 */
function Viewer(props) {

    /** Evaluate the CSS classes from the drill options. */
    const cssSpan = function(index) {
        // Ex: spans: [0.75in, 0.5in, 0.5in, 0.75in]
        // Columns: A Z U A P
        // =>
        // A (0.75in) Z (0.5in) U (0.5in) A (0.75in) P

        const spanLeft = (index < 1) ? '0in' : props.spans[index - 1];
        const spanRight = (index > props.spans.length - 1) ? '0in' : props.spans[index];

        return "SpanLeft" + spanLeft.replace('.', '_') + ' SpanRight' + spanRight.replace('.', '_'); // . is forbidden in CSS class names
    }

    return (
        <Styled className="Viewer Centered" {...props}>
            {props.drill && props.drill.map((serie, index) => {
                return (
                    <div className="Serie" key={index}>
                        {serie.lines.map((line, index) => {
                            return (
                                <div className="Line" key={index}>
                                    {line.columns.map((col, index) => {
                                        return <span key={index} className={"Cell " + cssSpan(index) + " " + (col.valid === true ? 'valid' : '')}>{col.label}</span>
                                    })}
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </Styled>
    );
}

Viewer.propTypes = {
    ...Styled.propTypes,

    drill: PropTypes.arrayOf(PropTypes.object),
    // Negative space between two adjacent columns (should contains columns.length - 1 values)
    spans: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
};

export default Viewer;

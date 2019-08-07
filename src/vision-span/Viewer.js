import React from 'react';
import PropTypes from 'prop-types';

import Styled from '../toolbox/Styled';

/**
 * Only responsible to display a DrillLogic.
 */
class Viewer extends React.Component {

    static defaultProps = {
        ...Styled.defaultProps,
    };

    static propTypes = {
        drill: PropTypes.object,
        // Negative space between two adjacent columns (should contains columns.length - 1 values)
        spans: PropTypes.arrayOf(PropTypes.string).isRequired,
    };

    // Only these span values are supported (by proceed by 0.25 increment as encountered in the book Triple Your Reading Speed by Wade E. Cutler)
    SPANS = ['0in', '0.25in', '0.5in', '0.75in', '1in', '1.25in', '1.5in', '1.75in', '2in', '2.25in', '2.5in', '2.75in', '3in', '3.25in', '3.5in', '3.75in', '4in'];
    // TODO remove is unused

    /** Evaluate the CSS classes from the drill options. */
    cssSpan(index) {
        // Ex: spans: [0.75in, 0.5in, 0.5in, 0.75in]
        // Columns: A Z U A P
        // =>
        // A (0.75in) Z (0.5in) U (0.5in) A (0.75in) P

        const spanLeft = (index < 1) ? '0in' : this.props.spans[index - 1];
        const spanRight = (index > this.props.spans.length - 1) ? '0in' : this.props.spans[index];

        return "SpanLeft" + spanLeft.replace('.', '_') + ' SpanRight' + spanRight.replace('.', '_'); // . is forbidden in CSS class names
    }

    render() {
        return (
            <Styled className="VisionSpanViewer" fontFamily={this.props.fontFamily} fontSize={this.props.fontSize} fontStyle={this.props.fontStyle} backgroundColor={this.props.backgroundColor} color={this.props.color}>
                {this.props.drill && this.props.drill.series.map((serie, index) => {
                    return (
                        <div className="Serie" key={index}>
                            {serie.lines.map((line, index) => {
                                return (
                                    <div className="Line" key={index}>
                                        {line.columns.map((col, index) => {
                                            return <span key={index} className={"Cell " + this.cssSpan(index) + " " + (col.valid === true ? 'valid' : '')}>{col.label}</span>
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
}

export default Viewer;

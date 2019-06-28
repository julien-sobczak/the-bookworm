import React from 'react';
import PropTypes from 'prop-types';

/**
 * Only responsible to display a DrillLogic.
 */
class Viewer extends React.Component {

    static defaultProps = {
        fontFamily: 'Rosboto',
        fontSize: '12pt',
        fontStyle: 'normal',
        backgroundColor: 'white',
        color: 'black',
    };

    static propTypes = {
        drill: PropTypes.object,
        // Negative space between two adjacent columns (should contains columns.length - 1 values)
        spans: PropTypes.arrayOf(PropTypes.string).isRequired,
    };

    // Only these span values are supported (by proceed by 0.25 increment as encountered in the book Triple Your Reading Speed by Wade E. Cutler)
    SPANS = ['0in', '0.25in', '0.5in', '0.75in', '1in', '1.25in', '1.5in', '1.75in', '2in', '2.25in', '2.5in', '2.75in', '3in', '3.25in', '3.5in', '3.75in', '4in'];

    /** Evaluate the CSS classes from the styling options. */
    cssStyle() {
        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }

        const fontFamilyClass = capitalize(this.props.fontFamily);
        const fontSizeClass = 'Size' + this.props.fontSize;
        const fontStyleClass = this.props.fontStyle.split(' ').map(capitalize).join('');
        // TODO add `backgroundColor` and `color`

        return `${fontFamilyClass} ${fontSizeClass} ${fontStyleClass}`
    }

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
            <div className={'VisionSpanViewer ' + this.cssStyle()}>

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
            </div>
        );
    }
}

export default Viewer;

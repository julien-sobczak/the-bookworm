import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import './VisionSpan2.css';

/**
 * Drill implements the logic behind the Vision-Span drill.
 * Numerous properties are available to customize the drill format.
 */
class Drill {

    // Characters to use in drill
    CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    /**
     * Create a new drill.
     *
     * @param {number} lines the number of lines per series
     * @param {number} columns the number of columns per series
     * @param {number} series the number of series
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(lines, columns, series=1, onDrillFinished=undefined) {
        this.lines = lines;
        this.columns = columns;
        this.seriesCount = series;
        this.callbackDrillFinished = onDrillFinished;
        this.shuffle();
    }

    randomLetter() {
        return this.CHARACTERS.charAt(Math.floor(Math.random() * this.CHARACTERS.length))
    }

    /**
     * Shuffle generates a new drill content.
     *
     * The drill object has the following structure:
     *
     *    drill = {
     *       series: [
     *           lines: [
     *               columns: [
     *                   {
     *                       label: "A",
     *                       valid: true,
     *                   },
     *                   {
     *                       label: "A",
     *                       valid: null,
     *                   },
     *                   {
     *                       label: "A",
     *                       valid: null,
     *                   },
     *               ]
     *           ]
     *       ]
     *    }
     */
    shuffle() {
        const series = [];

        for (let i = 0; i < this.seriesCount; i++) {
            const serie = {
                lines: []
            };
            for (let j = 0; j < this.lines; j++) {
                const line = {
                    columns: []
                };
                for (let k = 0; k < this.columns; k++) {
                    line.columns.push({
                        label: this.randomLetter(),
                        valid: null,
                        center: (k === this.columns / 2),
                    })
                }
                serie.lines.push(line);
            }
            series.push(serie);
        }
        this.series = series;
        this.currentSerieIndex = 0;
        this.currentLineIndex = 0;
        this.errorCount = 0;
    }

    registerInput(input) {
        const currentSerie = this.series[this.currentSerieIndex];
        const currentLine = currentSerie.lines[this.currentLineIndex];
        let lineFinished = true;
        let error = true;
        let matchFound = false; // We want to match only one character, even the same character appears twice on the line
        for (let i = 0; i < currentLine.columns.length; i++) {
            const column = currentLine.columns[i];
            if (!column.valid && column.label === input.toUpperCase() && !matchFound) {
                column.valid = true;
                matchFound = true;
                error = false;
            } else if (column.valid !== true) { // Still (at least) a missing column
                lineFinished = false
            }
        }
        if (error) {
            this.errorCount++;
        }
        if (lineFinished) {
            if (this.currentLineIndex < currentSerie.lines.length - 1) {
                this.currentLineIndex++;
            } else if (this.currentSerieIndex < this.series.length - 1) {
                this.currentSerieIndex++;
            } else {
                this.callbackDrillFinished && this.callbackDrillFinished({
                    errorCount: this.errorCount,
                })
                this.shuffle();
            }
        }
    }

}

/**
 * Principal component to create the various Vision Span drills.
 */
class VisionSpanDrill extends React.Component {

    // Only these span values are supported (by proceed by 0.25 increment as encountered in the book Triple Your Reading Speed by Wade E. Cutler)
    SPANS = ['0in', '0.25in', '0.5in', '0.75in', '1in', '1.25in', '1.5in', '1.75in', '2in', '2.25in', '2.5in', '2.75in', '3in', '3.25in', '3.5in', '3.75in', '4in'];

    constructor(props) {
        super(props);

        this.state = {
            // As the drill is symmetrical, users only specify half the span values.
            // We reverse the value to determine the right span values.
            // This will make the code easier.
            spans: props.spans.concat([...props.spans].reverse()),

            // Input entered by the user when a keyboard is available
            selection: '',

            // The Drill content
            drill: undefined, // We create the drill lazily (after component mount)
                              // because we need to determine the available space on screen.

            // The current position inside the drill
            currentLine: 0,

            // The number of errors for the current drill
            errorCount: 0,
        };

        // create a ref to store the textInput DOM element
        this.textInput = React.createRef();
        this.drillArea = React.createRef();

        // This binding is necessary to make `this` work in the callback
        this.increaseSpan = this.increaseSpan.bind(this);
        this.reduceSpan = this.reduceSpan.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleDrillFinished = this.handleDrillFinished.bind(this);
        this.resume = this.resume.bind(this);
    }

    /** Increment the span values by one-stop to make the drill more difficult. */
    increaseSpan() {
        if (this.state.spans.includes(this.SPANS[this.SPANS.length-1])) return; // Maximum reached

        this.setState(state => ({
            ...state,
            spans: state.spans.map((s) => this.SPANS[this.SPANS.indexOf(s) + 1]),
        }));

        this.textInput.current.focus();
    }

    /** Decrement the span values by one-stop to make the drill easier */
    reduceSpan() {
        if (this.state.spans.includes(this.SPANS[0])) return; // Minimum reached

        this.setState(state => ({
            ...state,
            spans: state.spans.map((s) => this.SPANS[this.SPANS.indexOf(s) - 1]),
        }));

        this.textInput.current.focus();
    }

    /** Called on each key press by the user. */
    handleKeyPress = (event) => {
        let key = event.key;
        this.state.drill.registerInput(key);
        this.setState(state => ({
            ...state,
            drill: state.drill,
        }));

        this.textInput.current.value = '';
    }

    /** Called when the user successfully finish one drill. */
    handleDrillFinished = (event) => {
        // Check to adjust the level
        if (this.props.autoLevel) {
            if (event.errorCount < 2) {
                this.increaseSpan();
            } else if (event.errorCount > 4) {
                this.reduceSpan();
            }
        }
    }

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

        const spanLeft = (index < 1) ? '0in' : this.state.spans[index - 1];
        const spanRight = (index > this.state.spans.length - 1) ? '0in' : this.state.spans[index];

        return "SpanLeft" + spanLeft.replace('.', '_') + ' SpanRight' + spanRight.replace('.', '_'); // . is forbidden in CSS class names
    }

    render() {
        return (
            <div>
                <div className="Drill VisionSpanDrill">

                    <Link to="/vision-span/" className="closeBtn"><i className="material-icons">close</i></Link>

                    <section className="GameControls">
                        <ul>
                            <li><button onClick={this.resume}><i className="material-icons">pause</i></button></li>
                            {this.props.spanControls && <li><button onClick={this.increaseSpan}><i className="material-icons">chevron_left</i></button></li>}
                            {this.props.spanControls && <li><button onClick={this.reduceSpan}><i className="material-icons">chevron_right</i></button></li>}
                        </ul>
                    </section>


                    <section className={"DrillArea " + this.cssStyle()} ref={this.drillArea}>

                        <input ref={this.textInput} className="OutOfScreen" type="text" onKeyPress={this.handleKeyPress} />

                        {this.state.drill && this.state.drill.series.map((serie, index) => {
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

                        {this.state.selection.length > 0 && <div className="input-center"> {this.state.selection}</div>}

                    </section>
                </div>
            </div>
        );
    }

    calculateSeriesCount() {
        if (this.props.multiple) {
            // Calculate the multiple value according the screen height
            const height = this.drillArea.current.clientHeight; // The available height
            const fontSize = parseFloat(getComputedStyle(this.drillArea.current).fontSize); // The size in pixel of a character
            const heightSerie = 1.5 * fontSize * this.props.lines + 1 * fontSize; // The height of series (lines + margin)
            const buffer = 50; // Avoid being too narrow at the top and bottom
            return parseInt((height - buffer) / heightSerie);
        } else {
            return 1;
        }
    }

    componentDidMount() {
        // Now that we can determine the available space on screen,
        // We can generate the drill.
        const seriesCount = this.calculateSeriesCount();
        this.setState(state => ({
            ...state,
            drill: new Drill(this.props.lines, this.props.columns, seriesCount, this.handleDrillFinished), // the drill content
        }));

        this.textInput.current.focus();
    }

    componentDidUpdate() {
        if (this.state.selection !== '') {
            setTimeout(() => this.setState(state => ({
                ...state,
                selection: '',
            })), 200);
        }

        this.textInput.current.focus();
    }

    resume() {
        this.textInput.current.focus();
    }

}

VisionSpanDrill.defaultProps = {
    // One serie or as much as screen allows
    multiple: PropTypes.bool,
    // How many lines per series?
    lines: PropTypes.number,
    // How many columns?
    columns: PropTypes.number.isRequired,
    // Negative space between two adjacent columns (should contains columns.length - 1 values)
    spans: PropTypes.arrayOf(PropTypes.string).isRequired,
    // Displays controls to vary the span between columns
    spanControls: PropTypes.bool,
    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,
};

VisionSpanDrill.defaultProps = {
    // Drill options
    lines: 1,
    multiple: false,
    spanControls: false,
    autoLevel: false,

    // Styling options
    fontFamily: 'Roboto',
    fontSize: '12pt',
    fontStyle: 'normal',
    backgroundColor: 'white',
    color: 'black',
};

export default VisionSpanDrill;

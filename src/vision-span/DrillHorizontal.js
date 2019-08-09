import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Configurator from './Configurator';
import Styled from '../toolbox/Styled';
import * as helpers from '../toolbox/EngineHelpers';

/**
 * Logic behind the Vision-Span horizontal drill.
 */
class Engine {

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
                        label: helpers.randomLetter(),
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

    getDrill() {
        return this.series;
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
                this.currentLineIndex = 0;
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
 * Only responsible to display a DrillLogic.
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
        <Styled className="VisionSpanHorizontalViewer" {...props}>
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


/**
 * Principal component to create the various Vision Span drills.
 */
class DrillHorizontal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // As the drill is symmetrical, users only specify half the span values.
            // We reverse the value to determine the right span values.
            // This will make the code easier.
            spans: props.spans.concat([...props.spans].reverse()),

            // Input entered by the user when a keyboard is available
            selection: '',

            // The engine
            engine: undefined,

            // The Drill content
            drill: undefined, // We create the drill lazily (after component mount)
                              // because we need to determine the available space on screen.

            // The current position inside the drill
            currentLine: 0,

            // The number of errors for the current drill
            errorCount: 0,

            // Copy styling settings as state to update during a drill session
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.fontStyle,
            backgroundColor: props.backgroundColor,
            color: props.color,
        };

        // create a ref to store the textInput DOM element
        this.textInput = React.createRef();
        this.drillArea = React.createRef();

        // This binding is necessary to make `this` work in the callback
        this.increaseSpan = this.increaseSpan.bind(this);
        this.reduceSpan = this.reduceSpan.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleDrillFinished = this.handleDrillFinished.bind(this);
        this.handleStyleChanged = this.handleStyleChanged.bind(this);
        this.resume = this.resume.bind(this);
    }

    /** Increment the span values by one-stop to make the drill more difficult. */
    increaseSpan() {
        if (helpers.isMaxSpan(this.state.spans)) return;

        this.setState(state => ({
            ...state,
            spans: helpers.increaseSpan(state.spans),
        }));

        this.resume();
    }

    /** Decrement the span values by one-stop to make the drill easier */
    reduceSpan() {
        if (helpers.isMinSpan(this.state.spans)) return;

        this.setState(state => ({
            ...state,
            spans: helpers.reduceSpan(state.spans),
        }));

        this.resume();
    }

    /** Called on each key press by the user. */
    handleKeyPress = (event) => {
        const key = event.key;

        const engine = this.state.engine;
        engine.registerInput(key);
        const drill = engine.getDrill();

        this.setState(state => ({
            ...state,
            drill: drill,
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

        this.setState(state => ({
            ...state,
            drill: state.engine.getDrill(),
        }));
    }

    /** Called when the user update the settings. */
    handleStyleChanged = (event) => {
        const newFontFamily = event.fontFamily;
        const newFontSize = event.fontSize;
        const newFontStyle = event.fontStyle;
        const newBackgroundColor = event.backgroundColor;
        const newColor = event.color;
        this.setState(state => ({
            ...state,
            fontFamily: newFontFamily,
            fontSize: newFontSize,
            fontStyle: newFontStyle,
            backgroundColor: newBackgroundColor,
            color: newColor,
        }));
    }

    render() {
        return (
            <div>
                <div className="FullScreen VisionSpanDrill" style={{backgroundColor: this.state.backgroundColor, color: this.state.color}}>

                    <section className="DrillControls">
                        <ul>
                            <li><button onClick={this.resume}><i className="material-icons">pause</i></button></li>
                            {this.props.spanControls && <li><button onClick={this.reduceSpan}><i className="material-icons">chevron_left</i></button></li>}
                            {this.props.spanControls && <li><button onClick={this.increaseSpan}><i className="material-icons">chevron_right</i></button></li>}
                            <li><Link to="/vision-span/" className="ButtonClose"><i className="material-icons">close</i></Link></li>
                        </ul>
                    </section>

                    <section className="DrillArea"
                             ref={this.drillArea}
                             style={{fontSize: this.state.fontSize}}
                    >
                    {/* Important to fix the font size to determine the number of available lines */}

                        <input ref={this.textInput} className="OutOfScreen" type="text" onKeyPress={this.handleKeyPress} />

                        <Viewer
                                drill={this.state.drill}
                                spans={this.state.spans}
                                fontFamily={this.state.fontFamily}
                                fontSize={this.state.fontSize}
                                fontStyle={this.state.fontStyle}
                                backgroundColor={this.state.backgroundColor}
                                color={this.state.color} />

                    </section>

                    <Configurator
                                fontFamily={this.state.fontFamily}
                                fontSize={this.state.fontSize}
                                fontStyle={this.state.fontStyle}
                                backgroundColor={this.state.backgroundColor}
                                color={this.state.color} onChange={this.handleStyleChanged}/>

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
        const engine = new Engine(this.props.lines, this.props.columns, seriesCount, this.handleDrillFinished)
        this.setState(state => ({
            ...state,
            engine: engine,
            drill: engine.getDrill(), // the drill content
        }));

        this.resume();
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

DrillHorizontal.propTypes = {
    ...Viewer.propTypes,

    // One serie or as much as screen allows
    multiple: PropTypes.bool,
    // How many lines per series?
    lines: PropTypes.number,
    // How many columns?
    columns: PropTypes.number.isRequired,
    // Negative space between two adjacent columns (should contains columns.length - 1 values)
    spans: PropTypes.arrayOf(PropTypes.string),
    // Displays controls to vary the span between columns
    spanControls: PropTypes.bool,
    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,
};

DrillHorizontal.defaultProps = {
    ...Viewer.defaultProps,

    // Drill options
    lines: 1,
    multiple: false,
    spanControls: false,
    autoLevel: false,
};

export { DrillHorizontal as default, Viewer, Engine };
import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Styled from '../toolbox/Styled';
import * as helpers from '../toolbox/EngineHelpers';
import Configurator from './Configurator';

class Engine {

    /**
     * Create a new drill.
     *
     * @param {number} lines the number of lines
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(lines, onDrillFinished=undefined) {
        this.lines = lines;
        this.callbackDrillFinished = onDrillFinished;  
        this.shuffle();
    }

    /**
     * Shuffle generates a new drill content.
     *
     * The drill object has the following structure:
     *
     *    drill = {
     *       lines: [
     *           columns: [
     *               {
     *                   label: "A",
     *                   valid: true,
     *               },
     *               {
     *                   label: "A",
     *                   valid: null,
     *               },
     *               {
     *                   label: "A",
     *                   valid: null,
     *               },
     *           ]
     *       ]
     *    }
     */
    shuffle() {
        const drill = {
            lines: [],
        };

        for (let i = 0; i < this.lines; i++) {
            drill.lines.push({
                columns: [
                    {
                        label: helpers.randomLetter(),
                        valid: null,
                    },
                    {
                        label: helpers.CHARACTERS[i % helpers.CHARACTERS.length], // Cycle over the alphabet for the middle column
                        valid: null,
                    },
                    {
                        label: helpers.randomLetter(),
                        valid: null,
                    },
                ]
            })
        }
        this.drill = drill;
        this.currentLineIndex = 0;
        this.errorCount = 0;
    }

    getDrill() {
        return this.drill;
    }

    registerInput(input) {
        let finished = true;
        let error = true;
        let matchFound = false; // We want to match only one character, even the same character appears twice on the line

        const currentLine = this.drill.lines[this.currentLineIndex];
        for (let i = 0; i < 3; i++) {
            const element = currentLine.columns[i];
            if (!element.valid && element.label === input.toUpperCase() && !matchFound) {
                element.valid = true;
                matchFound = true;
                error = false;
            } else if (element.valid !== true) { // Still (at least) a missing column
                finished = false
            }
        }
        if (error) {
            this.errorCount++;
        }
        if (finished) {
            if (this.currentLineIndex < this.drill.lines.length - 1) {
                this.currentLineIndex++;
            } else {
                this.callbackDrillFinished && this.callbackDrillFinished({
                    errorCount: this.errorCount,
                })
                this.shuffle();
            }
        }
    }

}

function Viewer(props) {
    // How it works?
    // We start at span=0.25in
    // We end at span=props.span (e.g. 2in)
    // We have n lines
    // We have a list of increment possible for the span (e.g., 0.25in, 0.5in, 0.75in, 1in, 1.25in, ...)
    // We should increment progressively the span to reach the final span.

    if (!props.drill) return <span></span>;

    /** Evaluate the CSS classes from the drill options. */
    const cssSpan = function(span) {
        return "SpanLeft" + span.replace('.', '_') + ' SpanRight' + span.replace('.', '_');
    }

    let startSpanIndex = 0;
    let endSpanIndex = helpers.SPANS.indexOf(props.span);
    let linesPerSpan = Math.floor(props.lines / (endSpanIndex - startSpanIndex));

    let currentSpanIndex = -1;
    let currentSpan = undefined;
    let countLinesInSpan = 0;

    return (
        <Styled className="VisionSpanHorizontalViewer" {...props}>
            {props.drill && props.drill.lines.map((line, index) => {
                if (!currentSpan || countLinesInSpan === linesPerSpan) {
                    currentSpanIndex++;
                    currentSpan = helpers.SPANS[currentSpanIndex];
                    countLinesInSpan = 1;
                } else {
                    countLinesInSpan++;
                }

                return (
                    <div className="Line" key={index}>
                        {line.columns.map((col, index) => {
                            return <span key={index} className={"Cell " + cssSpan(currentSpan) + " " + (col.valid === true ? 'valid' : '')}>{col.label}</span>
                        })}
                    </div>
                )
            })}
        </Styled>
    );
}

/**
 * Principal component to create the various Vision Span drills.
 */
class DrillPyramid extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Input entered by the user when a keyboard is available
            selection: '',

            // The maximum span for the bottom of the pyramid
            span: props.span,

            // The effective number of lines
            lines: undefined,

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
        if (helpers.isMaxSpan(this.state.span)) return;

        this.setState(state => ({
            ...state,
            span: helpers.increaseSpan(state.span),
        }));

        this.resume();
    }

    /** Decrement the span values by one-stop to make the drill easier */
    reduceSpan() {
        if (helpers.isMinSpan(this.state.span)) return;

        this.setState(state => ({
            ...state,
            span: helpers.reduceSpan(state.span),
        }));

        this.resume();
    }

    /** Called on each key press by the user. */
    handleKeyPress = (event) => {
        let key = event.key;
        const engine = this.state.engine;
        engine.registerInput(key);
        this.setState(state => ({
            ...state,
            drill: engine.getDrill(),
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
                                span={this.state.span}
                                lines={this.state.lines}
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

    calculateLinesCount() {
        // Calculate the multiple value according the screen height
        const areaHeight = this.drillArea.current.clientHeight; // The available height
        const fontSize = parseFloat(getComputedStyle(this.drillArea.current).fontSize); // The size in pixel of a character
        const lineHeight = 2 * fontSize; // The height of series (lines + margin)
        const maxLines = Math.floor(areaHeight / lineHeight - 1); // Remove one line to be sure

        if (this.props.lines === undefined) {
            return maxLines;
        } else {
            return Math.min(this.props.lines, maxLines);
        }
    }

    componentDidMount() {
        // Now that we can determine the available space on screen,
        // We can generate the drill.
        const lines = this.calculateLinesCount();
        const engine = new Engine(lines, this.handleDrillFinished);
        this.setState(state => ({
            ...state,
            lines: lines,
            engine: engine,
            drill: engine.getDrill(),
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

        this.resume();
    }

    resume() {
        this.textInput.current.focus();
    }

}

DrillPyramid.propTypes = {
    ...Viewer.propTypes,

    // How many lines
    lines: PropTypes.number,

    // Negative space between with the center column for the bottom values
    span: PropTypes.string,
    // Displays controls to vary the span between columns
    spanControls: PropTypes.bool,
    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,
};

DrillPyramid.defaultProps = {
    ...Viewer.defaultProps,

    lines: undefined,

    // Drill options
    spanControls: false,
    autoLevel: false,
};

export default DrillPyramid;

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
     * @param {number} size the size of the table (number of lines/columns)
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(size=3, onDrillFinished=undefined) {
        this.size = size;
        this.callbackDrillFinished = onDrillFinished;
        this.shuffle();
    }

    /**
     * Shuffle generates a new drill content.
     *
     * The drill object has the following structure:
     *
     *    drill = {
     *        lines: [
     *            columns: [
     *                {
     *                    label: "A",
     *                    valid: true,
     *                },
     *                {
     *                    label: "A",
     *                    valid: null,
     *                },
     *                {
     *                    label: "A",
     *                    valid: null,
     *                },
     *            ]
     *        ]
     *    }
     */
    shuffle() {
        const drill = { lines: [] };
        for (let i = 0; i < this.size; i++) {
            const line = { columns: [] };
            for (let j = 0; j < this.size; j++) {
                const column = {
                    label: helpers.randomLetter(),
                    valid: null,
                }
                line.columns.push(column);
            }
            drill.lines.push(line);
        }
        this.drill = drill;
        this.currentCircle = 0;
        this.errorCount = 0;
    }

    getDrill() {
        return this.drill;
    }

    registerInput(input) {
        let circleFinished = true;
        let error = true;
        let matchFound = false; // We want to match only one character, even the same character appears twice on the line

        // Ex: (5-5 Schulte Table)
        // A F G V J
        // H G K U A
        // A P Q K Q
        // A J H E V
        // N M L Z Q
        // First iteration: Q (center)
        // Second iteration: G K U K E H J P (inner perimeter)
        // Third iteration: A F G V J A Q V Q Z L M N A A H (outer perimenter)

        let squares = [];
        const center = Math.floor(this.size / 2);
        if (this.currentCircle === 0) {
            // Only the center square
            squares.push([center, center]);
        } else {
            // A perimeter
            const xLeft = center - this.currentCircle;
            const xRight = center + this.currentCircle;
            const yTop = center - this.currentCircle;
            const yBottom = center + this.currentCircle;
            for (let i = xLeft; i <= xRight; i++) {
                squares.push([i, yTop]);
                squares.push([i, yBottom]);
            }
            for (let i = yTop + 1; i < yBottom; i++) {
                squares.push([xLeft, i]);
                squares.push([xRight, i]);
            }
        }

        for (let i = 0; i < squares.length; i++) {
            const [x, y] = squares[i];
            const element = this.drill.lines[x].columns[y];
            if (!element.valid && element.label === input.toUpperCase() && !matchFound) {
                element.valid = true;
                matchFound = true;
                error = false;
            } else if (element.valid !== true) { // Still (at least) a missing column
                circleFinished = false
            }
        }

        if (error) {
            this.errorCount++;
        }

        if (circleFinished) {
            const iterationCount = Math.floor(this.size / 2);
            if (this.currentCircle < iterationCount) {
                this.currentCircle++;
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

    if (!props.drill) return <span></span>;

    const cssCell = 'Width' + props.span.replace('.', '_');

    return (
        <Styled className="VisionSpanHorizontalViewer" {...props}>
            <table className="SchulteTable">
                <tbody>
                    {props.drill && props.drill.lines.map((line, index) => {
                        return (
                            <tr className="Line" key={index}>
                                {line.columns.map((col, index) => {
                                    return <td key={index} className={"Cell " + cssCell + " " + (col.valid === true ? 'valid' : '')}>{col.label}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Styled>
    );
}

/**
 * Principal component to create the various Vision Span drills.
 */
class DrillSchulte extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // The table size
            size: props.size,

            // The cell size
            span: props.span,

            // Input entered by the user when a keyboard is available
            selection: '',

            // The engine
            engine: undefined,

            // The Drill content
            drill: undefined, // We create the drill lazily (after component mount)
                              // because we need to determine the available space on screen.

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
                                size={this.state.size}
                                span={this.state.span}
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
        const engine = new Engine(this.state.size, this.handleDrillFinished);
        this.setState(state => ({
            ...state,
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

        this.textInput.current.focus();
    }

    resume() {
        this.textInput.current.focus();
    }

}

DrillSchulte.propTypes = {
    ...Viewer.propTypes,

    // How many lines/columns in the table?
    size: PropTypes.number,
    // Cell size
    span: PropTypes.string.isRequired,
    // Displays controls to vary the span between columns
    spanControls: PropTypes.bool,
    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,
};

DrillSchulte.defaultProps = {
    ...Viewer.defaultProps,

    // Drill options
    size: 5,
    spanControls: true,
    autoLevel: false,
};

export default DrillSchulte;

import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Engine from './Engine';
import Viewer from './Viewer';
import Configurator from './Configurator';

import './VisionSpan.css';

/**
 * Principal component to create the various Vision Span drills.
 */
class Drill extends React.Component {

    static propTypes = {
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

    static defaultProps = {
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
                <div className="Drill VisionSpanDrill">

                    <section className="DrillControls">
                        <ul>
                            <li><button onClick={this.resume}><i className="material-icons">pause</i></button></li>
                            {this.props.spanControls && <li><button onClick={this.increaseSpan}><i className="material-icons">chevron_left</i></button></li>}
                            {this.props.spanControls && <li><button onClick={this.reduceSpan}><i className="material-icons">chevron_right</i></button></li>}
                            <li><Link to="/vision-span/" className="closeBtn"><i className="material-icons">close</i></Link></li>
                        </ul>
                    </section>

                    <section className="DrillArea"
                             ref={this.drillArea}
                             style={{fontSize: this.props.fontSize}}
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
        this.setState(state => ({
            ...state,
            drill: new Engine(this.props.lines, this.props.columns, seriesCount, this.handleDrillFinished), // the drill content
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

export default Drill;

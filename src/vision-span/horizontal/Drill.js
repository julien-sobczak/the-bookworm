import React from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer'
import Engine from './Engine'
import * as helpers from '../../toolbox/EngineHelpers';

class Drill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            spans: props.spans,

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
        this.stopDrill = this.stopDrill.bind(this);
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

    stopDrill() {
        this.props.onComplete(this.state.engine.getStats());
    }

    render() {
        return (
            <div className="Drill FullScreen Centered" style={{backgroundColor: this.props.backgroundColor, color: this.props.color}}>

                <section className="DrillControls">
                    <ul>
                        <li><button onClick={this.resume}><i className="material-icons">pause</i></button></li>
                        {this.props.spanControls && <li><button onClick={this.reduceSpan}><i className="material-icons">chevron_left</i></button></li>}
                        {this.props.spanControls && <li><button onClick={this.increaseSpan}><i className="material-icons">chevron_right</i></button></li>}
                        <li><button onClick={this.stopDrill}><i className="material-icons">stop</i></button></li>
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
                        fontFamily={this.props.fontFamily}
                        fontSize={this.props.fontSize}
                        fontStyle={this.props.fontStyle}
                        backgroundColor={this.props.backgroundColor}
                        color={this.props.color} />

                </section>
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

Drill.propTypes = {
    ...Viewer.propTypes,

    // One serie or as much as screen allows
    multiple: PropTypes.bool,
    // How many lines per series?
    lines: PropTypes.number,
    // How many columns?
    columns: PropTypes.number,
    // Negative space between two adjacent columns (should contains columns.length - 1 values)
    spans: PropTypes.arrayOf(PropTypes.string),
    // Displays controls to vary the span between columns
    spanControls: PropTypes.bool,
    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,

    // Callback when the user finishes the drill
    onComplete: PropTypes.func,
};

Drill.defaultProps = {
    ...Viewer.defaultProps,

    // Drill options
    lines: 1,
    columns: 3,
    spans: ["0.5in", "0.5in"],
    multiple: false,
    spanControls: false,
    autoLevel: false,

    onComplete: function() {},
};

export default Drill;
import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Styled from '../toolbox/Styled';
import * as helpers from '../toolbox/EngineHelpers';
import Configurator from './Configurator';

class Engine {

    POSITIONS = ["center", "top", "topRight", "right", "bottomRight", "bottom", "bottomLeft", "left", "topLeft"];
    /**
     * Create a new drill.
     *
     * @param {function} onDrillFinished callback when a drill is finished
     */
    constructor(onDrillFinished=undefined) {
        this.callbackDrillFinished = onDrillFinished;
        this.shuffle();
    }

    /**
     * Shuffle generates a new drill content.
     *
     * The drill object has the following structure:
     *
     *    drill = {
     *       top: {
     *           label: "A",
     *           valid: true,
     *       },
     *       topRight: {
     *           label: "A",
     *           valid: null,
     *       },
     *       ... // right, bottomRight, bottom, bottomLeft, left, topLeft + center
     *    }
     */
    shuffle() {
        const drill = {};
        this.POSITIONS.forEach((p) => {
            drill[p] = {
                label: helpers.randomLetter(),
                valid: null,
            }
        });
        this.drill = drill;
        this.errorCount = 0;
    }

    getDrill() {
        return this.drill;
    }

    registerInput(input) {
        let circleFinished = true;
        let error = true;
        let matchFound = false; // We want to match only one character, even the same character appears twice on the line

        this.POSITIONS.forEach((p) => {
            const element = this.drill[p];
            if (!element.valid && element.label === input.toUpperCase() && !matchFound) {
                element.valid = true;
                matchFound = true;
                error = false;
            } else if (element.valid !== true) { // Still (at least) a missing column
                circleFinished = false
            }
        });
        if (error) {
            this.errorCount++;
        }
        if (circleFinished) {
            this.callbackDrillFinished && this.callbackDrillFinished({
                errorCount: this.errorCount,
            })
            this.shuffle();
        }
    }
}

function Viewer(props) {
    // https://www.youtube.com/watch?v=aHaFwnqH5CU
    // Angle in radians = Angle in degrees x PI / 180.
    const angleDegree = 45;
    const angleRadian = angleDegree * Math.PI / 180;
    // x = radius * cosinus angle
    // y = radius * sinus angle
    const x = parseFloat(props.span) * Math.cos(angleRadian);
    const y = parseFloat(props.span) * Math.sin(angleRadian);
    return (
        <Styled className="Viewer VisionSpanCircleViewer" {...props}>
            {props.drill &&
                <div style={{height: "100%"}}>
                    <span className={"Cell " + (props.drill.center.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `50%` }}>
                        {props.drill.center.label}
                    </span>
                    <span className={"Cell " + (props.drill.top.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `calc(50% - ${props.span})` }}>
                        {props.drill.top.label}
                    </span>
                    <span className={"Cell " + (props.drill.topRight.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${x}in)`, top: `calc(50% - ${y}in)` }}>
                        {props.drill.topRight.label}
                    </span>
                    <span className={"Cell " + (props.drill.right.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${props.span})`, top: `50%` }}>
                        {props.drill.right.label}
                    </span>
                    <span className={"Cell " + (props.drill.bottomRight.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${x}in)`, top: `calc(50% + ${y}in)` }}>
                        {props.drill.bottomRight.label}
                    </span>
                    <span className={"Cell " + (props.drill.bottom.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `calc(50% + ${props.span})` }}>
                        {props.drill.bottom.label}
                    </span>
                    <span className={"Cell " + (props.drill.bottomLeft.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${x}in)`, top: `calc(50% + ${y}in)` }}>
                        {props.drill.bottomLeft.label}
                    </span>
                    <span className={"Cell " + (props.drill.left.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${props.span})`, top: `50%` }}>
                        {props.drill.left.label}
                    </span>
                    <span className={"Cell " + (props.drill.topLeft.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${x}in)`, top: `calc(50% - ${y}in)` }}>
                        {props.drill.topLeft.label}
                    </span>
                </div>
            }
        </Styled>
    );
}

/**
 * Principal component to create the various Vision Span drills.
 */
class DrillCircle extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // As the drill is symmetrical, users only specify half the span values.
            // We reverse the value to determine the right span values.
            // This will make the code easier.
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
        this.state.engine.registerInput(key);
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

    componentDidMount() {
        const engine = new Engine(this.handleDrillFinished);
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

DrillCircle.propTypes = {
    ...Viewer.propTypes,

    // Space with the center
    span: PropTypes.string.isRequired,
    // Displays controls to vary the span between columns
    spanControls: PropTypes.bool,
    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,
};

DrillCircle.defaultProps = {
    ...Viewer.defaultProps,

    // Drill options
    spanControls: true,
    autoLevel: false,
};

export { DrillCircle as default, Viewer, Engine };

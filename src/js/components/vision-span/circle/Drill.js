import React from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import Engine from './Engine';
import * as helpers from '../../../functions/engine';

class Drill extends React.Component {

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

    stopDrill() {
        this.props.onComplete(this.state.engine.getStats());
    }

    render() {
        return (
            <div>
                <div className="Drill FullScreen Centered" style={{backgroundColor: this.state.backgroundColor, color: this.state.color}}>

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
                                span={this.state.span}
                                fontFamily={this.props.fontFamily}
                                fontSize={this.props.fontSize}
                                fontStyle={this.props.fontStyle}
                                backgroundColor={this.props.backgroundColor}
                                color={this.props.color} />

                    </section>

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

Drill.propTypes = {
    ...Viewer.propTypes,

    // Callback when the user finishes the drill
    onComplete: PropTypes.func,
};

Drill.defaultProps = {
    ...Viewer.defaultProps,
    onComplete: function() {},
};

export default Drill;

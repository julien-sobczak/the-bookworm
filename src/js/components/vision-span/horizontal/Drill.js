import React from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import Engine from './Engine';

import * as interaction from '../../../functions/interaction';
import * as string from '../../../functions/string';
import * as helpers from '../../../functions/engine';

class Drill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            spans: props.spans,

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

        this.drillArea = React.createRef();

        this.increaseSpan = this.increaseSpan.bind(this);
        this.reduceSpan = this.reduceSpan.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDrillFinished = this.handleDrillFinished.bind(this);
        this.stopDrill = this.stopDrill.bind(this);
    }

    /** Increment the span values by one-stop to make the drill more difficult. */
    increaseSpan() {
        if (helpers.isMaxSpan(this.state.spans)) return;

        this.setState(state => ({
            ...state,
            spans: helpers.increaseSpan(state.spans),
        }));
    }

    /** Decrement the span values by one-stop to make the drill easier */
    reduceSpan() {
        if (helpers.isMinSpan(this.state.spans)) return;

        this.setState(state => ({
            ...state,
            spans: helpers.reduceSpan(state.spans),
        }));
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

        this.newDrill();
    }

    newDrill() {
        this.setState(state => ({
            ...state,
            drill: state.engine.newDrill(),
        }));
    }

    stopDrill() {
        const result = {
            stopped: true,
            stats: this.state.engine.getStats(),
        };
        this.props.onComplete(result);
    }

    render() {
        return (
            <div className={"Drill FullScreen Centered Theme" + string.capitalize(this.props.theme)} onClick={this.handleClick}>

                <section className="DrillControls">
                    <ul>
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

                    <Viewer
                        drill={this.state.drill}
                        spans={this.state.spans}
                        fontFamily={this.props.fontFamily}
                        fontSize={this.props.fontSize}
                        fontStyle={this.props.fontStyle}
                        theme={this.props.theme} />

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

    registerInput(event) {
        const engine = this.state.engine;
        engine.registerInput(event.key);
        const drill = engine.getDrill();
    
        this.setState(state => ({
            ...state,
            drill: drill,
        }));
    }

    handleKeyUp(event) {
        if (this.props.keyboard) {
            // Disable other keys when user should enter the letters.
            if (interaction.isCharacterKey(event)) { // Only register letters
                this.registerInput(event);
            }
            return;
        }
        switch (event.keyCode) {
            case interaction.KEY_RIGHT:
                this.newDrill();
                return;
            case interaction.KEY_DOWN:
                this.reduceSpan();
                return;
            case interaction.KEY_UP:
                this.increaseSpan();
                return;
            default:
                // Do nothing
                return;
        }
    }

    handleClick(event) {
        if (this.props.keyboard) {
            // Ignore clicks and only advance when the user has entered all letters.
            return;
        }
        switch (interaction.getScreenZone(event)) {
            case interaction.ZONE_RIGHT:
                this.newDrill();
                return;
            case interaction.ZONE_BOTTOM:
                this.reduceSpan();
                return;
            case interaction.ZONE_TOP:
                this.increaseSpan();
                return;
            default: 
                // Do nothing
                return;
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

        window.addEventListener("keyup", this.handleKeyUp);
    }
    
    componentWillUnmount() {
        window.removeEventListener("keyup", this.handleKeyUp);
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
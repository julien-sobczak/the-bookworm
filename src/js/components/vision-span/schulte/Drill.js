import React from 'react';
import PropTypes from 'prop-types';

import Engine from './Engine';
import Viewer from './Viewer';

import * as interaction from '../../../functions/interaction';
import * as string from '../../../functions/string';
import * as helpers from '../../../functions/engine';


class Drill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // The table size
            size: props.size,

            // The cell size
            span: props.span,

            // The engine
            engine: undefined,

            // The Drill content
            drill: undefined, // We create the drill lazily (after component mount)
                              // because we need to determine the available space on screen.

            // The number of errors for the current drill
            errorCount: 0,
        };

        this.drillArea = React.createRef();

        // This binding is necessary to make `this` work in the callback
        this.increaseSpan = this.increaseSpan.bind(this);
        this.reduceSpan = this.reduceSpan.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDrillFinished = this.handleDrillFinished.bind(this);
        this.stopDrill = this.stopDrill.bind(this);
    }

    /** Increment the span values by one-stop to make the drill more difficult. */
    increaseSpan() {
        if (helpers.isMaxSpan(this.state.span)) return;

        this.setState(state => ({
            ...state,
            span: helpers.increaseSpan(state.span),
        }));
    }

    /** Decrement the span values by one-stop to make the drill easier */
    reduceSpan() {
        if (helpers.isMinSpan(this.state.span)) return;

        this.setState(state => ({
            ...state,
            span: helpers.reduceSpan(state.span),
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
        this.props.onComplete({
            stopped: true,
            stats: this.state.engine.getStats(),
        });
    }

    render() {
        return (
            <div>
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
                                size={this.state.size}
                                span={this.state.span}
                                fontFamily={this.props.fontFamily}
                                fontSize={this.props.fontSize}
                                fontStyle={this.props.fontStyle}
                                theme={this.props.theme} />

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

    registerInput(event) {
        const engine = this.state.engine;
        engine.registerInput(event.key);
        this.setState(state => ({
            ...state,
            drill: engine.getDrill(),
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
        const engine = new Engine(this.state.size, this.handleDrillFinished);
        this.setState(state => ({
            ...state,
            engine: engine,
            drill: engine.getDrill(),
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
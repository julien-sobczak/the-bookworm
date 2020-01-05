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
            // As the drill is symmetrical, users only specify half the span values.
            // We reverse the value to determine the right span values.
            // This will make the code easier.
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
        this.updateSpan(helpers.increaseSpan(this.state.span));
    }

    /** Decrement the span values by one-stop to make the drill easier */
    reduceSpan() {
        if (helpers.isMinSpan(this.state.span)) return;
        this.updateSpan(helpers.reduceSpan(this.state.span));
    }

    updateSpan(span) {
        this.props.onLevelChange({
            span: span,
        });

        this.setState(state => ({
            ...state,
            span: span,
        }));
    }

    /** Called when the user successfully finish one drill. */
    handleDrillFinished(event) {
        // Check to adjust the level
        if (this.props.autoLevel) {
            if (event.errorCount === 0) {
                this.increaseSpan();
            } else if (event.errorCount > 4) {
                this.reduceSpan();
            }
        }
        this.newDrill();
    }

    newDrill() {
        const newDrill = this.state.engine.newDrill();
        this.setState(state => ({
            ...state,
            drill: newDrill,
        }), () => {
            this.props.onNewDrill(this.state.drill);
        });
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
                            {this.props.spanControls && <li><button onClick={this.reduceSpan}><i title="Reduce span" className="material-icons">chevron_left</i></button></li>}
                            {this.props.spanControls && <li><button onClick={this.increaseSpan}><i title="Increase span" className="material-icons">chevron_right</i></button></li>}
                            <li><button onClick={this.stopDrill}><i title="Stop" className="material-icons">stop</i></button></li>
                        </ul>
                    </section>

                    <section className="DrillArea"
                        ref={this.drillArea}
                        style={{fontSize: this.state.fontSize}}
                    >
                        {/* Important to fix the font size to determine the number of available lines */}

                        <Viewer
                            drill={this.state.drill}
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

    registerInput(event) {
        this.state.engine.registerInput(event.key);
        this.setState(state => ({
            ...state,
            drill: state.drill,
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
        const engine = new Engine(this.handleDrillFinished);
        this.setState(state => ({
            ...state,
            engine: engine,
            drill: engine.getDrill(),
        }), () => {
            this.props.onNewDrill(this.state.drill);
        });

        window.addEventListener("keyup", this.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener("keyup", this.handleKeyUp);
    }

}

Drill.propTypes = {
    ...Viewer.propTypes,

    // Callback when a new drill is generated (for testing purposes)
    onNewDrill: PropTypes.func,
    // Callback when the current level is updated
    onLevelChange: PropTypes.func,
    // Callback when the user finishes the drill
    onComplete: PropTypes.func,
};

Drill.defaultProps = {
    ...Viewer.defaultProps,

    onNewDrill: () => {},
    onLevelChange: () => {},
    onComplete: () => {},
};

export default Drill;

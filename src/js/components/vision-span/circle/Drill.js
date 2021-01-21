import React from 'react';
import PropTypes from 'prop-types';

import ReduceIcon from '@material-ui/icons/Remove';
import IncreaseIcon from '@material-ui/icons/Add';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import Viewer from './Viewer';
import Engine from './Engine';
import { DrillScreen, DrillControlGroup, DrillArea } from '../../core/UI';
import PauseOverlay from '../../toolbox/PauseOverlay';

import * as interaction from '../../../functions/interaction';
import * as string from '../../../functions/string';
import * as engine from '../../../functions/engine';

/**
 * Main component for the drill.
 */
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
            paused: false,

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

        // State
        this.pauseDrill = this.pauseDrill.bind(this);
        this.resumeDrill = this.resumeDrill.bind(this);
        this.stopDrill = this.stopDrill.bind(this);
    }

    /** Increment the span values by one-stop to make the drill more difficult. */
    increaseSpan() {
        if (engine.isMaxSpan(this.state.span)) return;
        this.updateSpan(engine.increaseSpan(this.state.span));
    }

    /** Decrement the span values by one-stop to make the drill easier */
    reduceSpan() {
        if (engine.isMinSpan(this.state.span)) return;
        this.updateSpan(engine.reduceSpan(this.state.span));
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

    pauseDrill() {
        this.setState({
            paused: true,
        });
        this.state.engine.pause();
    }

    resumeDrill() {
        this.setState({
            paused: false,
        });
        this.state.engine.resume();
    }

    stopDrill() {
        this.state.engine.stop();
        const result = {
            stopped: true,
            stats: this.state.engine.getStats(),
        };
        this.props.onComplete(result);
    }

    render() {
        return (
            <>
                {this.state.paused && <PauseOverlay onResume={this.resumeDrill} />}
                <DrillScreen className={"Drill Theme" + string.capitalize(this.props.theme)} onClick={this.handleClick}>

                    <DrillControlGroup>
                        {this.props.autoLevel && <Tooltip title="Reduce span"><Button onClick={this.reduceSpan}><ReduceIcon /></Button></Tooltip>}
                        {this.props.autoLevel && <Tooltip title="Increase span"><Button onClick={this.increaseSpan}><IncreaseIcon /></Button></Tooltip>}
                        <Tooltip title="Pause"><Button onClick={this.pauseDrill}><PauseIcon /></Button></Tooltip>
                        <Tooltip title="Stop"><Button onClick={this.stopDrill}><StopIcon /></Button></Tooltip>
                    </DrillControlGroup>

                    <DrillArea
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

                    </DrillArea>

                </DrillScreen>
            </>
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
        engine.start();
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
    // Inherit properties
    ...Viewer.propTypes,

    /**
     * Called when a new drill is generated.
     * The callback receives the drill data object as the first argument.
     */
    onNewDrill: PropTypes.func,
    /**
     * Called when the current level is updated.
     * The callback receives an object as first argument containing the new level settings.
     */
    onLevelChange: PropTypes.func,
    /**
     * Called when the user finishes the drill.
     * The callback receives an object as first argument containing metadata and stats.
     */
    onComplete: PropTypes.func,
};

Drill.defaultProps = {
    ...Viewer.defaultProps,

    onNewDrill: () => {},
    onLevelChange: () => {},
    onComplete: () => {},
};

export default Drill;

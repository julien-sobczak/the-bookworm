import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { updateReading } from '../../store/actions';
import { ContentContext } from '../../../content-context';

import * as library from '../../functions/library';

import Countdown from './Countdown';
import WizardFactory from './WizardFactory';

/**
 * Wrap GameFactory to inject the content from the React context.
 */
function GameFactoryContentAware(props) {
    return (
        <ContentContext.Consumer>
            {({ content, update, toggle }) => (
                <GameFactory {...props} content={content}  />
            )}
        </ContentContext.Consumer>
    );
}

class GameFactory extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // State management
            state: 'init',
            // Reading is finished?
            finished: false,
            // ID of the current content
            contentId: props.content.id,
        };

        this.handleWizardValidation = this.handleWizardValidation.bind(this);
        this.handleCountdownCompletion = this.handleCountdownCompletion.bind(this);
        this.handleDrillCompletion = this.handleDrillCompletion.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
    }

    /** Called when the user validate the wizard. */
    handleWizardValidation = (options) => {
        this.setState(state => ({
            ...state,
            ...options,
            state: this.props.countdownDuration > 0 ? 'ready' : 'started',
        }));
    }

    /** Called when the countdown is finished. */
    handleCountdownCompletion = () => {
        this.setState(state => ({
            ...state,
            state: 'started',
        }));
    }

    /**
     * Called when the user successfully finish the drill.
     *
     * The event structure should be:
     *
     * {
     *   stopped: true|false, // The drill was ended prematurely
     *   position: <blockPosition>, // Only for content-based drills
     *                              // The position when the drill has ended
     *   stats: {
     *     // Various statistics (properties depend on the drill category)
     *   },
     * }
     *
     * @param {Object} The result of the drill session
     */
    handleDrillCompletion = (result) => {
        // TODO updateHistory

        const stats = result.stats;

        if (this.props.contentAware) {
            const currentReading = this.state.currentReading;
            const initialPosition = currentReading.position;
            const lastPosition = {
                section: initialPosition.section,
                block: result.position,
            };

            console.log("Starting reading from ", initialPosition, "and ending to", lastPosition);

            const newPosition = library.nextPosition(lastPosition, this.props.content.content);
            const updatedReading = {
                ...currentReading,
                position: newPosition,
                lastRead: new Date().toJSON(),
            }

            console.log("New position will be ", newPosition);

            this.props.updateReading(updatedReading);

            this.setState(state => ({
                ...state,
                stats: stats,
                currentReading: updatedReading,
                finished: updatedReading.position.progress === 100,
                state: 'finished',
            }));
        } else {
            this.setState(state => ({
                ...state,
                stats: stats,
                state: 'finished',
            }));
        }
    }

    handleContinue = () => {
        const newState = {};

        if (this.countdownDuration > 0) {
            newState.state = 'ready';
        } else {
            newState.state = 'started';
        }

        if (this.props.contentAware) {
            console.log("Continue reading ", this.state.currentReading, "from ", this.state.currentReading.position)
            newState.currentContent = library.nextContent(this.state.currentReading.position, this.props.content);
        }

        this.setState(state => ({
            ...state,
            ...newState,
        }));
    }

    handleRestart = () => {
        const newState = {};

        if (this.countdownDuration > 0) {
            newState.state = 'ready';
        } else {
            newState.state = 'started';
        }

        this.setState(state => ({
            ...state,
            ...newState,
        }));
    }

    render() {
        const historySessions = this.props.history ?
            this.props.historySessions[this.props.name] :
            undefined;

        return (

            <div className="FullScreen VisionSpanGame">

                {this.state.state === 'init' &&
                    <WizardFactory
                            category={this.props.category}
                            engine={this.props.engine}
                            drill={this.props.drill}
                            form={this.props.form}
                            demo={this.props.demo}
                            history={this.props.history}
                            historySessions={historySessions}
                            predefinedDrills={this.props.predefinedDrills}
                            drillSettings={this.props.drillSettings}
                            textSettings={this.props.preferences.text}
                            onValidate={this.handleWizardValidation} 
                    />}

                {this.state.state === 'ready' &&
                    <Countdown duration={this.props.countdownDuration} onTimesUp={this.handleCountdownCompletion} />}

                {this.state.state === 'started' &&
                    React.cloneElement(this.props.drill, {
                        ...this.state.drillSettings,
                        ...this.state.textSettings,
                        content: this.state.currentContent,
                        onComplete: this.handleDrillCompletion,
                    })}

                {this.state.state === 'finished' &&
                    React.cloneElement(this.props.stats, {
                        stats: this.state.stats,
                        finished: this.state.finished,
                        onRestart: this.handleRestart,
                        onContinue: this.handleContinue,
                    })}

            </div>
        );
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.contentAware) return {};
        if (!prevState.currentContent || nextProps.content.id !== prevState.contentId) {
            const currentReading = library.getReading(nextProps.readings, nextProps.content);
            const currentContent = library.nextContent(currentReading.position, nextProps.content);
            return {
                currentReading: currentReading,
                currentContent: currentContent,
                contentId: nextProps.content.id,
            };
        }
        return null;
    }
}

GameFactory.propTypes = {
    // The name of the game
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,

    // List of subcomponents
    drill: PropTypes.element.isRequired,
    form: PropTypes.element.isRequired,
    demo: PropTypes.element.isRequired,
    history: PropTypes.element, // There are no history for chunking sessions
    stats: PropTypes.element,

    // Default settings
    drillSettings: PropTypes.object,

    // List of ready-to-go examples
    predefinedDrills: PropTypes.arrayOf(PropTypes.object),

    // Display a countdown counter before starting the drill (0 to disable it)
    countdownDuration: PropTypes.number,

    // The currently selected content
    contentAware: PropTypes.bool,
    content: PropTypes.object,
};

GameFactory.defaultProps = {
    history: null,
    countdownDuration: 0,
    predefinedDrills: [],
    contentAware: false,
    content: undefined,
};

const mapStateToProps = state => {
    return {
        readings: state.readings,
        preferences: state.preferences,
        historySessions: state.history,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateReading: reading => dispatch(updateReading(reading)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameFactoryContentAware);
import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import MobileDetect from 'mobile-detect';

import { ThemeProvider } from '@material-ui/core/styles';

import { updateReading, recordSession } from '../../store/actions';
import { ContentContext } from '../../../content-context';
import { lightTheme, darkTheme } from '../../../App';

import * as library from '../../functions/library';

import Countdown from '../toolbox/Countdown';
import WizardFactory from './WizardFactory';

/**
 * Wrap GameFactory to inject the content from the React context.
 */
function GameFactoryContentAware(props) {
    return (
        <ContentContext.Consumer>
            {({ content, }) => (
                <GameFactory {...props} content={content}  />
            )}
        </ContentContext.Consumer>
    );
}

class GameFactory extends React.Component {

    constructor(props) {
        super(props);

        const md = new MobileDetect(window.navigator.userAgent);
        const keyboardDetected = md.mobile() == null;

        this.state = {
            // State management
            state: props.configurable ? 'init' : 'ready',
            // Reading is finished?
            finished: false,
            // ID of the current content
            contentId: props.content.id,
            // Keyboard is available to the user
            keyboardDetected: keyboardDetected,
            // Drill settings are editable through the wizard
            drillSettings: {
                ...props.drillSettings,
                keyboard: keyboardDetected, // Override keyboard depending on detection
            }
        };

        this.handleWizardValidation = this.handleWizardValidation.bind(this);
        this.handleCountdownCompletion = this.handleCountdownCompletion.bind(this);
        this.handleDrillCompletion = this.handleDrillCompletion.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
    }

    /** Called when the user validate the wizard. */
    handleWizardValidation(options) {
        this.setState(state => ({
            ...state,
            ...options,
            state: this.props.countdownDuration > 0 ? 'ready' : 'started',
        }));
    }

    /** Called when the countdown is finished. */
    handleCountdownCompletion() {
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
    handleDrillCompletion(result) {
        const stats = result.stats;

        // recordSession
        const session = {
            type: this.props.name,
            date: new Date().toJSON(),
            textSettings: this.state.textSettings,
            drillSettings: this.state.drillSettings,
            stats: stats,
        };
        this.props.recordSession(session);

        // updateReading?
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
            };

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

    handleContinue() {
        const newState = {};

        if (this.countdownDuration > 0) {
            newState.state = 'ready';
        } else {
            newState.state = 'started';
        }

        if (this.props.contentAware) {
            console.log("Continue reading ", this.state.currentReading, "from ", this.state.currentReading.position);
            newState.currentContent = library.nextContent(this.state.currentReading.position, this.props.content);
        }

        this.setState(state => ({
            ...state,
            ...newState,
        }));
    }

    handleRestart() {
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
        const historySessions = this.props.historySessions[this.props.name];
        let theme = lightTheme;
        if (this.state.textSettings && ['Dark', 'Black'].includes(this.state.textSettings.theme)) {
            theme = darkTheme;
        }
        console.log(`Theme`, this.state.textSettings, theme);

        return (
            <>
                {this.state.state === 'init' &&
                    <WizardFactory
                        category={this.props.category}
                        name={this.props.name}
                        engine={this.props.engine}
                        drill={this.props.drill}
                        form={this.props.form}
                        instructions={this.props.instructions}
                        historySessions={historySessions}
                        drillSettings={this.state.drillSettings}
                        drillPresets={this.props.drillPresets}
                        textSettings={this.props.preferences.text}
                        onValidate={this.handleWizardValidation}
                        keyboardDetected={this.state.keyboardDetected}
                    />}

                {this.state.state === 'ready' &&
                    <Countdown duration={this.props.countdownDuration} onTimesUp={this.handleCountdownCompletion} />}

                {this.state.state === 'started' &&
                    <ThemeProvider theme={theme}>
                        {React.cloneElement(this.props.drill, {
                            ...this.state.drillSettings,
                            ...this.state.textSettings,
                            keyboardDetect: this.state.keyboardDetected,
                            content: this.state.currentContent,
                            onComplete: this.handleDrillCompletion,
                        })}
                    </ThemeProvider>}

                {this.state.state === 'finished' &&
                    React.cloneElement(this.props.stats, {
                        stats: this.state.stats,
                        finished: this.state.finished,
                        onRestart: this.handleRestart,
                        onContinue: this.handleContinue,
                    })}
            </>
        );
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!nextProps.contentAware) return {};
        if (library.valid(nextProps.content) && (!prevState.currentContent || nextProps.content.id !== prevState.contentId)) {
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
    // State
    readings: PropTypes.array.isRequired,
    preferences: PropTypes.object.isRequired,
    historySessions: PropTypes.object.isRequired,
    updateReading: PropTypes.func.isRequired,
    recordSession: PropTypes.func.isRequired,

    // The name of the game
    name: PropTypes.string.isRequired,
    category: PropTypes.oneOf(['vision-span', 'chunking', 'practice']).isRequired,


    // Show the configuration wizard
    configurable: PropTypes.bool,

    // List of subcomponents
    engine: PropTypes.object, // For vision-span drills
    drill: PropTypes.element.isRequired,
    form: PropTypes.element.isRequired,
    instructions: PropTypes.element.isRequired,
    stats: PropTypes.element,

    // Default settings
    drillSettings: PropTypes.object,

    // List of presets
    drillPresets: PropTypes.arrayOf(PropTypes.object),

    // Display a countdown counter before starting the drill (0 to disable it)
    countdownDuration: PropTypes.number,

    // The currently selected content
    contentAware: PropTypes.bool,
    content: PropTypes.object,
};

GameFactory.defaultProps = {
    configurable: true,
    countdownDuration: 0,
    drillPresets: [],
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
        recordSession: session => dispatch(recordSession(session)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameFactoryContentAware);

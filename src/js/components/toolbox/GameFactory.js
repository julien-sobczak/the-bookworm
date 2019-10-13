import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { updateReading } from '../../store/actions';
import { ContentContext } from '../../../content-context';

import * as library from '../../functions/library';

import Countdown from './Countdown';
import WizardFactory from './WizardFactory';
import Stats from '../vision-span/Stats';

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

    /** Called when the user successfully finish the drill. */
    handleDrillCompletion = (stats) => {
        // TODO updateHistory
        const currentReading = this.state.currentReading;

        let progress = 0;
        if (currentReading.position.section === this.props.content.content.sections.length - 1) {
            progress = 100;
        } else {
            progress = (currentReading.position.section + 1) * 100 / this.props.content.content.sections.length;
        }

        const updatedReading = {
            ...currentReading,
            position: {
                section: currentReading.position.section + 1,
                block: 0,
                progress: progress,
            },
            lastRead: new Date().toJSON(),
        }

        this.props.updateReading(updatedReading);

        this.setState(state => ({
            ...state,
            stats: stats,
            currentReading: updatedReading,
            finished: progress === 100,
            state: 'finished',
        }));
    }

    handleContinue() {
        this.setState(state => ({
            ...state,
            currentContent: library.next(this.state.currentReading, this.props.content),
            state: 'ready',
        }));
    }

    render() {
        const historySessions = this.props.history ?
            this.props.historySessions[this.props.name] :
            undefined;

        return (

            <div className="FullScreen VisionSpanGame">

                {/* TODO add a new redirectUrl prop */}
                <Link to="/vision-span/" className="ButtonClose"><i className="material-icons">close</i></Link>

                {this.state.state === 'init' &&
                    <WizardFactory
                            engine={this.props.engine}
                            drill={this.props.drill}
                            form={this.props.form}
                            demo={this.props.demo}
                            history={this.props.history}
                            historySessions={historySessions}
                            predefinedDrills={this.props.predefinedDrills}
                            drillSettings={this.props.drillSettings}
                            textSettings={this.props.preferences.text}
                            onValidate={this.handleWizardValidation} />}

                {this.state.state === 'ready' &&
                    <Countdown duration={3000} onTimesUp={this.handleCountdownCompletion} />}

                {this.state.state === 'started' &&
                    React.cloneElement(this.props.drill, {
                        ...this.state.drillSettings,
                        ...this.state.textSettings,
                        content: this.state.currentContent,
                        onComplete: this.handleDrillCompletion,
                    })}

                {this.state.state === 'finished' &&
                    <Stats stats={this.state.stats} finished={this.state.finished} onContinue={this.handleContinue} />}

            </div>
        );
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.content.id !== prevState.contentId) {
            const currentReading = library.getReading(nextProps.readings, nextProps.content);
            const currentContent = library.next(currentReading, nextProps.content);
            return {
                currentReading: currentReading,
                currentContent: currentContent,
            };
        }
        return null;
    }
}

GameFactory.propTypes = {
    // The name of the game
    name: PropTypes.string.isRequired,

    // List of subcomponents
    drill: PropTypes.element.isRequired,
    form: PropTypes.element.isRequired,
    demo: PropTypes.element.isRequired,
    history: PropTypes.element, // There are no history for chunking sessions

    // Default settings
    drillSettings: PropTypes.object,

    // List of ready-to-go examples
    predefinedDrills: PropTypes.arrayOf(PropTypes.object),

    // Display a countdown counter before starting the drill (0 to disable it)
    countdownDuration: PropTypes.number,

    // The currently selected content
    content: PropTypes.object,
};

GameFactory.defaultProps = {
    history: null,
    countdownDuration: 0,
    predefinedDrills: [],
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
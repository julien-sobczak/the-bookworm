import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import Countdown from './Countdown';
import WizardFactory from './WizardFactory';
import Stats from '../vision-span/Stats';

const mapStateToProps = state => {
    return {
        preferences: state.preferences,
        historySessions: state.history,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

class GameFactory extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // State management
            state: 'init',
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
        this.setState(state => ({
            ...state,
            stats: stats,
            state: 'finished',
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
                        onComplete: this.handleDrillCompletion,
                    })}

                {this.state.state === 'finished' &&
                    <Stats stats={this.state.stats} />}

            </div>
        );
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
};

GameFactory.defaultProps = {
    history: null,
    countdownDuration: 0,
    predefinedDrills: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(GameFactory);
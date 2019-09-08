import React from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Drill from './Drill';
import Wizard from './Wizard';
import Stats from './Stats';

const mapStateToProps = state => {
    return {
        preferences: state.preferences,
        history: state.history,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            spans: props.spans,

            // State management
            started: false,
            finished: false,

            // Copy styling settings as state to update during a drill session
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.fontStyle,
            backgroundColor: props.backgroundColor,
            color: props.color,
        };

        this.handleWizardValidation = this.handleWizardValidation.bind(this);
        this.handleDrillCompletion = this.handleDrillCompletion.bind(this);
    }

    /** Called when the user validate the wizard. */
    handleWizardValidation = (options) => {
        console.log('Wizard ends with', options);
        this.setState(state => ({
            ...state,
            ...options,
            started: true,
            finished: false,
        }));
    }

    /** Called when the user successfully finish the drill. */
    handleDrillCompletion = (stats) => {
        this.setState(state => ({
            ...state,
            stats: stats,
            started: false,
            finished: true,
        }));
    }

    render() {
        return (
            <div className="FullScreen VisionSpanGame">

                <Link to="/vision-span/" className="ButtonClose"><i className="material-icons">close</i></Link>

                {!this.state.started && !this.state.finished &&
                    <Wizard textSettings={this.props.preferences.text}
                            history={this.props.history.drillHorizontal}
                            onValidate={this.handleWizardValidation} />}

                {this.state.started &&
                    <Drill
                        {...this.state.drillSettings}
                        {...this.state.textSettings}

                        onComplete={this.handleDrillCompletion}
                    />}

                {this.state.finished &&
                    <Stats stats={this.state.stats} />}
            </div>
        );
    }

}

Game.propTypes = {
    ...Drill.propTypes,
};

Game.defaultProps = {
    ...Drill.defaultProps,
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
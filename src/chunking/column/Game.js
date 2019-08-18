import React from 'react';
import { Link } from "react-router-dom";

import Countdown from '../../toolbox/Countdown';
import Drill from './Drill';
import Wizard from './Wizard';
import Stats from './Stats';

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Copy drill options
            wpm: props.wpm,
            speedControls: props.speedControls,
            columns: props.columns,
            columnWidth: props.columnWidth,
            linesMax: props.linesMax,

            chunkStyle: props.chunkStyle,

            // State management
            state: 'init',

            // Copy styling settings as state to update during a drill session
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.fontStyle,
            backgroundColor: props.backgroundColor,
            color: props.color,
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
            state: 'ready',
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
        return (
            <div className="FullScreen ChunkingGame">

                <Link to="/chunking/" className="ButtonClose"><i className="material-icons">close</i></Link>

                {this.state.state === 'init' &&
                    <Wizard onValidate={this.handleWizardValidation} />}

                {this.state.state === 'ready' &&
                    <Countdown duration={3000} onTimesUp={this.handleCountdownCompletion} />}

                {this.state.state === 'started' &&
                    <Drill
                        content={this.props.content}

                        wpm={this.state.wpm}
                        speedControls={this.state.speedControls}
                        columns={this.state.columns}
                        columnWidth={this.state.columnWidth}

                        chunkStyle={this.state.chunkStyle}
                        chunkMode={this.state.chunkMode}
                        chunkWidth={this.state.chunkWidth}
                        chunkAccuracy={this.state.chunkAccuracy}
                        chunkWords={this.state.chunkWords}
                        chunkWidthMin={this.state.chunkWidthMin}
                        chunkWidthMax={this.state.chunkWidthMax}
                        chunkTransition={this.state.chunkTransition}
                        chunkSteps={this.state.chunkSteps}


                        fontFamily={this.state.fontFamily}
                        fontSize={this.state.fontSize}
                        fontStyle={this.state.fontStyle}
                        backgroundColor={this.state.backgroundColor}
                        color={this.state.color}

                        onComplete={this.handleDrillCompletion}
                    />}

                {this.state.state === 'finished' &&
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

export default Game;
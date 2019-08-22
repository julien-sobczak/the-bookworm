import React from 'react';
import { Link } from "react-router-dom";

import Countdown from '../../toolbox/Countdown';
import Drill from './Drill';
import Wizard from './Wizard';
import Stats from './Stats';
import Library from '../../library/Library';

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Copy default content
            content: props.content,

            // Copy drill options
            wpm: props.wpm,
            linesPerChunk: props.linesPerChunk,
            neighborChunksPosition: props.neighborChunksPosition,
            showPreviousChunk: props.showPreviousChunk,
            showNextChunk: props.showNextChunk,
            speedControls: props.speedControls,

            // State management
            state: 'library',

            // Copy styling settings as state to update during a drill session
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.fontStyle,
            backgroundColor: props.backgroundColor,
            color: props.color,
        };

        this.handleLibrarySelection = this.handleLibrarySelection.bind(this);
        this.handleWizardValidation = this.handleWizardValidation.bind(this);
        this.handleCountdownCompletion = this.handleCountdownCompletion.bind(this);
        this.handleDrillCompletion = this.handleDrillCompletion.bind(this);
    }

    /** Called when the user select a content in the library */
    handleLibrarySelection = (selection) => {
        this.setState(state => ({
            ...state,
            content: selection,
            state: 'init',
        }));
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

                {this.state.state === 'library' &&
                    <Library redirect="/chunking/chunk" onSelect={this.handleLibrarySelection} />}

                {this.state.state === 'init' &&
                    <Wizard onValidate={this.handleWizardValidation} />}

                {this.state.state === 'ready' &&
                    <Countdown duration={3000} onTimesUp={this.handleCountdownCompletion} />}

                {this.state.state === 'started' &&
                    <Drill
                        content={this.props.content}

                        wpm={this.state.wpm}
                        linesPerChunk={this.state.linesPerChunk}
                        neighborChunksPosition={this.state.neighborChunksPosition}
                        showPreviousChunk={this.state.showPreviousChunk}
                        showNextChunk={this.state.showNextChunk}
                        speedControls={this.state.speedControls}

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
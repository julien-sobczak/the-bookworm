import React from 'react';
import { Link } from "react-router-dom";
import Button from '@material/react-button';
import PropTypes from 'prop-types';
import Chunker from './Chunker'
import DrillPage from './DrillPage'; // FIXME remove dependency
import Styled from '../toolbox/Styled';

import '@material/react-icon-button/dist/icon-button.css';
import '@material/react-button/dist/button.css';
import { capitalize } from '../toolbox/Fn';

class DrillChunk extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wpm: this.props.wpm,
            chunks: undefined,
            chunkPosition: -1,
            started: false,
            finished: false,
        };

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.onChunkerDone = this.onChunkerDone.bind(this);
        this.start = this.start.bind(this);
    }

    onChunkerDone(chunks) {
        console.log('Chunks', chunks);
        this.setState(state => ({
            ...state,
            chunks: chunks,
            chunkPosition: -1,
        }));
    }

    advanceChunk() {
        const drillEndingDuration = 1000;
        const chunkPosition = this.state.chunkPosition;
        const chunks = this.state.chunks;

        if (chunkPosition + 1 === chunks.length) {
            // Finish
            this.setState(state => ({
                ...state,
                chunkPosition: 0,
                started: false,
                finished: true,
            }));
            return drillEndingDuration;
        } else {
            // Move to next chunk
            const newChunkPosition = chunkPosition + 1;
            let previousChunk = this.chunkAt(newChunkPosition - 1);
            let currentChunk = this.chunkAt(newChunkPosition);
            let nextChunk = this.chunkAt(newChunkPosition + 1);
            this.setState(state => ({ // eslint-disable-line no-loop-func
                ...state,
                chunkPosition: newChunkPosition,
                previousChunk: previousChunk,
                currentChunk: currentChunk,
                nextChunk: nextChunk,
            }));
            return DrillPage.chunkDuration(this.chunkAt(newChunkPosition).text, this.state.wpm);
        }
    }

    chunkAt(position) {
        if (position < 0 || position >= this.state.chunks.length) return undefined;
        return this.state.chunks[position];
    }

    currentChunk() {
        return this.chunkAt(this.state.chunkPosition);
    }

    start() {
        this.setState(state => ({
            ...state,
            started: true,
        }));

        this.clear();


        let delay = this.advanceChunk();
        let start = new Date().getTime()
        this.handle = undefined;
        let loop = () => {
            if (!this.handle) return;
            this.handle = window.requestAnimationFrame(loop);
            const current = new Date().getTime()
            const delta = current - start
            if (delta >= delay) {
              delay = this.advanceChunk();
              start = new Date().getTime();
            }
        }
        this.handle = window.requestAnimationFrame(loop);
    }

    componentWillUnmount() {
        this.clear();
    }

    clear() {
        if (this.handle) {
            clearInterval(this.handle);
            this.handle = null;
        }
    }

    increaseWpm() {
        this.setState(state => ({
            ...state,
            wpm: state.wpm + 20,
        }));
    }

    reduceWpm() {
        this.setState(state => ({
            ...state,
            wpm: state.wpm - 20,
        }));
    }

    render() {
        const styles = { // FIXME move in stylesheet
            "display": "grid",
            "height": "100vh",
            "placeItems": "center center",
        }
        const classNames = ['NeighborPosition'+capitalize(this.props.neighborChunksPosition)];

        const previousChunkEmpty = !this.state.previousChunk || this.state.currentChunk.startingChunk;
        const nextChunkEmpty = !this.state.nextChunk || this.state.currentChunk.endingChunk;

        let i = 0;
        return (
            <div className={"FullScreen ChunkingDrillChunk " + classNames.join(' ')} style={styles}>

                <Chunker content={this.props.content} onDone={this.onChunkerDone}
                       fontFamily={this.props.fontFamily}
                       fontSize={this.props.fontSize}
                       fontStyle={this.props.fontStyle}
                />

                <section className="DrillControls">
                    <ul>
                        {this.props.speedControls && <li><button onClick={this.increaseWpm}><i className="material-icons">chevron_left</i></button></li>}
                        {this.props.speedControls && <li><button onClick={this.reduceWpm}><i className="material-icons">chevron_right</i></button></li>}
                        <li><Link to="/chunking/"><i className="material-icons">close</i></Link></li>
                    </ul>
                </section>

                <section className="DrillArea">

                    {!this.state.started &&
                        <div className="Wizard">
                            <Button raised icon={<i className="material-icons">{this.state.playing ? 'pause_arrow' : 'play_arrow'}</i>} onClick={this.start}>
                                Read
                            </Button>
                        </div>
                    }

                    {this.state.started && this.state.currentChunk &&
                        <Styled {...this.props} className="Chunks">
                            {this.props.showPreviousChunk && previousChunkEmpty &&
                                <span className="Chunk PreviousChunk Opaque">&nbsp;</span>}
                            {this.state.previousChunk && !previousChunkEmpty &&
                                <span className="Chunk PreviousChunk">{this.state.previousChunk.text}</span>}
                            {this.props.neighborChunksPosition === 'vertical' && <br/>}

                            {this.state.currentChunk &&
                                <span className="Chunk CurrentChunk Selected">{this.state.currentChunk.text}</span>}

                            {this.props.neighborChunksPosition === 'vertical' && <br/>}
                            {this.props.showNextChunk && nextChunkEmpty &&
                                <span className="Chunk NextChunk Opaque">&nbsp;</span>}
                            {this.props.showNextChunk && !nextChunkEmpty &&
                                <span className="Chunk NextChunk">{this.state.nextChunk.text}</span>}
                        </Styled>
                    }

                </section>

            </div>
        );
    }

    // FIXME remove
    generateChunks() {
        // We ignore the book layout (line height, margin, title size, letter cap, etc) when speed reading in chunk mode.
        const BREAK = "__BREAK__";
        return [
            "Chapter 3", BREAK,
            "TOM presented himself", "before Aunt Polly,", "who was sitting", "by an open window", "in a pleasant rearward apartment,", "which was bedroom,", "breakfast-room, dining-room,", "and library, combined.", "The balmy summer air,", "the restful quiet,", "the odor of the flowers,", "and the drowsing murmur", "of the bees had", "had their effect,", "and she was nodding over", "her knitting--for", "she had no company", "but the cat, and it was", "asleep in her lap.", "He said: “Mayn't I go", "and play now, aunt?”", BREAK,
            "“What, a'ready? How", "much have you done?”", BREAK,
            // ...
        ]
    }

}

DrillChunk.propTypes = {
    ...Chunker.propTypes,

    // WPM
    wpm: PropTypes.number,
    // Displays controls to vary the span between columns
    speedControls: PropTypes.bool,
    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,
    // Display the previous/next chunk(s) to the left/right of the current chunk (`horizontal`) or above/below the current chunk (`vertical`).
    neighborChunksPosition: PropTypes.string,
    // Display the previous chunk
    showPreviousChunk: PropTypes.bool,
    // Display the next chunk
    showNextChunk: PropTypes.bool,
}

DrillChunk.defaultProps = {
    ...Chunker.defaultProps,

    wpm: 1000,
    speedControls: true,
    autoLevel: true,

    // Chunk options
    neighborChunksPosition: 'vertical',
    showPreviousChunk: false,
    showNextChunk: true,

    // FIXME remove
    fontSize: '16pt',
};

export default DrillChunk;

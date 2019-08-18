import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import Chunker from '../Chunker';
import { chunkDuration } from '../../toolbox/WPM';
import MainButton from '../../toolbox/MainButton';

import '@material/react-icon-button/dist/icon-button.css';
import '@material/react-button/dist/button.css';

class Drill extends React.Component {

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
            chunks: Drill.groupChunks(chunks, this.props.linesPerChunk),
            chunkPosition: -1,
        }));
    }

    static groupChunks(chunks, linesPerChunk) {
        if (linesPerChunk === 1) return chunks;

        const groupedChunks = [];

        let i = 0;
        while (i < chunks.length) {
            const subChunks = chunks.slice(i, Math.min(i+linesPerChunk, chunks.length));

            const subChunksInCurrentBlock = [];
            for (let j = 0; j < subChunks.length; j++) {
                const chunk = subChunks[j];
                subChunksInCurrentBlock.push(chunk)
                if (chunk.endingChunk) {
                    // Stop here
                    break;
                }
            }

            const allChunksInCurrentBlock = subChunks.length === subChunksInCurrentBlock.length;
            if (!allChunksInCurrentBlock) {
                // Case 1: End of paragraph before the number of lines
                // Don't group chunk from different blocks
                groupedChunks.push(...subChunksInCurrentBlock);
                i += subChunksInCurrentBlock.length;
            } else {
                // Case 2: All chunks are in the same block
                // Simply group them

                const firstChunk = subChunks[0];
                const lastChunk = subChunks[subChunks.length - 1];
                const chunkText = subChunks.map(c => c.text).join('<br/>');

                groupedChunks.push({
                    text: chunkText,
                    tag: firstChunk.tag,
                    startingChunk: firstChunk.startingChunk,
                    endingChunk: lastChunk.endingChunk,
                })
                i += subChunks.length;
            }
        }

        return groupedChunks;
    }

    advanceChunk() {
        if (this.state.chunks.length === 0) return;

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

            const stats = {};
            this.props.onComplete(stats);
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
            return chunkDuration(this.chunkAt(newChunkPosition).text, this.state.wpm);
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
        let i = 0;
        return (
            <div className="FullScreen DrillChunk Centered">

                <Chunker content={this.props.content} onDone={this.onChunkerDone}
                       {...this.props}
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
                            <MainButton text="Click Me" onClick={this.start} />
                        </div>
                    }

                    {this.state.started && this.state.currentChunk &&
                        <Viewer {...this.props}
                                previousChunk={this.state.previousChunk}
                                currentChunk={this.state.currentChunk}
                                nextChunk={this.state.nextChunk} />
                    }

                </section>

            </div>
        );
    }

}

Drill.propTypes = {
    ...Chunker.propTypes,
    ...Viewer.propTypes,

    // The content to read
    content: PropTypes.object.isRequired,

    // WPM
    wpm: PropTypes.number,
    // Displays controls to vary the span between columns
    speedControls: PropTypes.bool,

    // How many lines per chunk (in practice, pack several chunks into the same chunk)
    linesPerChunk: PropTypes.number,

    // Callback when the user finishes the drill
    onComplete: PropTypes.func,
}

Drill.defaultProps = {
    ...Chunker.defaultProps,
    ...Viewer.defaultProps,

    // Chunk options
    wpm: 2000,
    linesPerChunk: 1,
    speedControls: true,

    onComplete: function() {},
};

export default Drill;

import React from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import Chunker from '../Chunker';

import ProgressLine from '../../toolbox/ProgressLine';

import * as wpm from '../../../functions/wpm';
import * as string from '../../../functions/string';
import * as library from '../../../functions/library';
import * as time from '../../../functions/time';


class Drill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wpm: this.props.wpm,
            chunks: undefined,
            chunkPosition: -1,
        };

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.stopDrill = this.stopDrill.bind(this);
        this.onChunkerDone = this.onChunkerDone.bind(this);
    }

    onChunkerDone(chunks) {
        console.log('Chunks', chunks);
        this.setState(state => ({
            ...state,
            chunks: Drill.groupChunks(chunks, this.props.linesPerChunk),
            chunkPosition: -1,
        }));
        this.initialized = true;
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
                subChunksInCurrentBlock.push(chunk);
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
                });
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
            }));
            this.reportCompletion(false);
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
            return wpm.textDuration(this.chunkAt(newChunkPosition).text, this.state.wpm);
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
        this.clear();

        const startingPause = 500;
        let delay = startingPause + this.advanceChunk();
        let start = new Date().getTime();
        this.handle = undefined;
        let loop = () => {
            if (!this.handle) return;
            this.handle = window.requestAnimationFrame(loop);
            const current = new Date().getTime();
            const delta = current - start;
            if (delta >= delay) {
              delay = this.advanceChunk();
              start = new Date().getTime();
            }
        };
        this.handle = window.requestAnimationFrame(loop);

        this.setState(state => ({
            ...state,
            startDate: new Date(),
        }));
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

    stopDrill() {
        this.reportCompletion(true);
    }

    reportCompletion(stopped) {
        const blockPosition = this.currentChunk().block;

        let readContent = this.props.content;
        let readChunks = this.state.chunks;
        if (stopped) {
            // Need to stop where the reader has stop
            readContent = library.extractContent(readContent, 0, blockPosition);
            readChunks = readChunks.slice(0, this.state.chunkPosition);
        }

        const stats = {
            ...library.statsContent(readContent, time.duration(this.state.startDate)),
            ...library.statsChunks(readChunks),
        };

        this.props.onComplete({
            stopped: stopped,
            position: blockPosition,
            stats: stats,
        });
    }

    render() {
        let i = 0;
        return (
            <div className={"FullScreen DrillChunk Centered Theme" + string.capitalize(this.props.theme)}>

                <Chunker content={this.props.content} onDone={this.onChunkerDone}
                       {...this.props}
                />

                <section className="DrillControls">
                    <ul>
                        <li><button onClick={this.increaseWpm}><i className="material-icons">chevron_left</i></button></li>
                        <li><button onClick={this.reduceWpm}><i className="material-icons">chevron_right</i></button></li>
                        <li><button onClick={this.stopDrill}><i className="material-icons">stop</i></button></li>
                    </ul>
                </section>

                <section className="DrillArea">

                    {this.state.currentChunk &&
                        <>
                            <ProgressLine progress={this.state.chunkPosition * 100 / this.state.chunks.length} />
                            <Viewer {...this.props}
                                    previousChunk={this.state.previousChunk}
                                    currentChunk={this.state.currentChunk}
                                    nextChunk={this.state.nextChunk} />
                        </>
                    }

                </section>

            </div>
        );
    }

    componentDidUpdate() {
        if (this.initialized) {
            this.start();
            this.initialized = undefined;
        }
    }

    componentWillUnmount() {
        this.clear();
    }

}

Drill.propTypes = {
    ...Viewer.propTypes,

    // The content to read
    content: PropTypes.object,

    // Callback when the user finishes the drill
    onComplete: PropTypes.func,
};

Drill.defaultProps = {
    ...Viewer.defaultProps,

    onComplete: function() {},
};

export default Drill;

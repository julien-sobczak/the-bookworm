import React from 'react';
import PropTypes from 'prop-types';

import ReduceIcon from '@material-ui/icons/Remove';
import IncreaseIcon from '@material-ui/icons/Add';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import Viewer from './Viewer';
import Chunker from '../Chunker';

import { DrillScreen, DrillArea, DrillControlGroup } from '../../core/UI';
import ProgressLine from '../../toolbox/ProgressLine';
import PauseOverlay from '../../toolbox/PauseOverlay';

import * as wpm from '../../../functions/wpm';
import * as engine from '../../../functions/engine';
import * as string from '../../../functions/string';
import * as content from '../../../functions/content';

/**
 * Main component for the drill.
 */
class Drill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wpm: this.props.wpm,
            chunks: undefined,
            chunkPosition: -1,
            timer: new engine.Timer(),
            paused: false,
        };

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.onChunkerDone = this.onChunkerDone.bind(this);

        // State
        this.pauseDrill = this.pauseDrill.bind(this);
        this.resumeDrill = this.resumeDrill.bind(this);
        this.stopDrill = this.stopDrill.bind(this);

        this.state.timer.start();
    }

    onChunkerDone(chunks) {
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
            }), this.reportChunkChange);
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

    pauseDrill() {
        this.setState({
            paused: true,
        });
        this.state.timer.pause();
        this.clear();
    }

    resumeDrill() {
        this.setState({
            paused: false,
        });
        this.state.timer.resume();
        this.start();
    }

    stopDrill() {
        this.reportCompletion(true);
    }

    reportChunkChange() {
        this.props.onChunkChange({
            chunkPosition: this.state.chunkPosition,
            chunk: this.currentChunk(),
        });
    }

    reportCompletion(stoppedPrematurely) {
        this.state.timer.stop();
        const blockPosition = this.currentChunk().block;

        let readContent = this.props.content;
        let readChunks = this.state.chunks;
        if (stoppedPrematurely) {
            // Need to stop where the reader has stop
            readContent = content.extractContent(readContent, 0, blockPosition);
            readChunks = readChunks.slice(0, this.state.chunkPosition);
        }

        const stats = {
            ...content.statsContent(readContent, this.state.timer.durationInSeconds()),
            ...content.statsChunks(readChunks),
        };

        this.props.onComplete({
            stopped: stoppedPrematurely,
            position: blockPosition,
            stats: stats,
        });
    }

    render() {
        return (
            <>
                {this.state.paused && <PauseOverlay onResume={this.resumeDrill} />}

                <Chunker content={this.props.content} onDone={this.onChunkerDone}
                    {...this.props}
                />

                <DrillScreen className={"DrillChunk Theme" + string.capitalize(this.props.theme)}>

                    <DrillControlGroup>
                        <Tooltip title="Reduce WPM"><Button onClick={this.reduceWpm}><ReduceIcon /></Button></Tooltip>
                        <Tooltip title="Increase WPM"><Button onClick={this.increaseWpm}><IncreaseIcon /></Button></Tooltip>
                        <Tooltip title="Pause"><Button onClick={this.pauseDrill}><PauseIcon /></Button></Tooltip>
                        <Tooltip title="Stop"><Button onClick={this.stopDrill}><StopIcon /></Button></Tooltip>
                    </DrillControlGroup>

                    <DrillArea>
                        {this.state.currentChunk &&
                            <>
                                <ProgressLine progress={this.state.chunkPosition * 100 / this.state.chunks.length} />
                                <Viewer {...this.props}
                                    previousChunk={this.state.previousChunk}
                                    currentChunk={this.state.currentChunk}
                                    nextChunk={this.state.nextChunk} />
                            </>
                        }
                    </DrillArea>

                </DrillScreen>
            </>
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
    // Inherit properties
    ...Viewer.propTypes,

    /**
     * The content in the standard format to read.
     */
    content: PropTypes.object,
    /**
     * Called when the current chunk is updated.
     * The callback receives an object as the first argument containing the information about the new chunk.
     */
    onChunkChange: PropTypes.func,
    /**
     * Called when the user finishes the drill.
     * The callback receives an object as first argument containing metadata and stats.
     */
    onComplete: PropTypes.func,
};

Drill.defaultProps = {
    ...Viewer.defaultProps,

    onChunkChange: () => {},
    onComplete: () => {},
};

export default Drill;

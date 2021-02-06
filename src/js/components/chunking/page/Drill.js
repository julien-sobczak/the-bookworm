import React from 'react';
import PropTypes from 'prop-types';

import ReduceIcon from '@material-ui/icons/Remove';
import IncreaseIcon from '@material-ui/icons/Add';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import Viewer from './Viewer';
import Pager, { PagerTest } from '../Pager';

import { DrillScreen, DrillArea, DrillControlGroup } from '../../core/UI';
import ProgressLine from '../../toolbox/ProgressLine';
import PauseOverlay from '../../toolbox/PauseOverlay';

import * as engine from '../../../functions/engine';
import * as string from '../../../functions/string';
import * as wpm from '../../../functions/wpm';
import * as content from '../../../functions/content';

// Values for property pagerMode.
const pagerModes = ['dom', 'fixed'];

/**
 * Main component for the drill.
 */
class Drill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wpm: this.props.wpm,
            pages: undefined,
            pageNumber: 0,
            blockPosition: 0,
            chunkPosition: 0,
            timer: new engine.Timer(),
            paused: false,
        };

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.onPagerDone = this.onPagerDone.bind(this);

        // State
        this.pauseDrill = this.pauseDrill.bind(this);
        this.resumeDrill = this.resumeDrill.bind(this);
        this.stopDrill = this.stopDrill.bind(this);

        this.state.timer.start();
    }

    onPagerDone(pages) {
        this.setState(state => ({
            ...state,
            pages: pages,
            pageNumber: 1,
        }), this.start); // Ready to start!
    }

    componentWillUnmount() {
        this.clear();
    }

    start() {
        this.clear();

        const startingPause = 500;
        let delay = startingPause + wpm.textDuration(this.currentChunk(), this.state.wpm);
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

    advanceChunk() {
        const page = this.state.pages[this.state.pageNumber-1];
        const indexBlock = this.state.blockPosition;
        const maxChunk = page.blocks[indexBlock].chunks.length;
        let indexChunk = this.state.chunkPosition;

        const pageEndingDuration = 1000;
        const pageTurningDuration = this.props.pageTurningDuration;

        // Next chunk may be a space character. We should continue until finding the first next chunk.
        let retry;
        // eslint-disable no-loop-func
        do {
            retry = false;

            if (indexChunk + 1 >= maxChunk) {
                // Try to move to next block

                const maxBlock = page.blocks.length;
                if (indexBlock + 1 === maxBlock) {
                    // Try to move to next page
                    const maxPage = this.state.pages.length;
                    if (this.state.pageNumber === maxPage) {
                        // Finish
                        this.setState(state => ({
                            ...state,
                            pageNumber: 1,
                            blockPosition: 0,
                            chunkPosition: 0,
                        }));
                        this.reportCompletion(false);
                        return pageEndingDuration;
                    } else {
                        // Move to next page
                        this.setState(state => ({
                            ...state,
                            pageNumber: state.pageNumber+1,
                            blockPosition: 0,
                            chunkPosition: 0,
                        }), this.reportChunkChange);
                        return pageTurningDuration + wpm.textDuration(this.currentChunk(), this.state.wpm);
                    }
                } else {
                    // Move to next block
                    this.setState(state => ({
                        ...state,
                        blockPosition: state.blockPosition+1,
                        chunkPosition: 0,
                    }), this.reportChunkChange);
                }
            } else {
                // Move to next chunk
                if (page.blocks[indexBlock].chunks[indexChunk+1].trim() === '') { // ignore space chunk
                    indexChunk++;
                    retry = true;
                } else {
                    this.setState(state => ({ // eslint-disable-line no-loop-func
                        ...state,
                        chunkPosition: indexChunk+1,
                    }), this.reportChunkChange);
                }
            }
        } while (retry);
        // eslint-enable no-loop-func

        return wpm.textDuration(this.currentChunk(), this.state.wpm);
    }

    currentPage() {
        if (this.state.pageNumber <= 0) return undefined;
        return this.state.pages[this.state.pageNumber-1];
    }

    currentBlock() {
        const page = this.currentPage();
        if (!page) return undefined;
        if (this.state.blockPosition >= page.blocks.length) return undefined;
        return page.blocks[this.state.blockPosition];
    }

    currentChunk() {
        const block = this.currentBlock();
        if (!block) return undefined;
        const chunks = block.chunks;
        if (this.state.chunkPosition >= chunks.length) return undefined;
        return chunks[this.state.chunkPosition];
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

    reportChunkChange() {
        this.props.onChunkChange({
            pageNumber: this.state.pageNumber,
            blockPosition: this.state.blockPosition,
            chunkPosition: this.state.chunkPosition,
        });
    }

    reportCompletion(stopped) {
        this.state.timer.stop();
        let readContent = this.props.content;
        let readPages = this.state.pages;
        const blockPosition = this.currentBlock().block;

        if (stopped) {
            // Need to calculate only the read portion
            readContent = content.extractContent(readContent, 0, blockPosition);
            readPages = readPages.slice(0, this.state.pageNumber);
        }
        const stats = {
            ...content.statsContent(readContent, this.state.timer.durationInSeconds()),
            ...content.statsPages(readPages),
        };

        this.props.onComplete({
            stopped: stopped,
            position: blockPosition,
            stats: stats,
        });
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

    render() {
        return (
            <>
                {this.state.paused && <PauseOverlay onResume={this.resumeDrill} />}

                {this.props.pagerMode === 'dom' && <Pager content={this.props.content} onDone={this.onPagerDone}
                    {...this.props} />}
                {this.props.pagerMode === 'fixed' && <PagerTest content={this.props.content} onDone={this.onPagerDone}
                    {...this.props} />}

                <DrillScreen className={"ChunkingDrillPage Theme" + string.capitalize(this.props.theme)}>

                    <DrillControlGroup>
                        <Tooltip title="Reduce WPM"><Button onClick={this.reduceWpm}><ReduceIcon /></Button></Tooltip>
                        <Tooltip title="Increase WPM"><Button onClick={this.increaseWpm}><IncreaseIcon /></Button></Tooltip>
                        <Tooltip title="Pause"><Button onClick={this.pauseDrill}><PauseIcon /></Button></Tooltip>
                        <Tooltip title="Stop"><Button onClick={this.stopDrill}><StopIcon /></Button></Tooltip>
                    </DrillControlGroup>

                    <DrillArea>
                        {this.state.pageNumber > 0 &&
                            <>
                                <ProgressLine progress={(this.state.pageNumber - 1) * 100 / this.state.pages.length} />
                                <Viewer {...this.props}
                                    page={this.state.pages[this.state.pageNumber - 1]}
                                    blockPosition={this.state.blockPosition}
                                    chunkPosition={this.state.chunkPosition}
                                    disableVisualRegression={this.props.disableVisualRegression}
                                    disableVisualProgression={this.props.disableVisualProgression}
                                    disableVisualProblemStyle={this.props.disableVisualProblemStyle}
                                />
                            </>
                        }
                    </DrillArea>

                </DrillScreen>
            </>
        );
    }

}

Drill.propTypes = {
    // Inherit properties
    ...Pager.propTypes,
    ...PagerTest.propTypes,
    ...Viewer.propTypes,

    /**
     * The content in the standard format to read.
     */
    content: PropTypes.object,
    /**
     * Which pager to use.
     */
    pagerMode: PropTypes.oneOf(pagerModes),
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
    // Inherit properties
    ...Pager.defaultProps,
    ...PagerTest.defaultProps,
    ...Viewer.defaultProps,

    pagerMode: "dom",
    onChunkChange: () => {},
    onComplete: () => {},
};

export default Drill;

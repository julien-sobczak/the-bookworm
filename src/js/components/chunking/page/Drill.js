import React from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import Pager from '../Pager';

import ProgressLine from '../../toolbox/ProgressLine';

import * as string from '../../../functions/string';
import * as wpm from '../../../functions/wpm';
import * as library from '../../../functions/library';
import * as time from '../../../functions/time';

class Drill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wpm: this.props.wpm,
            pages: undefined,
            pageNumber: 0,
            blockPosition: 0,
            chunkPosition: 0,
        };

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.stopDrill = this.stopDrill.bind(this);
        this.onPagerDone = this.onPagerDone.bind(this);
    }

    onPagerDone(pages) {
        console.log('Pages', pages);
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
        }

        this.handle = window.requestAnimationFrame(loop);

        this.setState(state => ({
            ...state,
            startDate: new Date(),
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
                        }));
                        return pageTurningDuration + wpm.textDuration(this.currentChunk(), this.state.wpm);
                    }
                } else {
                    // Move to next block
                    this.setState(state => ({
                        ...state,
                        blockPosition: state.blockPosition+1,
                        chunkPosition: 0,
                    }));
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
                    }));
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

    reportCompletion(stopped) {
        let readContent = this.props.content;
        let readPages = this.state.pages;
        const blockPosition = this.currentBlock().block;

        if (stopped) {
            // Need to calculate only the read portion
            readContent = library.extractContent(readContent, 0, blockPosition);
            readPages = readPages.slice(0, this.state.pageNumber);
        }
        const stats = {
            ...library.statsContent(readContent, time.duration(this.state.startDate)),
            ...library.statsPages(readPages),
        };

        this.props.onComplete({
            stopped: stopped,
            position: blockPosition,
            stats: stats,
        });
    }

    stopDrill() {
        this.reportCompletion(true);
    }

    render() {
        return (
            <div className={"FullScreen ChunkingDrillPage Theme" + string.capitalize(this.props.theme)}>

                <Pager content={this.props.content} onDone={this.onPagerDone}
                       {...this.props} />

                <section className="DrillControls">
                    <ul>
                        <li><button onClick={this.increaseWpm}><i className="material-icons">chevron_left</i></button></li>
                        <li><button onClick={this.reduceWpm}><i className="material-icons">chevron_right</i></button></li>
                        <li><button onClick={this.stopDrill}><i className="material-icons">stop</i></button></li>
                    </ul>
                </section>

                <section className="DrillArea">
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
                </section>
            </div>
        );
    }

}

Drill.propTypes = {
    ...Pager.propTypes,
    ...Viewer.propTypes,

    // The content to read
    content: PropTypes.object,

    // Callback when the user finishes the drill
    onComplete: PropTypes.func,
}

Drill.defaultProps = {
    ...Pager.defaultProps,
    ...Viewer.defaultProps,

    onComplete: function() {},
};

export default Drill;

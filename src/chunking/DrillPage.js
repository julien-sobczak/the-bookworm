import React from 'react';
import { Link } from "react-router-dom";
import Button from '@material/react-button';
import PropTypes from 'prop-types';
import Pager from './Pager';
import Paper from '../toolbox/Paper';

import '@material/react-icon-button/dist/icon-button.css';
import '@material/react-button/dist/button.css';

class DrillPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wpm: this.props.wpm,
            pages: undefined,
            pageNumber: 0,
            started: false,
            finished: false,
            blockPosition: 0,
            chunkPosition: 0,
        };

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.onPagerDone = this.onPagerDone.bind(this);
        this.start = this.start.bind(this);
    }

    onPagerDone(pages) {
        this.setState(state => ({
            ...state,
            pages: pages,
            pageNumber: 1,
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
                            started: false,
                            finished: true,
                        }));
                        return pageEndingDuration;
                    } else {
                        // Move to next page
                        this.setState(state => ({
                            ...state,
                            pageNumber: state.pageNumber+1,
                            blockPosition: 0,
                            chunkPosition: 0,
                        }));
                        return pageTurningDuration + DrillPage.chunkDuration(this.currentChunk(), this.state.wpm);
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

        return DrillPage.chunkDuration(this.currentChunk(), this.state.wpm);
    }

    currentChunk() {
        if (this.state.pageNumber <= 0) return undefined;
        const page = this.state.pages[this.state.pageNumber-1];
        if (this.state.blockPosition >= page.blocks.length) return undefined;
        const chunks = page.blocks[this.state.blockPosition].chunks;
        if (this.state.chunkPosition >= chunks.length) return undefined;
        return chunks[this.state.chunkPosition];
    }

    /**
     * Return how many milliseconds the user is allowed to read this chunk.
     * @param {string} chunk
     * @returns {number} The number of ms to wait before the next chunk
     */
    static chunkDuration(chunk, wpm) {
        if (!chunk) return 0;

        const characersPerWord = 5; // https://en.wikipedia.org/wiki/Words_per_minute

        // How to calculate the duration?
        // 150 words per minute = 150 * 5 characters per minute = 750 characters per minute
        // A chunk with 750 characters takes one minute to read.
        // A chunk with 75 characters takes six seconds to read.
        // and so on.

        // The minimum pause time of the eye is estimated to be about 200 msec.
        // The second component involves stimulus processing, estimated to require a minimum of 50 to 100 msec.
        // https://www.ncbi.nlm.nih.gov/pubmed/7406068
        const minimumEyeFixationDuration = 275;
        const theoricalChunkReadingDuration = (chunk.length * 60 * 1000) / (wpm * characersPerWord);
        return Math.max(minimumEyeFixationDuration, theoricalChunkReadingDuration);
    }

    start() {
        this.setState(state => ({
            ...state,
            started: true,
        }));

        this.clear();

        let delay = DrillPage.chunkDuration(this.currentChunk(), this.state.wpm);
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
    }

    reduceWpm() {
    }


    render() {
        return (
            <div className="FullScreen ChunkingDrillPage">

                <Link to="/chunking/" className="ButtonClose"><i className="material-icons">close</i></Link>

                <Pager content={this.props.content} onDone={this.onPagerDone} debug={true}
                       fontFamily={this.props.fontFamily}
                       fontSize={this.props.fontSize}
                       fontStyle={this.props.fontStyle}
                       backgroundColor={this.props.backgroundColor}
                       color={this.props.color}
                />

                <section className="DrillControls">
                    <ul>
                        <li><button onClick={this.increaseWpm}><i className="material-icons">chevron_left</i></button></li>
                        <li><button onClick={this.reduceWpm}><i className="material-icons">chevron_right</i></button></li>
                    </ul>
                </section>


                <section className="DrillArea">
                    {!this.state.started && <div className="Wizard">
                        <Button raised icon={<i className="material-icons">{this.state.playing ? 'pause_arrow' : 'play_arrow'}</i>} onClick={this.start}>
                            Read
                        </Button>
                    </div>}

                    {this.state.started && this.state.pageNumber > 0 &&
                        <Paper paperSize={this.props.paperSize}
                               fontFamily={this.props.fontFamily}
                               fontSize={this.props.fontSize}
                               fontStyle={this.props.fontStyle}
                               backgroundColor={this.props.backgroundColor}
                               color={this.props.color}>
                            {this.state.pages[this.state.pageNumber - 1].blocks.map((block, iBlock) => React.createElement(
                                block.tag,
                                {key: iBlock, className: (block.continuation ? 'Continuation' : '')},
                                block.chunks.map((chunk, iChunk) => {
                                    const selected = iBlock === this.state.blockPosition && iChunk === this.state.chunkPosition;
                                    return <span className={(chunk.trim() !== '' ? 'Chunk' : 'Space') + (selected ? ' Selected' : '')}
                                                key={iChunk}
                                                dangerouslySetInnerHTML={{__html: chunk}} />
                                })
                            ))}
                        </Paper>
                    }
                </section>
            </div>
        );
    }

}

DrillPage.propTypes = {
    ...Paper.propTypes,

    wpm: PropTypes.number,
    pageTurningDuration: PropTypes.number, // ms
    chunkWidth: PropTypes.string,
    chunkAccuracy: PropTypes.number,
}

DrillPage.defaultProps = {
    ...Paper.defaultProps,

    wpm: 500,
    pageTurningDuration: 500,

    chunkWidth: '2in',
    chunkAccuracy: 0.9,

    // TODO Remove
    fontSize: '16pt',
};

export default DrillPage;

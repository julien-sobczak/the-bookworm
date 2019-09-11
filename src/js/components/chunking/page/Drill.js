import React from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer'
import Pager from '../Pager';
import { chunkDuration } from '../../../functions/wpm';

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
        this.onPagerDone = this.onPagerDone.bind(this);
    }

    onPagerDone(pages) {
        console.log('Pages', pages);
        this.setState(state => ({
            ...state,
            pages: pages,
            pageNumber: 1,
        }));
    }

    componentDidMount() {
        this.start();
    }

    componentWillUnmount() {
        this.clear();
    }

    start() {
        this.clear();

        const startingPause = 500;
        let delay = startingPause + chunkDuration(this.currentChunk(), this.state.wpm);
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
                        const stats = {};
                        this.props.onComplete(stats);
                        return pageEndingDuration;
                    } else {
                        // Move to next page
                        this.setState(state => ({
                            ...state,
                            pageNumber: state.pageNumber+1,
                            blockPosition: 0,
                            chunkPosition: 0,
                        }));
                        return pageTurningDuration + chunkDuration(this.currentChunk(), this.state.wpm);
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

        return chunkDuration(this.currentChunk(), this.state.wpm);
    }

    currentChunk() {
        if (this.state.pageNumber <= 0) return undefined;
        const page = this.state.pages[this.state.pageNumber-1];
        if (this.state.blockPosition >= page.blocks.length) return undefined;
        const chunks = page.blocks[this.state.blockPosition].chunks;
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


    render() {
        return (
            <div className="FullScreen ChunkingDrillPage">

                <Pager content={this.props.content} onDone={this.onPagerDone}
                       {...this.props} />

                <section className="DrillControls">
                    <ul>
                        <li><button onClick={this.increaseWpm}><i className="material-icons">chevron_left</i></button></li>
                        <li><button onClick={this.reduceWpm}><i className="material-icons">chevron_right</i></button></li>
                    </ul>
                </section>

                <section className="DrillArea">
                    {this.state.pageNumber > 0 &&
                        <Viewer {...this.props}
                            page={this.state.pages[this.state.pageNumber - 1]}
                            blockPosition={this.state.blockPosition}
                            chunkPosition={this.state.chunkPosition}
                            disableVisualRegression={this.props.disableVisualRegression}
                            disableVisualProgression={this.props.disableVisualProgression}
                            disableVisualProblemStyle={this.props.disableVisualProblemStyle}
                             />
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
    content: PropTypes.object.isRequired,

    wpm: PropTypes.number,
    pageTurningDuration: PropTypes.number, // ms

    // Callback when the user finishes the drill
    onComplete: PropTypes.func,
}

Drill.defaultProps = {
    ...Pager.defaultProps,
    ...Viewer.defaultProps,

    wpm: 4000,
    pageTurningDuration: 500,

    onComplete: function() {},
};

export default Drill;
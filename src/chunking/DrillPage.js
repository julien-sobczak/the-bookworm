import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Pager from './Pager';
import Paper from '../toolbox/Paper';
import { chunkDuration } from '../toolbox/WPM';
import { capitalize } from '../toolbox/Fn';
import PageContent from '../toolbox/PageContent';
import MainButton from '../toolbox/MainButton';

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
        console.log('Pages', pages);
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

    start() {
        this.setState(state => ({
            ...state,
            started: true,
        }));

        this.clear();

        let delay = chunkDuration(this.currentChunk(), this.state.wpm);
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

    getDrillClassNames() {
        const classNames = [];
        if (this.props.disableVisualRegression) {
            classNames.push('DisableVisualRegression');
        }
        if (this.props.disableVisualProgression) {
            classNames.push('DisableVisualProgression');
        }
        classNames.push('DisableVisualProblemStyle' + capitalize(this.props.disableVisualProblemStyle));
        return classNames;
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
                        <li><Link to="/chunking/"><i className="material-icons">close</i></Link></li>
                    </ul>
                </section>


                <section className={"DrillArea " + this.getDrillClassNames().join(' ')}>
                    {!this.state.started && <div className="Wizard">
                        <MainButton text="Click Me" onClick={this.start} />
                    </div>}

                    {this.state.started && this.state.pageNumber > 0 &&
                        <Paper {...this.props}>
                            <PageContent page={this.state.pages[this.state.pageNumber - 1]}
                                         blockPosition={this.state.blockPosition}
                                         chunkPosition={this.state.chunkPosition} />
                        </Paper>
                    }
                </section>
            </div>
        );
    }

}

DrillPage.propTypes = {
    ...Pager.propTypes,

    wpm: PropTypes.number,
    pageTurningDuration: PropTypes.number, // ms

    // Hide/Show the text in front of the current chunk
    disableVisualRegression: PropTypes.bool,
    // Hide/Show the text behind the current chunk
    disableVisualProgression: PropTypes.bool,
    // How the hidden text controlled by `disableVisualRegression`
    // and `disableVisualProgression` should be displayed
    disableVisualProblemStyle: PropTypes.string,
}

DrillPage.defaultProps = {
    ...Pager.defaultProps,

    wpm: 1000,
    pageTurningDuration: 500,

    disableVisualRegression: false,
    disableVisualProgression: false,
    disableVisualProblemStyle: "fade", // Can be `transparent`, `fade`, or `blur`

    // TODO Remove
    fontSize: '16pt',
};

export default DrillPage;

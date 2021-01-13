import React from 'react';
import PropTypes from 'prop-types';

import PreviousIcon from '@material-ui/icons/ChevronLeft';
import NextIcon from '@material-ui/icons/ChevronRight';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import Viewer from './Viewer';
import Pager, { PagerTest } from '../chunking/Pager';

import { ScreenDrill } from '../core/UI';
import ProgressLine from '../toolbox/ProgressLine';
import PauseOverlay from '../toolbox/PauseOverlay';

import * as interaction from '../../functions/interaction';
import * as string from '../../functions/string';
import * as wpm from '../../functions/wpm';
import * as library from '../../functions/library';
import * as engine from '../../functions/engine';

// Values for property pagerMode.
const pagerModes = ['dom', 'fixed'];

class Drill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pages: undefined,
            pageNumber: 0,
            timer: new engine.Timer(),
            paused: false,
        };

        this.turnPage = this.turnPage.bind(this);
        this.turnPageBack = this.turnPageBack.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onPagerDone = this.onPagerDone.bind(this);

        // State
        this.pauseDrill = this.pauseDrill.bind(this);
        this.resumeDrill = this.resumeDrill.bind(this);
        this.stopDrill = this.stopDrill.bind(this);

        this.start = this.start.bind(this);
        this.restart = this.restart.bind(this);
        this.reportCompletion = this.reportCompletion.bind(this);
    }

    onPagerDone(pages) {
        this.setState(state => ({
            ...state,
            pages: pages,
            pageNumber: 1,
            pagesDuration: this.calculateWpm(pages),
            winner: undefined, // used when racing with the pacer
        }), this.start);
    }

    start() {
        this.restart(); // Start the game
        this.state.timer.start();
    }

    calculateWpm(pages) {
        const durations = [];
        pages.forEach(page => {
            let duration = 0;
            page.blocks.forEach(block => {
                duration += wpm.textDuration(block.content, this.props.pacerWpm);
            });
            durations.push(duration);
        });
        return durations;
    }

    /**
     * Estimates on which page the pacer is currently reading.
     * (Based on the pages durations calculated at the start of the drill)
     *
     * @param {Number} elapsedDuration Drill current elapsed duration in ms
     * @return {Number} The page number of the pacer
     */
    getPacerPageNumber(elapsedDuration) {
        let total = 0;
        for (let i = 0; i < this.state.pagesDuration.length; i++) {
            total += this.state.pagesDuration[i];
            if (elapsedDuration < total) {
                return i+1; // Pages are 1-based indices
            }
        }
        // Otherwise, the pacer is already at the end and we return the last page number
        return this.state.pagesDuration.length;
    }

    restart() {
        this.props.onStart({
            pages: this.state.pages.length,
        });

        // GameStopWatch
        if (this.props.timer > 0) {
            let loop = () => {
                if (!this.handle) return;

                // Check for timer expiration
                if (this.state.timer.started() && this.props.timer > 0) {
                    // IMPROVEMENT ask the user to click on the last read block instead of ignore the whole current page
                    if (this.state.timer.elapsedDurationInMs() > this.props.timer * 60 * 1000) { // min => ms
                        this.reportCompletion(true);
                        return;
                    }
                }
                this.handle = window.requestAnimationFrame(loop);
            };
            this.handle = window.requestAnimationFrame(loop);

            return;
        }

        // GamePacer
        if (this.props.pacerWpm > 0) {
            let loop = () => {
                if (!this.handle) return;

                const userPageNumber = this.state.pageNumber;
                const pacerPageNumber = this.getPacerPageNumber(this.state.timer.elapsedDurationInMs());

                const difference = userPageNumber - pacerPageNumber;
                if (difference >= 2) {
                    // The user win
                    this.setState(state => ({
                        ...state,
                        winner: true,
                    }), () => this.reportCompletion(true));
                    return;
                } else if (difference <= -2) {
                    // The pacer win
                    this.setState(state => ({
                        ...state,
                        winner: false,
                    }), () => this.reportCompletion(true));
                    return;
                }

                this.handle = window.requestAnimationFrame(loop);
            };
            this.handle = window.requestAnimationFrame(loop);
        }
        return;
    }

    currentPage() {
        if (this.state.pageNumber <= 0) return undefined;
        return this.state.pages[this.state.pageNumber - 1];
    }

    turnPage(event) {
        if (this.state.pageNumber === this.state.pages.length) {
            this.reportCompletion(false);
        }
        this.setState(state => ({
            ...state,
            pageNumber: state.pageNumber + 1,
        }));
        if (event) event.stopPropagation();
    }

    turnPageBack(event) {
        if (this.state.pageNumber === 1) return;
        this.setState(state => ({
            ...state,
            pageNumber: state.pageNumber - 1,
        }));
        if (event) event.stopPropagation();
    }

    clear() {
        if (this.handle) {
            clearInterval(this.handle);
            this.handle = null;
        }
    }

    reportCompletion(stopped) {
        this.clear();
        this.state.timer.stop();

        let readContent = this.props.content;
        let readPages = this.state.pages;
        const blockPosition = this.currentPage().blocks[0].block; // Ignore all blocks on the current page

        if (stopped) {
            // Need to calculate only the read portion
            readContent = library.extractContent(readContent, 0, blockPosition);
            readPages = readPages.slice(0, this.state.pageNumber);
        }
        const stats = {
            ...library.statsContent(readContent, parseInt(this.state.timer.durationInMs() / 1000)),
            ...library.statsPages(readPages),
        };

        const result = {
            stopped: stopped,
            position: blockPosition,
            stats: stats,
        };

        if (this.props.pacerWpm > 0) {
            result.stats.winner = this.state.winner;
        }

        this.props.onComplete(result);
    }

    pauseDrill(event) {
        event.stopPropagation();
        this.setState({
            paused: true,
        });
        this.clear();
        this.state.timer.pause();
    }

    resumeDrill(event) {
        event.stopPropagation();
        this.setState({
            paused: false,
        });
        this.restart();
        this.state.timer.resume();
    }

    stopDrill(event) {
        event.stopPropagation();
        this.reportCompletion(true);
    }

    render() {
        return (
            <>
                {this.state.paused && <PauseOverlay onResume={this.resumeDrill} />}

                {this.props.pagerMode === 'dom'   && <Pager     content={this.props.content} onDone={this.onPagerDone} chunkMode="none" />}
                {this.props.pagerMode === 'fixed' && <PagerTest content={this.props.content} onDone={this.onPagerDone} chunkMode="none" />}

                <ScreenDrill className={"DrillPractice Theme" + string.capitalize(this.props.theme)} onClick={this.handleClick}>

                    <section className="DrillControls">
                        <ul>
                            <li><Tooltip title="Previous page"><Button onClick={this.turnPageBack}><PreviousIcon /></Button></Tooltip></li>
                            <li><Tooltip title="Next page"><Button onClick={this.turnPage}><NextIcon /></Button></Tooltip></li>
                            <li><Tooltip title="Pause"><Button onClick={this.pauseDrill}><PauseIcon /></Button></Tooltip></li>
                            <li><Tooltip title="Stop"><Button onClick={this.stopDrill}><StopIcon /></Button></Tooltip></li>
                        </ul>
                    </section>

                    <section className="DrillArea">
                        {this.state.pageNumber > 0 &&
                            <>
                                <ProgressLine progress={(this.state.pageNumber - 1) * 100 / this.state.pages.length} />
                                <Viewer {...this.props} page={this.state.pages[this.state.pageNumber - 1]} />
                            </>
                        }
                    </section>
                </ScreenDrill>
            </>
        );
    }

    handleClick(event) {
        switch (interaction.getScreenZone(event)) {
        case interaction.ZONE_LEFT:
            this.turnPageBack();
            break;
        case interaction.ZONE_RIGHT:
            this.turnPage();
            break;
        default:
            // Do nothing
            break;
        }
    }

    handleKeyUp(event) {
        switch (event.keyCode) {
        case interaction.KEY_LEFT:
            this.turnPageBack();
            return;
        case interaction.KEY_RIGHT:
            this.turnPage();
            return;
        default:
            // Ignore other keys
            return;
        }
    }

    componentDidMount() {
        window.addEventListener("keyup", this.handleKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener("keyup", this.handleKeyUp);
    }

}

Drill.propTypes = {
    ...Pager.propTypes,
    ...PagerTest.propTypes,
    ...Viewer.propTypes,

    // The content to read
    content: PropTypes.object,

    // Callback triggered when the drill really start
    onStart: PropTypes.func,

    // Callback when the user finishes the drill
    onComplete: PropTypes.func,

    // Which pager to use
    pagerMode: PropTypes.oneOf(pagerModes),
};

Drill.defaultProps = {
    ...Pager.defaultProps,
    ...PagerTest.defaultProps,
    ...Viewer.defaultProps,

    pagerMode: "dom",
    onStart: () => {},
    onComplete: () => {},
};

export default Drill;

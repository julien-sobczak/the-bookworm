import React from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import Pager from '../chunking/Pager';

import ProgressLine from '../toolbox/ProgressLine';

import * as interaction from '../../functions/interaction';
import * as string from '../../functions/string';
import * as wpm from '../../functions/wpm';
import * as library from '../../functions/library';
import * as time from '../../functions/time';

class Drill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pages: undefined,
            pageNumber: 0,
        };

        this.turnPage = this.turnPage.bind(this);
        this.turnPageBack = this.turnPageBack.bind(this);
        this.stopDrill = this.stopDrill.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onPagerDone = this.onPagerDone.bind(this);
    }

    onPagerDone(pages) {
        console.log('Pages', pages);
        this.setState(state => ({
            ...state,
            pages: pages,
            pageNumber: 1,
            pagesDuration: this.calculateWpm(pages),
            startDate: new Date(),
            winner: undefined, // use when racing with the pacer
        }), this.start);
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

    start() {
        if (this.props.timer > 0) {
            // IMPROVEMENT ask the user to click on the last read block instead of ignore the whole current page
            setTimeout(() => this.reportCompletion(true), this.props.timer * 60 * 1000); // convert minutes -> ms
        }
        if (this.props.pacerWpm > 0) {
            let start = new Date().getTime();
            let loop = () => {
                if (!this.handle) return;
                const current = new Date().getTime();
                const elapsedDuration = current - start;

                // [60s, 45s, 30s, 60s, 70s]
                // Elapsed time 200s and 3rd page

                const userPageNumber = this.state.pageNumber;
                const pacerPageNumber = this.getPacerPageNumber(elapsedDuration);

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

        let readContent = this.props.content;
        let readPages = this.state.pages;
        const blockPosition = this.currentPage().blocks[0].block; // Ignore all blocks on the current page

        if (stopped) {
            // Need to calculate only the read portion
            readContent = library.extractContent(readContent, 0, blockPosition);
            readPages = readPages.slice(0, this.state.pageNumber);
        }
        const stats = {
            ...library.statsContent(readContent, time.duration(this.state.startDate)),
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

    stopDrill() {
        this.reportCompletion(true);
    }

    render() {
        return (
            <div className={"FullScreen DrillPractice Theme" + string.capitalize(this.props.theme)} onClick={this.handleClick}>

                <Pager content={this.props.content} onDone={this.onPagerDone} chunkMode="none" />

                <section className="DrillControls">
                    <ul>
                        <li><button onClick={this.turnPageBack}><i className="material-icons">chevron_left</i></button></li>
                        <li><button onClick={this.turnPage}><i className="material-icons">chevron_right</i></button></li>
                        <li><button onClick={this.stopDrill}><i className="material-icons">stop</i></button></li>
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
            </div>
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
    ...Viewer.propTypes,

    // The content to read
    content: PropTypes.object,

    // Callback when the user finishes the drill
    onComplete: PropTypes.func,
};

Drill.defaultProps = {
    ...Viewer.defaultProps,

    onComplete: function () { },
};

export default Drill;

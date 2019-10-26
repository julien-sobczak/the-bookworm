import React from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer'
import Pager from '../../chunking/Pager';

import ProgressLine from '../../toolbox/ProgressLine';

import * as library from '../../../functions/library';
import * as time from '../../../functions/time';

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
            startDate: new Date(),
        }));
    }

    currentPage() {
        if (this.state.pageNumber <= 0) return undefined;
        return this.state.pages[this.state.pageNumber-1];
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

    reportCompletion(stopped) {
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
            <div className="FullScreen ChunkingDrillPage" onClick={this.handleClick}>

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
        const width = window.innerWidth;
        const clickX = event.clientX;
        // If the user clicks on the left part of the screen => go back
        // If the user clicks on the right part of the screen => go forward
        if (clickX < 0.4 * width) {
            this.turnPageBack();
        } else if (clickX > 0.6 * width) {
            this.turnPage();
        }
    }
    
    handleKeyUp(event) {	
        switch (event.keyCode) {
            case 37: // Key left
                this.turnPageBack();
                return;
            case 39: // Key right
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
}

Drill.defaultProps = {
    ...Viewer.defaultProps,

    onComplete: function() {},
};

export default Drill;

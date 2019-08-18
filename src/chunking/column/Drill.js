import React from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import Chunker from '../Chunker';
import { chunkDuration } from '../../toolbox/WPM';
import * as helpers from '../../toolbox/EngineHelpers';
import Measurer from '../../toolbox/Measurer';

class Drill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wpm: this.props.wpm,
            chunks: undefined,
            chunkPosition: -1,
        };

        this.columnsElement = React.createRef();

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.onChunkerDone = this.onChunkerDone.bind(this);
        this.onMeasurementsChange = this.onMeasurementsChange.bind(this);
    }

    onChunkerDone(chunks) {
        console.log('Chunks', chunks);
        this.setState(state => ({
            ...state,
            chunks: chunks,
            chunkPosition: -1,
            chunksOnScreen: undefined,
            chunkPositionOnScreen: -1,
        }));
    }

    start() {
        const chunkHeight = this.state.measurements[this.props.chunkWidth].height;
        const [, columnsHeight] = this.columnsDimensions();

        let linesMax = (this.props.linesMax) ? this.props.linesMax : 999;
        const lines = Math.min(linesMax, Math.floor(columnsHeight / (1.5*chunkHeight)));

        const chunksOnScreenCount = Math.min(this.state.chunks.length, lines * this.props.columns);
        const chunksOnScreen = this.state.chunks.slice(0, chunksOnScreenCount);

        this.setState(state => ({
            ...state,
            lines: lines,
            chunksOnScreen: chunksOnScreen,
            chunksOnScreenCount: chunksOnScreenCount,
        }));

        this.clear();

        const startingPause = 500;
        let delay = startingPause + this.advanceChunk();
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
        if (this.state.chunks.length === 0) return;

        const drillEndingDuration = 1000;
        const chunkPosition = this.state.chunkPosition;
        const chunks = this.state.chunks;
        const chunkPositionOnScreen = this.state.chunkPositionOnScreen;
        const chunksOnScreenCount = this.state.chunksOnScreenCount;

        if (chunkPosition+1 === chunks.length) {
             // Finish
             this.setState(state => ({
                ...state,
                chunkPosition: 0,
            }));
            const stats = {};
            this.props.onComplete(stats);
            return drillEndingDuration;
        }
        if (chunkPositionOnScreen + 1 === chunksOnScreenCount) {
            // New "page"
            const newChunkPosition = chunkPosition + 1;
            const chunksOnScreen = this.state.chunks.slice(newChunkPosition, newChunkPosition+chunksOnScreenCount);

            this.setState(state => ({
                ...state,
                chunksOnScreen: chunksOnScreen,
                chunkPosition: newChunkPosition,
                chunkPositionOnScreen: 0,
            }));

            return chunkDuration(this.chunkAt(newChunkPosition).text, this.state.wpm);
        } else {
            // Move to next chunk
            const newChunkPosition = chunkPosition + 1;
            this.setState(state => ({
                ...state,
                chunkPosition: newChunkPosition,
                chunkPositionOnScreen: state.chunkPositionOnScreen+1,
            }));
            return chunkDuration(this.chunkAt(newChunkPosition).text, this.state.wpm);
        }
    }

    chunkAt(position) {
        if (position < 0 || position >= this.state.chunks.length) return undefined;
        return this.state.chunks[position];
    }

    currentChunk() {
        return this.chunkAt(this.state.chunkPosition);
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

    columnsDimensions() {
        let element = this.columnsElement.current;
        if (!element) return [undefined, undefined];

        let width = element.clientWidth; // Convert the chunk size from inches to pixels
        let height = element.clientHeight; // Convert the chunk size from inches to pixels

        return [width, height];
    }

    onMeasurementsChange(measurements) {
        this.setState(state => ({
            ...state,
            measurements: measurements,
        }));
        this.initialized = true;
    }

    render() {
        const columnWidthOnScreen = (this.props.chunkMode === 'dynamic') ?
            helpers.increaseSpan(this.props.chunkWidthMax) :
            helpers.increaseSpan(this.props.columnWidth)

        return (
            <div className={"FullScreen DrillColumn Centered"}>

                <Measurer fontFamily={this.props.fontFamily} fontSize={this.props.fontSize} fontStyle={this.props.fontStyle} onChange={this.onMeasurementsChange} />

                <Chunker content={this.props.content} onDone={this.onChunkerDone}
                       {...this.props}
                />

                <section className="DrillControls">
                    <ul>
                        {this.props.speedControls && <li><button onClick={this.increaseWpm}><i className="material-icons">chevron_left</i></button></li>}
                        {this.props.speedControls && <li><button onClick={this.reduceWpm}><i className="material-icons">chevron_right</i></button></li>}
                    </ul>
                </section>

                <section className="DrillArea" ref={this.columnsElement}>

                    {this.state.chunksOnScreen &&
                        <Viewer {...this.props}
                                chunks={this.state.chunksOnScreen}
                                chunkPosition={this.state.chunkPositionOnScreen}
                                columns={this.props.columns}
                                columnWidth={columnWidthOnScreen} />
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
    ...Chunker.propTypes,

    // The content to read
    content: PropTypes.object.isRequired,

    // WPM
    wpm: PropTypes.number,

    // Displays controls to vary the span between columns
    speedControls: PropTypes.bool,

    // How many lines?
    linesMax: PropTypes.number,

    // Callback when the user finishes the drill
    onComplete: PropTypes.func,
}

Drill.defaultProps = {
    ...Chunker.defaultProps,

    wpm: 500,
    speedControls: true,
    linesMax: undefined,

    onComplete: function() {},
};

export default Drill;

import React from 'react';
import PropTypes from 'prop-types';

import ReduceIcon from '@material-ui/icons/ChevronLeft';
import IncreaseIcon from '@material-ui/icons/ChevronRight';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import Viewer from './Viewer';
import Chunker from '../Chunker';

import ProgressLine from '../../toolbox/ProgressLine';
import Measurer from '../../toolbox/Measurer';
import PauseOverlay from '../../toolbox/PauseOverlay';

import * as string from '../../../functions/string';
import * as wpm from '../../../functions/wpm';
import * as engine from '../../../functions/engine';
import * as library from '../../../functions/library';

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

        this.columnsElement = React.createRef();

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.onChunkerDone = this.onChunkerDone.bind(this);
        this.onMeasurementsChange = this.onMeasurementsChange.bind(this);

        // State
        this.pauseDrill = this.pauseDrill.bind(this);
        this.resumeDrill = this.resumeDrill.bind(this);
        this.stopDrill = this.stopDrill.bind(this);

        this.state.timer.start();
    }

    onChunkerDone(chunks) {
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
            this.reportCompletion(false);
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
            }), this.reportChunkChange);

            return wpm.textDuration(this.chunkAt(newChunkPosition).text, this.state.wpm);
        } else {
            // Move to next chunk
            const newChunkPosition = chunkPosition + 1;
            this.setState(state => ({
                ...state,
                chunkPosition: newChunkPosition,
                chunkPositionOnScreen: state.chunkPositionOnScreen+1,
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
            chunkPositionOnScreen: this.state.chunkPositionOnScreen,
            chunk: this.currentChunk(),
        });
    }

    reportCompletion(stopped) {
        this.state.timer.stop();
        const blockPosition = this.currentChunk().block;

        let readContent = this.props.content;
        let readChunks = this.state.chunks;
        if (stopped) {
            // Need to stop where the reader has stop
            readContent = library.extractContent(readContent, 0, blockPosition);
            readChunks = readChunks.slice(0, this.state.chunkPosition);
        }

        const stats = {
            ...library.statsContent(readContent, this.state.timer.durationInSeconds()),
            ...library.statsChunks(readChunks),
        };

        this.props.onComplete({
            stopped: stopped,
            position: blockPosition,
            stats: stats,
        });
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
            engine.increaseSpan(this.props.chunkWidthMax) :
            engine.increaseSpan(this.props.columnWidth);

        return (
            <>
                {this.state.paused && <PauseOverlay onResume={this.resumeDrill} />}
                <div className={"FullScreen DrillColumn Centered Theme" + string.capitalize(this.props.theme)}>

                    <Measurer fontFamily={this.props.fontFamily} fontSize={this.props.fontSize} fontStyle={this.props.fontStyle} onChange={this.onMeasurementsChange} />

                    <Chunker content={this.props.content} onDone={this.onChunkerDone}
                        {...this.props}
                    />

                    <section className="DrillControls">
                        <ul>
                            <li><Tooltip title="Reduce WPM"><Button onClick={this.reduceWpm}><ReduceIcon /></Button></Tooltip></li>
                            <li><Tooltip title="Increase WPM"><Button onClick={this.increaseWpm}><IncreaseIcon /></Button></Tooltip></li>
                            <li><Tooltip title="Pause"><Button onClick={this.pauseDrill}><PauseIcon /></Button></Tooltip></li>
                            <li><Tooltip title="Stop"><Button onClick={this.stopDrill}><StopIcon /></Button></Tooltip></li>
                        </ul>
                    </section>

                    <section className="DrillArea" ref={this.columnsElement}>

                        {this.state.chunksOnScreen &&
                            <>
                                <ProgressLine progress={this.state.chunkPosition * 100 / this.state.chunks.length} />
                                <Viewer {...this.props}
                                    chunks={this.state.chunksOnScreen}
                                    chunkPosition={this.state.chunkPositionOnScreen}
                                    columns={this.props.columns}
                                    columnWidth={columnWidthOnScreen} />
                            </>
                        }

                    </section>

                </div>
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
    ...Chunker.propTypes,

    // The content to read
    content: PropTypes.object,

    // Callback when a chunk is updated
    onChunkChange: PropTypes.func,

    // Callback when the user finishes the drill
    onComplete: PropTypes.func,
};

Drill.defaultProps = {
    ...Chunker.defaultProps,
    ...Viewer.defaultProps,

    onChunkChange: () => {},
    onComplete: () => {},
};

export default Drill;

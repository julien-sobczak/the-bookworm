import React from 'react';
import { Link } from "react-router-dom";
import Button from '@material/react-button';
import PropTypes from 'prop-types';
import Chunker from './Chunker'
import Styled from '../toolbox/Styled';
import { chunkDuration } from '../toolbox/WPM';
import Measurer from '../toolbox/Measurer';

import '@material/react-icon-button/dist/icon-button.css';
import '@material/react-button/dist/button.css';

class DrillChunkColumn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wpm: this.props.wpm,
            chunks: undefined,
            chunkPosition: -1,
            started: false,
            finished: false,
        };

        this.columnsElement = React.createRef();

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.onChunkerDone = this.onChunkerDone.bind(this);
        this.onMeasurementsChange = this.onMeasurementsChange.bind(this);
        this.start = this.start.bind(this);
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

        const lines = Math.min(this.props.linesMax, Math.floor(columnsHeight / (1.5*chunkHeight)));

        const chunksOnScreenCount = Math.min(this.state.chunks.length, lines * this.props.columns);
        const chunksOnScreen = this.state.chunks.slice(0, chunksOnScreenCount);

        this.setState(state => ({
            ...state,
            started: true,
            lines: lines,
            chunksOnScreen: chunksOnScreen,
            chunksOnScreenCount: chunksOnScreenCount,
        }));

        this.clear();

        let delay = this.advanceChunk();
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

        if (this.state.chunksOnScreenCount)

        if (chunkPosition+1 === chunks.length) {
             // Finish
             this.setState(state => ({
                ...state,
                chunkPosition: 0,
                started: false,
                finished: true,
            }));
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
    }

    render() {
        const styles = { // FIXME move in stylesheet
            "display": "grid",
            "height": "100vh",
            "placeItems": "center center",
        }

        const chunks = [];
        let columnsStyle = {};
        if (this.state.started) {
            this.state.chunksOnScreen.forEach((c, index) => {
                const additionalClasses = [];
                if (index === this.state.chunkPositionOnScreen) {
                    additionalClasses.push('Selected');
                }
                chunks.push(<div key={index}><span className={"Chunk " + additionalClasses.join(' ')} dangerouslySetInnerHTML={{__html: c.text}} /></div>);
            });

            const columnWidthOnScreen = (this.props.chunkMode === 'dynamic') ?
                Measurer.nextSpan(this.props.chunkWidthMax) :
                Measurer.nextSpan(this.props.columnWidth)

            columnsStyle = {
                width: "100%",
                height: "100%",
                gridTemplateColumns: (columnWidthOnScreen + ' ').repeat(this.props.columns),
            };
        }

        return (
            <div className={"FullScreen ChunkingDrillChunkColumn"} style={styles}>

                <Measurer fontFamily={this.props.fontFamily} fontSize={this.props.fontSize} fontStyle={this.props.fontStyle} onChange={this.onMeasurementsChange} />

                <Chunker content={this.props.content} onDone={this.onChunkerDone}
                       {...this.props}
                />

                <section className="DrillControls">
                    <ul>
                        {this.props.speedControls && <li><button onClick={this.increaseWpm}><i className="material-icons">chevron_left</i></button></li>}
                        {this.props.speedControls && <li><button onClick={this.reduceWpm}><i className="material-icons">chevron_right</i></button></li>}
                        <li><Link to="/chunking/"><i className="material-icons">close</i></Link></li>
                    </ul>
                </section>

                <section className="DrillArea" ref={this.columnsElement}>

                    {!this.state.started &&
                        <div className="Wizard">
                            <Button raised icon={<i className="material-icons">{this.state.playing ? 'pause_arrow' : 'play_arrow'}</i>} onClick={this.start}>
                                Read
                            </Button>
                        </div>
                    }

                    {this.state.started &&
                        <Styled {...this.props} className="Columns" style={columnsStyle}>
                            {chunks}
                        </Styled>}

                </section>

            </div>
        );
    }

}

DrillChunkColumn.propTypes = {
    ...Chunker.propTypes,

    // WPM
    wpm: PropTypes.number,

    // Displays controls to vary the span between columns
    speedControls: PropTypes.bool,

    // How many columns?
    columns: PropTypes.number,
    columnWidth: PropTypes.string,

    // How many lines?
    linesMax: PropTypes.number,
}

DrillChunkColumn.defaultProps = {
    ...Chunker.defaultProps,
    wpm: 500,
    speedControls: true,
    columns: 2,
    columnWidth: "2.5in",
    linesMax: undefined,
};

export default DrillChunkColumn;

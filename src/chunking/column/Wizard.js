import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../toolbox/Button';
import Stylizer from '../../toolbox/Stylizer';
import * as helpers from '../../functions/engine';

import Drill from './Drill';
import Viewer from './Viewer';

class Wizard extends React.Component {

    PREDEFINED_DRILLS = [
        {
            name: "2-columns narrow",
            difficulty: 0,
            options: { columns: 2, chunkMode: "width", chunkWidth: "1.25in", columnWidth: "1.5in" },
        },
        {
            name: "3-columns narrow",
            difficulty: 0,
            options: { columns: 3, chunkMode: "width", chunkWidth: "1.25in", columnWidth: "1.5in" },
        },
        {
            name: "2-columns wide",
            difficulty: 1,
            options: { columns: 2, chunkMode: "width", chunkWidth: "1.75in", columnWidth: "2in" },
        },
        {
            name: "3-columns wide",
            difficulty: 1,
            options: { columns: 3, chunkMode: "width", chunkWidth: "1.75in", columnWidth: "2in" },
        },
    ];

    DEFAULT_DRILL = this.PREDEFINED_DRILLS[0];

    constructor(props) {
        super(props);

        this.state = {
            // Copy drill options
            wpm: props.wpm,
            columns: props.columns,
            columnWidth: props.columnWidth,
            linesMax: props.linesMax,
            speedControls: props.speedControls,

            // chunker options
            chunkStyle: props.chunkStyle,
            chunkMode: props.chunkMode,
            // chunkMode = "width"
            chunkWidth: props.chunkWidth,
            chunkAccuracy: props.chunkAccuracy,
            // chunkMode = "words"
            chunkWords: props.chunkWords,
            // chunkMode = "dynamic"
            chunkWidthMin: props.chunkWidthMin,
            chunkWidthMax: props.chunkWidthMax,
            chunkTransition: props.chunkTransition,
            chunkSteps: props.chunkSteps,

            // Copy styling settings as state to update during a drill session
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.fontStyle,
            backgroundColor: props.backgroundColor,
            color: props.color,
        };

        this.state.chunks = this.generateChunks(this.state);

        this.handleChunkModeChange = this.handleChunkModeChange.bind(this);
        this.handleChunkWidthChange = this.handleChunkWidthChange.bind(this);
        this.handleChunkWordsChange = this.handleChunkWordsChange.bind(this);
        this.handleChunkWidthMinChange = this.handleChunkWidthMinChange.bind(this);
        this.handleChunkWidthMaxChange = this.handleChunkWidthMaxChange.bind(this);
        this.handleChunkTransitionChange = this.handleChunkTransitionChange.bind(this);
        this.handleChunkStepsChange = this.handleChunkStepsChange.bind(this);
        this.handleChunkStyleChange = this.handleChunkStyleChange.bind(this);

        this.handleWpmChange = this.handleWpmChange.bind(this);
        this.handleColumnsChange = this.handleColumnsChange.bind(this);
        this.handleColumnWidthChange = this.handleColumnWidthChange.bind(this);
        this.handleLinesMaxChange = this.handleLinesMaxChange.bind(this);

        this.usePredefinedDrill = this.usePredefinedDrill.bind(this);

        this.handleStyleChanged = this.handleStyleChanged.bind(this);
        this.handleValidateClick = this.handleValidateClick.bind(this);
    }

    generateChunks(newState) {
        const chunks = function(text) {
            // Only 5 lines on screen
            const linesMax = 5;

            // If it is only one word, duplicate the word on all lines
            if (!Array.isArray(text)) {
                const arr = new Array(linesMax);
                arr.fill(text);
                text = arr;
            }

            // Repeat the same column
            const texts = [];
            for (let l = 0; l < linesMax; l++) {
                for (let c = 0; c < newState.columns; c++) {
                    texts.push(text[l]);
                }
            }

            // Convert to chunk format
            const results = [];
            for (let t = 0; t < texts.length; t++) {
                results.push({
                    text: texts[t],
                    startingChunk: false,
                    endingChunk: false,
                });
            }
            return results;
        };

        switch (newState.chunkMode) {
            case "width":
                const length = helpers.SPANS.indexOf(newState.chunkWidth);
                const subtext = 'o'.repeat(length);
                return chunks(`l${subtext}ng`);
            case "dynamic":
                return chunks(["A", "text", "becoming", "larger as we", "progress on the column"]);
            default:
                throw new Error(`${newState.chunkMode} is not implemented.`);
        }
    }

    /** Called when the user update the settings. */
    handleStyleChanged = (event) => {
        const newFontFamily = event.fontFamily;
        const newFontSize = event.fontSize;
        const newFontStyle = event.fontStyle;
        const newBackgroundColor = event.backgroundColor;
        const newColor = event.color;
        this.setState(state => ({
            ...state,
            fontFamily: newFontFamily,
            fontSize: newFontSize,
            fontStyle: newFontStyle,
            backgroundColor: newBackgroundColor,
            color: newColor,
        }));
    }


    handleChunkModeChange(event) {
        const newState = {
            ...this.state,
            chunkMode: event.target.value,
        }
        newState.chunks = this.generateChunks(newState);
        this.setState(newState);
    }

    handleChunkWidthChange(event) {
        const newState = {
            ...this.state,
            chunkWidth: event.target.value,
        }
        const chunkWidthIndex = helpers.SPANS.indexOf(newState.chunkWidth);
        const columnWidthIndex = helpers.SPANS.indexOf(newState.columnWidth);
        if (chunkWidthIndex >= columnWidthIndex) {
            newState.columnWidth = helpers.SPANS[chunkWidthIndex + 1]; // FIXME boundary
        }
        newState.chunks = this.generateChunks(newState);
        this.setState(newState);
    }

    handleChunkWordsChange(event) {
        const newState = {
            ...this.state,
            chunkWords: event.target.value,
        }
        newState.chunks = this.generateChunks(newState);
        this.setState(newState);
    }

    handleChunkWidthMinChange(event) {
        const newState = {
            ...this.state,
            chunkWidthMin: event.target.value,
        }
        this.setState(newState);
    }

    handleChunkWidthMaxChange(event) {
        const newState = {
            ...this.state,
            chunkWidthMax: event.target.value,
        }
        this.setState(newState);
    }

    handleChunkTransitionChange(event) {
        const newState = {
            ...this.state,
            chunkTransition: event.target.value,
        }
        this.setState(newState);
    }

    handleChunkStepsChange(event) {
        const newState = {
            ...this.state,
            chunkSteps: event.target.value,
        }
        this.setState(newState);
    }


    handleChunkStyleChange(event) {
        const newState = {
            ...this.state,
            chunkStyle: event.target.value,
        }
        this.setState(newState);
    }


    handleWpmChange(event) {
        const newState = {
            ...this.state,
            wpm: event.target.value,
        }
        this.setState(newState);
    }

    handleColumnsChange(event) {
        const newState = {
            ...this.state,
            columns: event.target.value,
        }
        newState.chunks = this.generateChunks(newState);
        this.setState(newState);
    }

    handleColumnWidthChange(event) {
        const newState = {
            ...this.state,
            columnWidth: event.target.value,
        }
        const chunkWidthIndex = helpers.SPANS.indexOf(newState.chunkWidth);
        const columnWidthIndex = helpers.SPANS.indexOf(newState.columnWidth);
        if (columnWidthIndex <= chunkWidthIndex) {
            newState.chunkWidth = helpers.SPANS[columnWidthIndex - 1]; // FIXME boundary
        }

        newState.chunks = this.generateChunks(newState);
        this.setState(newState);
    }

    handleLinesMaxChange(event) {
        const newState = {
            ...this.state,
            linesMax: event.target.value,
        }
        this.setState(newState);
    }



    usePredefinedDrill(event) {
        const predefinedDrill = JSON.parse(event.target.dataset.drill);
        const newState = {
            ...this.state,
            ...predefinedDrill,
        };
        newState.chunks = this.generateChunks(newState);
        this.setState(newState);
    }

    render() {
        const predefinedDrills = [];
        for (let d = 0; d < this.PREDEFINED_DRILLS.length; d++) {
            const drill = this.PREDEFINED_DRILLS[d];
            predefinedDrills.push(
                <button onClick={this.usePredefinedDrill} key={d} data-difficulty={drill.difficulty} data-drill={JSON.stringify(drill.options)}>{drill.name}</button>
            );
        }

        return (
            <div className="FullScreen Wizard Centered" style={{backgroundColor: this.state.backgroundColor, color: this.state.color}}>

                <section className="Options">

                    <div className="PredefinedOptions">
                        {predefinedDrills}
                    </div>

                    <div className="OptionGroup">
                        <div className="Option">
                            <label htmlFor="chunkMode">Chunk mode</label>
                            <select name="chunkMode" onChange={this.handleChunkModeChange} value={this.state.chunkMode}>
                                <option value="width">Width</option>
                                {/* <option value="words">Words</option> */}
                                <option value="dynamic">Dynamic</option>
                            </select>
                        </div>
                        {this.state.chunkMode === "width" &&
                            <div className="Option">
                                <select name="chunkWidth" onChange={this.handleChunkWidthChange} value={this.state.chunkWidth}>
                                    {helpers.SPANS.map((s, index) => {
                                        return <option key={index} value={s}>{s}</option>
                                    })}
                                </select>
                            </div>
                        }
                        {this.state.chunkMode === "words" &&
                            <div className="Option">
                                <select name="chunkWords" onChange={this.handleChunkWordsChange} value={this.state.chunkWords}>
                                    <option key={1} value={1}>1 word</option>
                                    <option key={2} value={2}>2 words</option>
                                    <option key={3} value={3}>3 words</option>
                                    <option key={4} value={4}>4 words</option>
                                    <option key={5} value={5}>5 words</option>
                                    <option key={6} value={6}>6 words</option>
                                    <option key={7} value={7}>7 words</option>
                                </select>
                            </div>
                        }
                        {this.state.chunkMode === "dynamic" &&
                            <div className="Option">
                                <select name="chunkWidthMin" onChange={this.handleChunkWidthMinChange} value={this.state.chunkWidthMin}>
                                    {helpers.SPANS.map((s, index) => {
                                        return <option key={index} value={s}>{s}</option>
                                    })}
                                </select>
                                <label htmlFor="chunkWidthMin">Min</label>
                            </div>
                        }
                        {this.state.chunkMode === "dynamic" &&
                            <div className="Option">
                                <select name="chunkWidthMax" onChange={this.handleChunkWidthMaxChange} value={this.state.chunkWidthMax}>
                                    {helpers.SPANS.map((s, index) => {
                                        return <option key={index} value={s}>{s}</option>
                                    })}
                                </select>
                                <label htmlFor="chunkWidthMax">Max</label>
                            </div>
                        }
                        {this.state.chunkMode === "dynamic" &&
                            <div className="Option">
                                <select name="chunkTransition" onChange={this.handleChunkTransitionChange} value={this.state.chunkTransition}>
                                    <option key={1} value="wave">Smooth</option>
                                    <option key={2} value="step">Rough</option>
                                </select>
                                <label htmlFor="chunkTransition">Transition</label>
                            </div>
                        }
                        {this.state.chunkMode === "dynamic" &&
                            <div className="Option">
                                <input type="number" min="3" max="20" name="chunkSteps" onChange={this.handleChunkStepsChange} value={this.state.chunkSteps} />
                                <label htmlFor="chunkSteps">Steps</label>
                            </div>
                        }
                    </div>

                    <div className="OptionGroup">
                        <div className="Option">
                            <label htmlFor="chunkStyle">Chunk style</label>
                            <select name="chunkStyle" onChange={this.handleChunkStyleChange} value={this.state.chunkStyle}>
                                <option value="highlight">Highlight</option>
                                <option value="underline">Underline</option>
                                <option value="color">Color</option>
                            </select>
                        </div>
                    </div>

                    <div className="OptionGroup">
                        <div className="Option">
                            <input type="number" min="50" max="5000" name="wpm" onChange={this.handleWpmChange} value={this.state.wpm} />
                            <label htmlFor="wpm">WPM</label>
                        </div>
                        <div className="Option">
                            <select name="columns" onChange={this.handleColumnsChange} value={this.state.columns}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </select>
                            <label htmlFor="columns">Columns</label>
                        </div>
                        <div className="Option">
                            <select name="columnWidth" onChange={this.handleColumnWidthChange} value={this.state.columnWidth}>
                                {helpers.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>
                                })}
                            </select>
                            <label htmlFor="columnWidth">Width</label>
                        </div>
                        <div className="Option">
                            <input type="number" min="0" max="20" name="linesMax" onChange={this.handleLinesMaxChange} value={this.state.maxLines} />
                            <label htmlFor="linesMax">Lines</label>
                        </div>
                        {(this.state.showPreviousChunk || this.state.showNextChunk) &&
                            <div className="Option">
                                <select name="neighborChunksPosition" onChange={this.handleNeighborChunksPositionChange} value={this.state.neighborChunksPosition}>
                                    <option key={1} value="vertical">Vertical</option>
                                    <option key={2} value="horizontal">Horizontal</option>
                                </select>
                                <label htmlFor="neighborChunksPosition">Flow</label>
                            </div>
                        }
                    </div>

                </section>

                <section className="Preview Centered" style={{height: "6em", fontSize: this.state.fontSize}}>

                    <Viewer
                        chunks={this.state.chunks}
                        chunkPosition={this.state.chunks.length / 2}
                        columns={this.state.columns}
                        columnWidth={helpers.increaseSpan(this.state.columnWidth)}

                        chunkStyle={this.state.chunkStyle}

                        fontFamily={this.state.fontFamily}
                        fontSize={this.state.fontSize}
                        fontStyle={this.state.fontStyle}
                        backgroundColor={this.state.backgroundColor}
                        color={this.state.color} />

                </section>

                <Button className="ButtonForm" text="Start" onClick={this.handleValidateClick} />

                <Stylizer
                    fontFamily={this.state.fontFamily}
                    fontSize={this.state.fontSize}
                    fontStyle={this.state.fontStyle}
                    backgroundColor={this.state.backgroundColor}
                    color={this.state.color}
                    onChange={this.handleStyleChanged} />
            </div>
        );
    }

    handleValidateClick() {
        this.props.onValidate({
            wpm: this.state.wpm,
            columns: this.state.columns,
            columnWidth: this.state.columnWidth,
            linesMax: this.state.linesMax,
            speedControls: this.state.speedControls,

            chunkStyle: this.state.chunkStyle,
            chunkMode: this.state.chunkMode,
            chunkWidth: this.state.chunkWidth,
            chunkAccuracy: this.state.chunkAccuracy,
            chunkWords: this.state.chunkWords,
            chunkWidthMin: this.state.chunkWidthMin,
            chunkWidthMax: this.state.chunkWidthMax,
            chunkTransition: this.state.chunkTransition,
            chunkSteps: this.state.chunkSteps,

            fontFamily: this.state.fontFamily,
            fontSize: this.state.fontSize,
            fontStyle: this.state.fontStyle,
            backgroundColor: this.state.backgroundColor,
            color: this.state.color,
        })
    }

}

Wizard.propTypes = {
    ...Drill.propTypes,
    ...Viewer.propTypes,

    content: PropTypes.string, // Not required
    onValidate: PropTypes.func,
};

Wizard.defaultProps = {
    ...Drill.defaultProps,
    ...Viewer.defaultProps,

    onValidate: function() {},
};

export default Wizard;
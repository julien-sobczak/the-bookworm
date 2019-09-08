import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../toolbox/Button';
import Stylizer from '../../toolbox/Stylizer';
import * as helpers from '../../functions/engine';

// Material Design UI forms
import Switch from '@material/react-switch';
import "@material/react-switch/dist/switch.css";

import Drill from './Drill';
import Viewer from './Viewer';

class Wizard extends React.Component {

    PREDEFINED_DRILLS = [
        {
            name: "Minimalist",
            options: { linesPerChunk: 1, showPreviousChunk: false, showNextChunk: false, },
        },
        {
            name: "Vertical",
            difficulty: 0,
            options: { linesPerChunk: 1, neighborChunksPosition: 'vertical', showPreviousChunk: true, showNextChunk: true },
        },
        {
            name: "Horizontal",
            difficulty: 0,
            options: { linesPerChunk: 1, neighborChunksPosition: 'horizontal', showPreviousChunk: true, showNextChunk: true },
        },
        {
            name: "See the past",
            difficulty: 0,
            options: { linesPerChunk: 1, neighborChunksPosition: 'vertical', showPreviousChunk: true, showNextChunk: false },
        },
        {
            name: "See the future",
            difficulty: 0,
            options: { linesPerChunk: 1, neighborChunksPosition: 'vertical', showPreviousChunk: false, showNextChunk: true },
        },
        {
            name: "Multiline",
            difficulty: 1,
            options: { linesPerChunk: 3, showPreviousChunk: false, showNextChunk: false },
        },
    ];

    DEFAULT_DRILL = this.PREDEFINED_DRILLS[0];

    constructor(props) {
        super(props);

        this.state = {
            // Copy drill options
            wpm: props.wpm,
            speedControls: props.speedControls,
            linesPerChunk: props.linesPerChunk,
            neighborChunksPosition: props.neighborChunksPosition,
            showPreviousChunk: props.showPreviousChunk,
            showNextChunk: props.showNextChunk,


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

        this.state = {
            ...this.state,
            ...this.generateChunks(this.state),
        };

        this.handleChunkModeChange = this.handleChunkModeChange.bind(this);
        this.handleChunkWidthChange = this.handleChunkWidthChange.bind(this);
        this.handleChunkWordsChange = this.handleChunkWordsChange.bind(this);
        this.handleChunkWidthMinChange = this.handleChunkWidthMinChange.bind(this);
        this.handleChunkWidthMaxChange = this.handleChunkWidthMaxChange.bind(this);
        this.handleChunkTransitionChange = this.handleChunkTransitionChange.bind(this);
        this.handleChunkStepsChange = this.handleChunkStepsChange.bind(this);
        this.handleChunkStyleChange = this.handleChunkStyleChange.bind(this);

        this.handleWpmChange = this.handleWpmChange.bind(this);
        this.handleLinesPerChunkChange = this.handleLinesPerChunkChange.bind(this);
        this.handleShowPreviousChunkChange = this.handleShowPreviousChunkChange.bind(this);
        this.handleShowNextChunkChange = this.handleShowNextChunkChange.bind(this);
        this.handleNeighborChunksPositionChange = this.handleNeighborChunksPositionChange.bind(this);

        this.usePredefinedDrill = this.usePredefinedDrill.bind(this);

        this.handleStyleChanged = this.handleStyleChanged.bind(this);
        this.handleValidateClick = this.handleValidateClick.bind(this);
    }

    // Generate "basic" text according the various selected chunk options
    generateChunks(newState) {
        const chunk = function(text) {
            if (newState.linesPerChunk > 1) {
                text = Array.fill(text).join('<br/>');
            }
            return {
                text: text,
                startingChunk: false,
                endingChunk: false,
            };
        };

        switch (newState.chunkMode) {
            case "width":
                const length = helpers.SPANS.indexOf(newState.chunkWidth);
                const subtext = 'o'.repeat(length);
                return {
                    previousChunk: chunk("A"),
                    currentChunk: chunk(`l${subtext}ng`),
                    nextChunk: chunk("chunk"),
                }
            case "words":
                const previousWords = ["a", "about", "after", "all", "also", "an", "and", "any", "as", "at"];
                const currentWords = ["than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "to"];
                const nextWords = ["we", "well", "what", "when", "which", "who", "whose", "why", "will", "would",];
                return {
                    previousChunk: chunk(previousWords.slice(0, newState.chunkWords).join(' ')),
                    currentChunk: chunk(currentWords.slice(0, newState.chunkWords).join(' ')),
                    nextChunk: chunk(nextWords.slice(0, newState.chunkWords).join(' ')),
                }
            case "dynamic":
                return {
                    previousChunk: chunk("Tiny"),
                    currentChunk: chunk("Medium"),
                    nextChunk: chunk("Laaaaarge"),
                }
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
        let newState = {
            ...this.state,
            chunkMode: event.target.value,
        }
        newState = {
            ...newState,
            ...this.generateChunks(newState),
        };
        this.setState(newState);
    }

    handleChunkWidthChange(event) {
        let newState = {
            ...this.state,
            chunkWidth: event.target.value,
        }
        newState = {
            ...newState,
            ...this.generateChunks(newState),
        };
        this.setState(newState);
    }

    handleChunkWordsChange(event) {
        let newState = {
            ...this.state,
            chunkWords: event.target.value,
        }
        newState = {
            ...newState,
            ...this.generateChunks(newState),
        };
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

    handleLinesPerChunkChange(event) {
        let newState = {
            ...this.state,
            linesPerChunk: event.target.value,
        }
        newState = {
            ...newState,
            ...this.generateChunks(newState),
        };
        this.setState(newState);
    }

    handleShowPreviousChunkChange(event) {
        const newState = {
            ...this.state,
            showPreviousChunk: event.target.checked,
        }
        this.setState(newState);
    }

    handleShowNextChunkChange(event) {
        const newState = {
            ...this.state,
            showNextChunk: event.target.checked,
        }
        this.setState(newState);
    }

    handleNeighborChunksPositionChange(event) {
        const newState = {
            ...this.state,
            neighborChunksPosition: event.target.value,
        }
        this.setState(newState);
    }


    usePredefinedDrill(event) {
        const predefinedDrill = JSON.parse(event.target.dataset.drill);
        const newState = {
            ...this.state,
            ...predefinedDrill,
        };
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
                                <option value="words">Words</option>
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
                            <select name="linesPerChunk" onChange={this.handleLinesPerChunkChange} value={this.state.linesPerChunk}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </select>
                            <label htmlFor="linesPerChunk">Lines per chunk</label>
                        </div>
                        <div className="Option">
                            <Switch
                                nativeControlId='showPreviousChunk'
                                checked={this.state.showPreviousChunk}
                                onChange={this.handleShowPreviousChunkChange} />
                            <label htmlFor="showPreviousChunk">Show previous chunk</label>
                        </div>
                        <div className="Option">
                            <Switch
                                nativeControlId='showNextChunk'
                                checked={this.state.showNextChunk}
                                onChange={this.handleShowNextChunkChange} />
                            <label htmlFor="showNextChunk">Show next chunk</label>
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
                        previousChunk={this.state.previousChunk}
                        currentChunk={this.state.currentChunk}
                        nextChunk={this.state.nextChunk}

                        neighborChunksPosition={this.state.neighborChunksPosition}
                        showPreviousChunk={this.state.showPreviousChunk}
                        showNextChunk={this.state.showNextChunk}

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
            linesPerChunk: this.state.linesPerChunk,
            showPreviousChunk: this.state.showPreviousChunk,
            showNextChunk: this.state.showNextChunk,
            neighborChunksPosition: this.state.neighborChunksPosition,

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

    content: PropTypes.string, // Not required
    onValidate: PropTypes.func,
};

Wizard.defaultProps = {
    ...Drill.defaultProps,

    onValidate: function() {},
};

export default Wizard;
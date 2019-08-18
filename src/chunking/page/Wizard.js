import React from 'react';
import PropTypes from 'prop-types';

import MainButton from '../../toolbox/MainButton';
import Stylizer from '../../toolbox/Stylizer';
import * as helpers from '../../toolbox/EngineHelpers';

// Material Design UI forms
import Switch from '@material/react-switch';
import "@material/react-switch/dist/switch.css";

import Drill from './Drill';
import Viewer from './Viewer';

class Wizard extends React.Component {

    PREDEFINED_DRILLS = [
        {
            name: "Minimal",
            difficulty: 0,
            options: { disableVisualRegression: true, disableVisualProgression: true, disableVisualProblemStyle: 'transparent' },
        },
        {
            name: "Focused",
            difficulty: 0,
            options: { disableVisualRegression: true, disableVisualProgression: true, disableVisualProblemStyle: 'blur' },
        },
        {
            name: "See the past",
            difficulty: 0,
            options: { disableVisualRegression: false, disableVisualProgression: true, disableVisualProblemStyle: 'transparent' },
        },
        {
            name: "See the future",
            difficulty: 0,
            options: { disableVisualRegression: true, disableVisualProgression: false, disableVisualProblemStyle: 'transparent' },
        },
        {
            name: "Word by word",
            difficulty: 1,
            options: { chunkMode: "words", chunkWords: 1 },
        },
        {
            name: "2-Stops Method",
            difficulty: 1,
            options: { chunkMode: "stops", chunkStops: 2 },
        },
        {
            name: "3-Stops Method",
            difficulty: 1,
            options: { chunkMode: "stops", chunkStops: 3 },
        },
    ];

    DEFAULT_DRILL = this.PREDEFINED_DRILLS[0];

    constructor(props) {
        super(props);

        this.state = {
            // Drill options
            paperSize: props.paperSize,
            wpm: props.wpm,
            pageTurningDuration: props.pageTurningDuration,
            disableVisualRegression: props.disableVisualRegression,
            disableVisualProgression: props.disableVisualProgression,
            disableVisualProblemStyle: props.disableVisualProblemStyle,

            // Chunker options
            chunkStyle: props.chunkStyle,
            chunkMode: props.chunkMode,
            // chunkMode = "width"
            chunkWidth: props.chunkWidth,
            chunkAccuracy: props.chunkAccuracy,
            // chunkMode = "words"
            chunkWords: props.chunkWords,
            // chunkMode = "stops"
            chunkStops: props.chunkStops,

            // Styling options
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.fontStyle,
            backgroundColor: props.backgroundColor,
            color: props.color,
        };

        this.state.page = this.generatePage();

        this.handleChunkModeChange = this.handleChunkModeChange.bind(this);
        this.handleChunkWidthChange = this.handleChunkWidthChange.bind(this);
        this.handleChunkWordsChange = this.handleChunkWordsChange.bind(this);
        this.handleChunkStopsChange = this.handleChunkStopsChange.bind(this);
        this.handleChunkStyleChange = this.handleChunkStyleChange.bind(this);

        this.handlePaperSizeChange = this.handlePaperSizeChange.bind(this);
        this.handleWpmChange = this.handleWpmChange.bind(this);
        this.handlePageTurningDurationChange = this.handlePageTurningDurationChange.bind(this);
        this.handleDisableVisualRegressionChange = this.handleDisableVisualRegressionChange.bind(this);
        this.handleDisableVisualProgressionChange = this.handleDisableVisualProgressionChange.bind(this);
        this.handleDisableVisualProblemStyleChange = this.handleDisableVisualProblemStyleChange.bind(this);

        this.usePredefinedDrill = this.usePredefinedDrill.bind(this);

        this.handleStyleChanged = this.handleStyleChanged.bind(this);
        this.handleValidateClick = this.handleValidateClick.bind(this);
    }

    generatePage() {
        return {
            "number": 1,
            "blocks": [
                { tag: "p", content: "Psychologists and educational specialists working on visual acuity used a tachistoscope to conclude that, with training, an average person could identify minute images flashed on the screen for only one five-hundredth of a second (2 ms). Though the images used were of airplanes, the results had implications for reading.",
                            chunks: ["Psychologists and educational", " ", "specialists working on", " ", "visual acuity used", "a tachistoscope to conclude that, with training, an average person could identify minute images flashed on the screen for only one five-hundredth of a second (2 ms). Though the images used were of airplanes, the results had implications for reading."] },
            ],
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
        this.setState(newState);
    }

    handleChunkStopsChange(event) {
        const newState = {
            ...this.state,
            chunkStops: event.target.value,
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


    handlePaperSizeChange(event) {
        const newState = {
            ...this.state,
            paperSize: event.target.value,
        }
        this.setState(newState);
    }

    handlePageTurningDurationChange(event) {
        const newState = {
            ...this.state,
            pageTurningDuration: event.target.value,
        }
        this.setState(newState);
    }

    handleDisableVisualRegressionChange(event) {
        const newState = {
            ...this.state,
            disableVisualRegression: event.target.checked,
        }
        this.setState(newState);
    }

    handleDisableVisualProgressionChange(event) {
        const newState = {
            ...this.state,
            disableVisualProgression: event.target.checked,
        }
        this.setState(newState);
    }

    handleDisableVisualProblemStyleChange(event) {
        const newState = {
            ...this.state,
            disableVisualProblemStyle: event.target.value,
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
            <div className="FullScreen Wizard Centered WizardPage" style={{backgroundColor: this.state.backgroundColor, color: this.state.color}}>

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
                                <option value="stops">Stops</option>
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
                        {this.state.chunkMode === "stops" &&
                            <div className="Option">
                                <select name="chunkStops" onChange={this.handleChunkStopsChange} value={this.state.chunkStops}>
                                    <option key={1} value={1}>1 stop</option>
                                    <option key={2} value={2}>2 stops</option>
                                    <option key={3} value={3}>3 stops</option>
                                    <option key={4} value={4}>4 stops</option>
                                </select>
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
                        <div className="Option">
                            <label htmlFor="paperSize">Paper size</label>
                            <select name="paperSize" onChange={this.handlePaperSizeChange} value={this.state.paperSize}>
                                <option value="extended">Auto</option>
                                <option value="a4">A4</option>
                                <option value="a5">A5</option>
                                <option value="a6">A6</option>
                                <option value="pocket">Pocket</option>
                                <option value="digest">Digest</option>
                                <option value="paperback">Paperback</option>
                                <option value="hardcover">Hardcover</option>
                            </select>
                        </div>
                    </div>

                    <div className="OptionGroup">
                        <div className="Option">
                            <input type="number" min="50" max="5000" name="wpm" onChange={this.handleWpmChange} value={this.state.wpm} />
                            <label htmlFor="wpm">WPM</label>
                        </div>
                        <div className="Option">
                            <label htmlFor="pageTurningDuration">Page turn duration</label>
                            <input type="number" min="200" max="5000" name="pageTurningDuration" onChange={this.handlePageTurningDurationChange} value={this.state.pageTurningDuration} />
                            <label htmlFor="pageTurningDuration">ms</label>
                        </div>
                        <div className="Option">
                            <Switch
                                nativeControlId='disableVisualRegression'
                                checked={this.state.disableVisualRegression}
                                onChange={this.handleDisableVisualRegressionChange} />
                            <label htmlFor="disableVisualRegression">Disable visual regression</label>
                        </div>
                        <div className="Option">
                            <Switch
                                nativeControlId='disableVisualProgression'
                                checked={this.state.disableVisualProgression}
                                onChange={this.handleDisableVisualProgressionChange} />
                            <label htmlFor="disableVisualProgression">Disable visual progression</label>
                        </div>
                        {(this.state.disableVisualRegression && this.state.disableVisualProgression) && <div className="Option">
                            <label htmlFor="disableVisualProblemStyle">Style</label>
                            <select name="disableVisualProblemStyle" onChange={this.handleDisableVisualProblemStyleChange} value={this.state.disableVisualProblemStyle}>
                                <option value="transparent">Transparent</option>
                                <option value="fade">Fade</option>
                                <option value="blur">Blur</option>
                            </select>
                        </div>}
                    </div>

                </section>

                <section className="Preview Centered" style={{height: "6em", fontSize: this.state.fontSize}}>

                    <Viewer
                        page={this.state.page}
                        blockPosition={0}
                        chunkPosition={2}
                        disableVisualRegression={this.state.disableVisualRegression}
                        disableVisualProgression={this.state.disableVisualProgression}
                        disableVisualProblemStyle={this.state.disableVisualProblemStyle}

                        fontFamily={this.state.fontFamily}
                        fontSize={this.state.fontSize}
                        fontStyle={this.state.fontStyle}
                        backgroundColor={this.state.backgroundColor}
                        color={this.state.color} />

                </section>

                <MainButton className="ButtonStart" text="Start" onClick={this.handleValidateClick} />

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
            paperSize: this.state.paperSize,
            pageTurningDuration: this.state.pageTurningDuration,
            disableVisualRegression: this.state.disableVisualRegression,
            disableVisualProgression: this.state.disableVisualProgression,
            disableVisualProblemStyle: this.state.disableVisualProblemStyle,

            chunkStyle: this.state.chunkStyle,
            chunkMode: this.state.chunkMode,
            chunkWidth: this.state.chunkWidth,
            chunkAccuracy: this.state.chunkAccuracy,
            chunkWords: this.state.chunkWords,
            chunkStops: this.state.chunkStops,

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

    content: PropTypes.object, // Not required
    onValidate: PropTypes.func,
};

Wizard.defaultProps = {
    ...Drill.defaultProps,

    onValidate: function() {},
};

export default Wizard;
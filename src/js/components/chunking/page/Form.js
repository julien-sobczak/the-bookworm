import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

import Viewer from './Viewer';
import RadioButtons from '../../toolbox/RadioButtons';
import Help from '../../toolbox/Help';

import * as engine from '../../../functions/engine';

const Form = (props) => {

    //  Drill
    const [wpm, setWpm] = useState(props.wpm);
    const [pageTurningDuration, setPageTurningDuration] = useState(props.pageTurningDuration);
    const [paperSize, setPaperSize] = useState(props.paperSize);
    const [disableVisualRegression, setDisableVisualRegression] = useState(props.disableVisualRegression);
    const [disableVisualProgression, setDisableVisualProgression] = useState(props.disableVisualProgression);
    const [disableVisualProblemStyle, setDisableVisualProblemStyle] = useState(props.disableVisualProblemStyle);

    // Chunk
    const [chunkMode, setChunkMode] = useState(props.chunkMode);
    const [chunkWidth, setChunkWidth] = useState(props.chunkWidth);
    const [chunkAccuracy, setChunkAccuracy] = useState(props.chunkAccuracy);
    const [chunkWords, setChunkWords] = useState(props.chunkWords);
    const [chunkStops, setChunkStops] = useState(props.chunkStops);

    useEffect(() => {
        setWpm(props.wpm);
        setPageTurningDuration(props.pageTurningDuration);
        setPaperSize(props.paperSize);
        setDisableVisualRegression(props.disableVisualRegression);
        setDisableVisualProgression(props.disableVisualProgression);
        setDisableVisualProblemStyle(props.disableVisualProblemStyle);
        setChunkMode(props.chunkMode);
        setChunkWidth(props.chunkWidth);
        setChunkAccuracy(props.chunkAccuracy);
        setChunkWords(props.chunkWords);
        setChunkStops(props.chunkStops);
    }, [props]);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            wpm: wpm,
            paperSize: paperSize,
            pageTurningDuration: pageTurningDuration,
            disableVisualRegression: disableVisualRegression,
            disableVisualProgression: disableVisualProgression,
            disableVisualProblemStyle: disableVisualProblemStyle,
            chunkMode: chunkMode,
            chunkWidth: chunkWidth,
            chunkAccuracy: chunkAccuracy,
            chunkWords: chunkWords,
            chunkStops: chunkStops,
        };
    };

    const handleWpmChange = (event) => {
        const newValue = parseInt(event.target.value);
        setWpm(newValue);
        onChange({
            ...currentState(),
            wpm: newValue,
        });
    };

    const handlePageTurningDurationChange = (event) => {
        const newValue = parseInt(event.target.value);
        setPageTurningDuration(newValue);
        onChange({
            ...currentState(),
            pageTurningDuration: newValue,
        });
    };

    const handlePaperSizeChange = (event) => {
        const newValue = event.target.value;
        setPaperSize(newValue);
        onChange({
            ...currentState(),
            paperSize: newValue,
        });
    };

    const handleDisableVisualRegressionChange = (event) => {
        const newValue = event.target.checked;
        setDisableVisualRegression(newValue);
        onChange({
            ...currentState(),
            disableVisualRegression: newValue,
        });
    };

    const handleDisableVisualProgressionChange = (event) => {
        const newValue = event.target.checked;
        setDisableVisualProgression(newValue);
        onChange({
            ...currentState(),
            disableVisualProgression: newValue,
        });
    };

    const handleDisableVisualProblemStyleChange = (event) => {
        const newValue = event.target.value;
        setDisableVisualProblemStyle(newValue);
        onChange({
            ...currentState(),
            disableVisualProblemStyle: newValue,
        });
    };

    const handleChunkModeChange = (event) => {
        const newValue = event.target.value;
        setChunkMode(newValue);
        onChange({
            ...currentState(),
            chunkMode: newValue,
        });
    };

    const handleChunkWidthChange = (event) => {
        const newValue = event.target.value;
        setChunkWidth(newValue);
        onChange({
            ...currentState(),
            chunkWidth: newValue,
        });
    };

    const handleChunkWordsChange = (event) => {
        const newValue = parseInt(event.target.value);
        setChunkWords(newValue);
        onChange({
            ...currentState(),
            chunkWords: newValue,
        });
    };

    const handleChunkStopsChange = (event) => {
        const newValue = event.target.value;
        setChunkStops(newValue);
        onChange({
            ...currentState(),
            chunkStops: newValue,
        });
    };

    return (
        <>
            <table className="Setting">
                <tbody>
                    <tr>
                        <th><label htmlFor="wpm">WPM</label>:</th>
                        <td>
                            <Help title="Determine indirectly the duration of a single chunk on screen." />
                        </td>
                        <td>
                            <input id="wpm" type="number" min="50" max="5000" onChange={handleWpmChange} value={wpm} />
                        </td>
                    </tr>
                    <tr>
                        <th><label htmlFor="pageTurningDuration">Page turn duration</label>:</th>
                        <td>
                            <Help title="Add a pause after each page simulating the interruption when reading a paper book" />
                        </td>
                        <td>
                            <input id="pageTurningDuration" type="number" min="100" max="5000" onChange={handlePageTurningDurationChange} value={pageTurningDuration} /> ms
                        </td>
                    </tr>
                    <tr>
                        <th><label htmlFor="paperSize">Paper</label>:</th>
                        <td>
                            <Help title="Determine the page format." />
                        </td>
                        <td>
                            <select id="paperSize" onChange={handlePaperSizeChange} value={paperSize}>
                                <option value="extended">Auto</option>
                                <option value="a4">A4</option>
                                <option value="a5">A5</option>
                                <option value="a6">A6</option>
                                <option value="pocket">Pocket</option>
                                <option value="digest">Digest</option>
                                <option value="paperback">Paperback</option>
                                <option value="hardcover">Hardcover</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th><label htmlFor="disableVisualRegression">Disable visual regression</label>:</th>
                        <td>
                            <Help title="Determine how previous chunks are displayed." />
                        </td>
                        <td>
                            <Switch
                                id="disableVisualRegression"
                                color="primary"
                                checked={disableVisualRegression}
                                onChange={handleDisableVisualRegressionChange} />
                        </td>
                    </tr>
                    <tr>
                        <th><label htmlFor="disableVisualProgression">Disable visual progression</label>:</th>
                        <td>
                            <Help title="Determine how next chunks are displayed." />
                        </td>
                        <td>
                            <Switch
                                id="disableVisualProgression"
                                color="primary"
                                checked={disableVisualProgression}
                                onChange={handleDisableVisualProgressionChange} />
                        </td>
                    </tr>
                    {(disableVisualRegression || disableVisualProgression) &&<tr>
                        <th><label>Style</label>:</th>
                        <td>
                            <Help title="Determine the effect to apply to previous/next chunks." />
                        </td>
                        <td>
                            <RadioButtons
                                options={[
                                    { value: "transparent" },
                                    { value: "fade" },
                                    { value: "blur" },
                                ]}
                                onChange={handleDisableVisualProblemStyleChange}
                                value={disableVisualProblemStyle} />
                        </td>
                    </tr>}
                </tbody>
            </table>
            <table className="Setting">
                <tbody>
                    <tr>
                        <th><label>Chunk Mode</label>:</th>
                        <td>
                            <Help title="Determine the strategy to form chunks." />
                        </td>
                        <td>
                            <RadioButtons
                                options={[
                                    { value: "width" },
                                    { value: "words" },
                                    { value: "stops" },
                                ]}
                                onChange={handleChunkModeChange}
                                value={chunkMode} />
                        </td>
                    </tr>
                    {chunkMode === 'width' && <tr>
                        <th><label htmlFor="chunkWidth">Chunk Width</label>:</th>
                        <td>
                            <Help title="Determine the maximum width for a chunk." />
                        </td>
                        <td>
                            <select id="chunkWidth" onChange={handleChunkWidthChange} value={chunkWidth}>
                                {engine.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>;
                                })}
                            </select>
                        </td>
                    </tr>}
                    {chunkMode === 'words' && <tr>
                        <th><label htmlFor="chunkWords">Chunk Words</label>:</th>
                        <td>
                            <Help title="Determine the number of words to include in a single chunk." />
                        </td>
                        <td>
                            <select id="chunkWords" onChange={handleChunkWordsChange} value={chunkWords}>
                                <option key={1} value={1}>1 word</option>
                                <option key={2} value={2}>2 words</option>
                                <option key={3} value={3}>3 words</option>
                                <option key={4} value={4}>4 words</option>
                                <option key={5} value={5}>5 words</option>
                                <option key={6} value={6}>6 words</option>
                                <option key={7} value={7}>7 words</option>
                            </select>
                        </td>
                    </tr>}
                    {chunkMode === 'stops' && <tr>
                        <th><label>Stops</label>:</th>
                        <td>
                            <Help title="Determine the number of chunks per line." />
                        </td>
                        <td>
                            <RadioButtons
                                options={[
                                    { value: 1, label: "1 stop" },
                                    { value: 2, label: "2 stops" },
                                    { value: 3, label: "3 stops" },
                                    { value: 4, label: "4 stops" },
                                ]}
                                onChange={handleChunkStopsChange}
                                value={chunkStops} />
                        </td>
                    </tr>}
                </tbody>
            </table>
        </>
    );
};

Form.propTypes = {
    ...Viewer.propTypes,
    onChange: PropTypes.func,
};

Form.defaultProps = {
    ...Viewer.defaultProps,
};

export default Form;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

import Viewer from './Viewer';

import * as helpers from '../../../functions/engine';


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
    const [chunkAccuracy,] = useState(props.chunkAccuracy); // TODO
    const [chunkWords, setChunkWords] = useState(props.chunkWords);
    const [chunkStops, setChunkStops] = useState(props.chunkStops);

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
        const newValue = event.target.value;
        setWpm(newValue);
        onChange({
            ...currentState(),
            wpm: newValue,
        });
    };

    const handlePageTurningDurationChange = (event) => {
        const newValue = event.target.value;
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
        const newValue = event.target.dataset.value;
        setDisableVisualProblemStyle(newValue);
        onChange({
            ...currentState(),
            disableVisualProblemStyle: newValue,
        });
    };

    const handleChunkModeChange = (event) => {
        const newValue = event.target.dataset.value;
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
        const newValue = event.target.value;
        setChunkWords(newValue);
        onChange({
            ...currentState(),
            chunkWords: newValue,
        });
    };

    const handleChunkStopsChange = (event) => {
        const newValue = parseInt(event.target.dataset.value);
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
                        <th>WPM:</th>
                        <td>
                            <input type="number" min="50" max="5000" onChange={handleWpmChange} value={wpm} />
                        </td>
                    </tr>
                    <tr>
                        <th>Page turn duration:</th>
                        <td>
                            <input type="number" min="100" max="5000" onChange={handlePageTurningDurationChange} value={pageTurningDuration} /> ms
                        </td>
                    </tr>
                    <tr>
                        <th>Paper:</th>
                        <td>
                            <select onChange={handlePaperSizeChange} value={paperSize}>
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
                        <th>Disable visual regression:</th>
                        <td>
                            <Switch
                                checked={disableVisualRegression}
                                onChange={handleDisableVisualRegressionChange} />
                        </td>
                    </tr>
                    <tr>
                        <th>Disable visual progression:</th>
                        <td>
                            <Switch
                                checked={disableVisualProgression}
                                onChange={handleDisableVisualProgressionChange} />
                        </td>
                    </tr>
                    {(disableVisualRegression || disableVisualProgression) &&<tr>
                        <th>Style:</th>
                        <td>
                            <span onClick={handleDisableVisualProblemStyleChange} className={"GraphicOption" + (disableVisualProblemStyle === 'transparent' ? ' selected' : '')} data-value="transparent">Transparent</span>
                            <span onClick={handleDisableVisualProblemStyleChange} className={"GraphicOption" + (disableVisualProblemStyle === 'fade' ? ' selected' : '')} data-value="fade">Fade</span>
                            <span onClick={handleDisableVisualProblemStyleChange} className={"GraphicOption" + (disableVisualProblemStyle === 'blur' ? ' selected' : '')} data-value="blur">Blur</span>
                        </td>
                    </tr>}
                </tbody>
            </table>
            <table className="Setting">
                <tbody>
                    <tr>
                        <th>Chunk Mode:</th>
                        <td>
                            <span onClick={handleChunkModeChange} className={"GraphicOption" + (chunkMode === 'width' ? ' selected' : '')} data-value="width">Width</span>
                            <span onClick={handleChunkModeChange} className={"GraphicOption" + (chunkMode === 'words' ? ' selected' : '')} data-value="words">Words</span>
                            <span onClick={handleChunkModeChange} className={"GraphicOption" + (chunkMode === 'stops' ? ' selected' : '')} data-value="stops">Dynamic</span>
                        </td>
                    </tr>
                    {chunkMode === 'width' && <tr>
                        <th>Chunk Width:</th>
                        <td>
                            <select onChange={handleChunkWidthChange} value={chunkWidth}>
                                {helpers.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>;
                                })}
                            </select>
                        </td>
                    </tr>}
                    {chunkMode === 'words' && <tr>
                        <th>Chunk Words:</th>
                        <td>
                            <select onChange={handleChunkWordsChange} value={chunkWords}>
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
                        <th>Steps:</th>
                        <td>
                            <span onClick={handleChunkStopsChange} className={"GraphicOption" + (chunkStops === 1 ? ' selected' : '')} data-value={1}>1 stop</span>
                            <span onClick={handleChunkStopsChange} className={"GraphicOption" + (chunkStops === 2 ? ' selected' : '')} data-value={1}>2 stops</span>
                            <span onClick={handleChunkStopsChange} className={"GraphicOption" + (chunkStops === 3 ? ' selected' : '')} data-value={1}>3 stops</span>
                            <span onClick={handleChunkStopsChange} className={"GraphicOption" + (chunkStops === 4 ? ' selected' : '')} data-value={1}>4 stops</span>
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
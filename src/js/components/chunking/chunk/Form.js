import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

import Viewer from './Viewer';

import * as helpers from '../../../functions/engine';

const Form = (props) => {

    //  Drill
    const [wpm, setWpm] = useState(props.wpm);
    const [linesPerChunk, setLinesPerChunk] = useState(props.linesPerChunk);
    const [neighborChunksPosition, setNeighborChunksPosition] = useState(props.neighborChunksPosition);
    const [showPreviousChunk, setShowPreviousChunk] = useState(props.showPreviousChunk);
    const [showNextChunk, setShowNextChunk] = useState(props.showNextChunk);

    // Chunk
    const [chunkMode, setChunkMode] = useState(props.chunkMode);
    const [chunkWidth, setChunkWidth] = useState(props.chunkWidth);
    const [chunkAccuracy,] = useState(props.chunkAccuracy); // TODO
    const [chunkWords, setChunkWords] = useState(props.chunkWords);
    const [chunkWidthMin, setChunkWidthMin] = useState(props.chunkWidthMin);
    const [chunkWidthMax, setChunkWidthMax] = useState(props.chunkWidthMax);
    const [chunkTransition, setChunkTransition] = useState(props.chunkTransition);
    const [chunkSteps, setChunkSteps] = useState(props.chunkSteps);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            wpm: wpm,
            linesPerChunk: linesPerChunk,
            neighborChunksPosition: neighborChunksPosition,
            showPreviousChunk: showPreviousChunk,
            showNextChunk: showNextChunk,
            chunkMode: chunkMode,
            chunkWidth: chunkWidth,
            chunkAccuracy: chunkAccuracy,
            chunkWords: chunkWords,
            chunkWidthMin: chunkWidthMin,
            chunkWidthMax: chunkWidthMax,
            chunkTransition: chunkTransition,
            chunkSteps: chunkSteps,
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

    const handleLinesPerChunkChange = (event) => {
        const newValue = parseInt(event.target.dataset.value);
        setLinesPerChunk(newValue);
        onChange({
            ...currentState(),
            linesPerChunk: newValue,
        });
    };

    const handleShowPreviousChunkChange = (event) => {
        const newValue = event.target.checked;
        setShowPreviousChunk(newValue);
        onChange({
            ...currentState(),
            showPreviousChunk: newValue,
        });
    };

    const handleShowNextChunkChange = (event) => {
        const newValue = event.target.checked;
        setShowNextChunk(newValue);
        onChange({
            ...currentState(),
            showNextChunk: newValue,
        });
    };

    const handleNeighborChunksPositionChange = (event) => {
        const newValue = event.target.dataset.value;
        setNeighborChunksPosition(newValue);
        onChange({
            ...currentState(),
            neighborChunksPosition: newValue,
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
        const newValue = parseInt(event.target.value);
        setChunkWords(newValue);
        onChange({
            ...currentState(),
            chunkWords: newValue,
        });
    };

    const handleChunkWidthMinChange = (event) => {
        const newValue = event.target.value;
        setChunkWidthMin(newValue);
        onChange({
            ...currentState(),
            chunkWidthMin: newValue,
        });
    };

    const handleChunkWidthMaxChange = (event) => {
        const newValue = event.target.value;
        setChunkWidthMax(newValue);
        onChange({
            ...currentState(),
            chunkWidthMax: newValue,
        });
    };

    const handleChunkTransitionChange = (event) => {
        const newValue = event.target.dataset.value;
        setChunkTransition(newValue);
        onChange({
            ...currentState(),
            chunkTransition: newValue,
        });
    };

    const handleChunkStepsChange = (event) => {
        const newValue = parseInt(event.target.value);
        setChunkSteps(newValue);
        onChange({
            ...currentState(),
            chunkSteps: newValue,
        });
    };

    return (
        <>
            <table className="Setting">
                <tbody>
                    <tr>
                        <th><label htmlFor="wpm">WPM</label>:</th>
                        <td>
                            <input id="wpm" type="number" min="50" max="5000" onChange={handleWpmChange} value={wpm} />
                        </td>
                    </tr>
                    <tr>
                        <th>Lines per chunk:</th>
                        <td>
                            <span data-testid="linesPerChunk1" onClick={handleLinesPerChunkChange} className={"GraphicOption" + (linesPerChunk === 1 ? ' selected' : '')} data-value={1}>1</span>
                            <span data-testid="linesPerChunk2" onClick={handleLinesPerChunkChange} className={"GraphicOption" + (linesPerChunk === 2 ? ' selected' : '')} data-value={2}>2</span>
                            <span data-testid="linesPerChunk3" onClick={handleLinesPerChunkChange} className={"GraphicOption" + (linesPerChunk === 3 ? ' selected' : '')} data-value={3}>3</span>
                        </td>
                    </tr>
                    <tr>
                        <th><label htmlFor="showPreviousChunk">Show previous chunk</label>:</th>
                        <td>
                            <Switch
                                id="showPreviousChunk"
                                color="primary"
                                checked={showPreviousChunk}
                                onChange={handleShowPreviousChunkChange} />
                        </td>
                    </tr>
                    <tr>
                        <th><label htmlFor="showNextChunk">Show next chunk</label>:</th>
                        <td>
                            <Switch
                                id="showNextChunk"
                                color="primary"
                                checked={showNextChunk}
                                onChange={handleShowNextChunkChange} />
                        </td>
                    </tr>
                    {(showPreviousChunk || showNextChunk) &&<tr>
                        <th>Flow:</th>
                        <td>
                            <span data-testid="neighborChunksPositionVertical"   onClick={handleNeighborChunksPositionChange} className={"GraphicOption" + (neighborChunksPosition === 'vertical' ? ' selected' : '')} data-value="vertical">Vertical</span>
                            <span data-testid="neighborChunksPositionHorizontal" onClick={handleNeighborChunksPositionChange} className={"GraphicOption" + (neighborChunksPosition === 'horizontal' ? ' selected' : '')} data-value="horizontal">Horizontal</span>
                        </td>
                    </tr>}
                </tbody>
            </table>
            <table className="Setting">
                <tbody>
                    <tr>
                        <th>Chunk Mode:</th>
                        <td>
                            <span data-testid="chunkModeWidth"   onClick={handleChunkModeChange} className={"GraphicOption" + (chunkMode === 'width' ? ' selected' : '')} data-value="width">Width</span>
                            <span data-testid="chunkModeWords"   onClick={handleChunkModeChange} className={"GraphicOption" + (chunkMode === 'words' ? ' selected' : '')} data-value="words">Words</span>
                            <span data-testid="chunkModeDynamic" onClick={handleChunkModeChange} className={"GraphicOption" + (chunkMode === 'dynamic' ? ' selected' : '')} data-value="dynamic">Dynamic</span>
                        </td>
                    </tr>
                    {chunkMode === 'width' && <tr>
                        <th><label htmlFor="chunkWidth">Chunk Width</label>:</th>
                        <td>
                            <select id="chunkWidth" onChange={handleChunkWidthChange} value={chunkWidth}>
                                {helpers.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>;
                                })}
                            </select>
                        </td>
                    </tr>}
                    {chunkMode === 'words' && <tr>
                        <th><label htmlFor="chunkWords">Chunk Words</label>:</th>
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
                    {chunkMode === 'dynamic' && <tr>
                        <th><label htmlFor="chunkWidthMin">Min</label>:</th>
                        <td>
                            <select id="chunkWidthMin" onChange={handleChunkWidthMinChange} value={chunkWidthMin}>
                                {helpers.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>;
                                })}
                            </select>
                        </td>
                    </tr>}
                    {chunkMode === 'dynamic' && <tr>
                        <th><label htmlFor="chunkWidthMax">Max</label>:</th>
                        <td>
                            <select id="chunkWidthMax" onChange={handleChunkWidthMaxChange} value={chunkWidthMax}>
                                {helpers.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>;
                                })}
                            </select>
                        </td>
                    </tr>}
                    {chunkMode === 'dynamic' && <tr>
                        <th>Transition:</th>
                        <td>
                            <span data-testid="chunkTransitionWave" onClick={handleChunkTransitionChange} className={"GraphicOption" + (chunkTransition === 'wave' ? ' selected' : '')} data-value="wave">Smooth</span>
                            <span data-testid="chunkTransitionStep" onClick={handleChunkTransitionChange} className={"GraphicOption" + (chunkTransition === 'step' ? ' selected' : '')} data-value="step">Rough</span>
                        </td>
                    </tr>}
                    {chunkMode === 'dynamic' && <tr>
                        <th><label htmlFor="chunkSteps">Steps</label>:</th>
                        <td>
                            <input id="chunkSteps" type="number" min="3" max="20" onChange={handleChunkStepsChange} value={chunkSteps} />
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
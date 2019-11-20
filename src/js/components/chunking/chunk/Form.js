import React, { useState } from 'react';

import * as helpers from '../../../functions/engine';

// Material Design UI forms
import Switch from '@material/react-switch';

import "@material/react-switch/dist/switch.css";

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
        const newValue = event.target.value;
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
        const newValue = event.target.value;
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
        const newValue = event.target.value;
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
                        <th>WPM:</th>
                        <td>
                            <input type="number" min="50" max="5000" onChange={handleWpmChange} value={wpm} />
                        </td>
                    </tr>
                    <tr>
                        <th>Lines per chunk:</th>
                        <td>
                            <span onClick={handleLinesPerChunkChange} className={"GraphicOption" + (linesPerChunk === 1 ? ' selected' : '')} data-value={1}>1</span>
                            <span onClick={handleLinesPerChunkChange} className={"GraphicOption" + (linesPerChunk === 2 ? ' selected' : '')} data-value={2}>2</span>
                            <span onClick={handleLinesPerChunkChange} className={"GraphicOption" + (linesPerChunk === 3 ? ' selected' : '')} data-value={3}>3</span>
                        </td>
                    </tr>
                    <tr>
                        <th>Show previous chunk:</th>
                        <td>
                            <Switch
                                nativeControlId='showPreviousChunk'
                                checked={showPreviousChunk}
                                onChange={handleShowPreviousChunkChange} />
                        </td>
                    </tr>
                    <tr>
                        <th>Show next chunk:</th>
                        <td>
                            <Switch
                                nativeControlId='showNextChunk'
                                checked={showNextChunk}
                                onChange={handleShowNextChunkChange} />
                        </td>
                    </tr>
                    {(showPreviousChunk || showNextChunk) &&<tr>
                        <th>Flow:</th>
                        <td>
                            <span onClick={handleNeighborChunksPositionChange} className={"GraphicOption" + (neighborChunksPosition === 'vertical' ? ' selected' : '')} data-value="vertical">Vertical</span>
                            <span onClick={handleNeighborChunksPositionChange} className={"GraphicOption" + (neighborChunksPosition === 'horizontal' ? ' selected' : '')} data-value="horizontal">Horizontal</span>
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
                            <span onClick={handleChunkModeChange} className={"GraphicOption" + (chunkMode === 'dynamic' ? ' selected' : '')} data-value="dynamic">Dynamic</span>
                        </td>
                    </tr>
                    {chunkMode === 'width' && <tr>
                        <th>Chunk Width:</th>
                        <td>
                            <select onChange={handleChunkWidthChange} value={chunkWidth}>
                                {helpers.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>
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
                    {chunkMode === 'dynamic' && <tr>
                        <th>Min:</th>
                        <td>
                            <select onChange={handleChunkWidthMinChange} value={chunkWidthMin}>
                                {helpers.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>
                                })}
                            </select>
                        </td>
                    </tr>}
                    {chunkMode === 'dynamic' && <tr>
                        <th>Max:</th>
                        <td>
                            <select onChange={handleChunkWidthMaxChange} value={chunkWidthMax}>
                                {helpers.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>
                                })}
                            </select>
                        </td>
                    </tr>}
                    {chunkMode === 'dynamic' && <tr>
                        <th>Transition:</th>
                        <td>
                            <span onClick={handleChunkTransitionChange} className={"GraphicOption" + (chunkTransition === 'wave' ? ' selected' : '')} data-value="wave">Smooth</span>
                            <span onClick={handleChunkTransitionChange} className={"GraphicOption" + (chunkTransition === 'step' ? ' selected' : '')} data-value="step">Rough</span>
                        </td>
                    </tr>}
                    {chunkMode === 'dynamic' && <tr>
                        <th>Steps:</th>
                        <td>
                            <input type="number" min="3" max="20" onChange={handleChunkStepsChange} value={chunkSteps} />
                        </td>
                    </tr>}
                </tbody>
            </table>
        </>
    );
}

export default Form;
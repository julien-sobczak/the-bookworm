import React, { useState } from 'react';

import * as helpers from '../../../functions/engine';

const Form = (props) => {

    //  Drill
    const [wpm, setWpm] = useState(props.wpm);
    const [columns, setColumns] = useState(props.columns);
    const [columnWidth, setColumnWidth] = useState(props.columnWidth);
    const [linesMax, setLinesMax] = useState(props.linesMax);

    // Chunk
    const [chunkMode, setChunkMode] = useState(props.chunkMode);
    const [chunkWidth, setChunkWidth] = useState(props.chunkWidth);
    const [chunkAccuracy, ] = useState(props.chunkAccuracy); // TODO
    const [chunkWords, setChunkWords] = useState(props.chunkWords);
    const [chunkWidthMin, setChunkWidthMin] = useState(props.chunkWidthMin);
    const [chunkWidthMax, setChunkWidthMax] = useState(props.chunkWidthMax);
    const [chunkTransition, setChunkTransition] = useState(props.chunkTransition);
    const [chunkSteps, setChunkSteps] = useState(props.chunkSteps);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            wpm: wpm,
            columns: columns,
            columnWidth: columnWidth,
            linesMax: linesMax,
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

    const handleColumnsChange = (event) => {
        const newValue = parseInt(event.target.dataset.value);
        setColumns(newValue);
        onChange({
            ...currentState(),
            columns: newValue,
        });
    };

    const handleColumnWidthChange = (event) => {
        const newValue = event.target.value;
        setColumnWidth(newValue);
        onChange({
            ...currentState(),
            columnWidth: newValue,
        });
    };

    const handleLinesMaxChange = (event) => {
        const newValue = parseInt(event.target.dataset.value);
        setLinesMax(newValue);
        onChange({
            ...currentState(),
            linesMax: newValue,
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
                        <th>Columns:</th>
                        <td>
                            <span onClick={handleColumnsChange} className={"GraphicOption" + (columns === 1 ? ' selected' : '')} data-value={1}>1</span>
                            <span onClick={handleColumnsChange} className={"GraphicOption" + (columns === 2 ? ' selected' : '')} data-value={2}>2</span>
                            <span onClick={handleColumnsChange} className={"GraphicOption" + (columns === 3 ? ' selected' : '')} data-value={3}>3</span>
                            <span onClick={handleColumnsChange} className={"GraphicOption" + (columns === 4 ? ' selected' : '')} data-value={4}>4</span>
                        </td>
                    </tr>
                    <tr>
                        <th>Width:</th>
                        <td>
                            <select onChange={handleColumnWidthChange} value={columnWidth}>
                                {helpers.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>
                                })}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>Lines:</th>
                        <td>
                            <span onClick={handleLinesMaxChange} className={"GraphicOption" + (linesMax === 5  ? ' selected' : '')} data-value={5}>5</span>
                            <span onClick={handleLinesMaxChange} className={"GraphicOption" + (linesMax === 10 ? ' selected' : '')} data-value={10}>10</span>
                            <span onClick={handleLinesMaxChange} className={"GraphicOption" + (linesMax === 15 ? ' selected' : '')} data-value={15}>15</span>
                            <span onClick={handleLinesMaxChange} className={"GraphicOption" + (linesMax === 20 ? ' selected' : '')} data-value={20}>20</span>
                            <span onClick={handleLinesMaxChange} className={"GraphicOption" + (linesMax === 0  ? ' selected' : '')} data-value={0}>Fit Screen</span>
                        </td>
                    </tr>
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
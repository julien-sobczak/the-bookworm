import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

import Viewer from './Viewer';
import RadioButtons from '../../../components/toolbox/RadioButtons';

import * as engine from '../../../functions/engine';

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
    const [chunkAccuracy, setChunkAccuracy] = useState(props.chunkAccuracy);
    const [chunkWords, setChunkWords] = useState(props.chunkWords);
    const [chunkWidthMin, setChunkWidthMin] = useState(props.chunkWidthMin);
    const [chunkWidthMax, setChunkWidthMax] = useState(props.chunkWidthMax);
    const [chunkTransition, setChunkTransition] = useState(props.chunkTransition);
    const [chunkSteps, setChunkSteps] = useState(props.chunkSteps);

    React.useEffect(() => {
        setWpm(props.wpm);
        setLinesPerChunk(props.linesPerChunk);
        setNeighborChunksPosition(props.neighborChunksPosition);
        setShowPreviousChunk(props.showPreviousChunk);
        setShowNextChunk(props.showNextChunk);
        setChunkMode(props.chunkMode);
        setChunkWidth(props.chunkWidth);
        setChunkAccuracy(props.chunkAccuracy);
        setChunkWords(props.chunkWords);
        setChunkWidthMin(props.chunkWidthMin);
        setChunkWidthMax(props.chunkWidthMax);
        setChunkTransition(props.chunkTransition);
        setChunkSteps(props.chunkSteps);
    }, [props]);

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
        const newValue = event.target.value;
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
        const newValue = event.target.value;
        setNeighborChunksPosition(newValue);
        onChange({
            ...currentState(),
            neighborChunksPosition: newValue,
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
        const newValue = event.target.value;
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
                        <th><label>Lines per chunk</label>:</th>
                        <td>
                            <RadioButtons
                                options={[
                                    { value: 1, alt: "1 line per chunk"},
                                    { value: 2, alt: "2 lines per chunk"},
                                    { value: 3, alt: "3 lines per chunk"},
                                ]}
                                onChange={handleLinesPerChunkChange}
                                value={linesPerChunk} />
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
                        <th><label>Flow</label>:</th>
                        <td>
                            <RadioButtons
                                options={[
                                    { value: 'vertical' },
                                    { value: 'horizontal' },
                                ]}
                                onChange={handleNeighborChunksPositionChange}
                                value={neighborChunksPosition} />
                        </td>
                    </tr>}
                </tbody>
            </table>
            <table className="Setting">
                <tbody>
                    <tr>
                        <th><label>Chunk Mode</label>:</th>
                        <td>
                            <RadioButtons
                                options={[
                                    { value: "width"},
                                    { value: "words" },
                                    { value: "dynamic" },
                                ]}
                                onChange={handleChunkModeChange}
                                value={chunkMode} />
                        </td>
                    </tr>
                    {chunkMode === 'width' && <tr>
                        <th><label htmlFor="chunkWidth">Chunk Width</label>:</th>
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
                                {engine.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>;
                                })}
                            </select>
                        </td>
                    </tr>}
                    {chunkMode === 'dynamic' && <tr>
                        <th><label htmlFor="chunkWidthMax">Max</label>:</th>
                        <td>
                            <select id="chunkWidthMax" onChange={handleChunkWidthMaxChange} value={chunkWidthMax}>
                                {engine.SPANS.map((s, index) => {
                                    return <option key={index} value={s}>{s}</option>;
                                })}
                            </select>
                        </td>
                    </tr>}
                    {chunkMode === 'dynamic' && <tr>
                        <th><label>Transition</label>:</th>
                        <td>
                            <RadioButtons
                                options={[
                                    { value: "wave", label: "Smooth" },
                                    { value: "step", label: "Rough" },
                                ]}
                                onChange={handleChunkTransitionChange}
                                value={chunkTransition} />
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

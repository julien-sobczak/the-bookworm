import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';

const Form = (props) => {

    //  Drill
    const [pageTurningDuration, setPageTurningDuration] = useState(props.pageTurningDuration);
    const [paperSize, setPaperSize] = useState(props.paperSize);
    const [pacerWpm, setPacerWpm] = useState(props.pacerWpm);
    const [timer, setTimer] = useState(props.timer);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            paperSize: paperSize,
            pageTurningDuration: pageTurningDuration,
            pacerWpm: pacerWpm,
            timer: timer,
        };
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

    const handlePacerWpmChange = (event) => {
        const newValue = event.target.value;
        setPacerWpm(newValue);
        onChange({
            ...currentState(),
            pacerWpm: newValue,
        });
    };

    const handleTimerChange = (event) => {
        const newValue = parseInt(event.target.dataset.value);
        setTimer(newValue);
        onChange({
            ...currentState(),
            timer: newValue,
        });
    };

    return (
        <>
            <table className="Setting">
                <tbody>
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
                    {pacerWpm > 0 && <tr>
                        <th>Pacer WPM:</th>
                        <td>
                            <input type="number" min="50" max="5000" onChange={handlePacerWpmChange} value={pacerWpm} />
                        </td>
                    </tr>}
                    { timer > 0 && <tr>
                        <th>Timer:</th>
                        <td>
                            <span onClick={handleTimerChange} className={"GraphicOption" + (timer === 1 ? ' selected' : '')} data-value={1}>1 minute</span>
                            <span onClick={handleTimerChange} className={"GraphicOption" + (timer === 2 ? ' selected' : '')} data-value={2}>2 minutes</span>
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
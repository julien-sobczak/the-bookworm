import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Viewer from './Viewer';
import RadioButtons from '../toolbox/RadioButtons';
import Help from '../toolbox/Help';

const Form = (props) => {

    //  Drill
    const [pageTurningDuration, setPageTurningDuration] = useState(props.pageTurningDuration);
    const [paperSize, setPaperSize] = useState(props.paperSize);
    const [pacerWpm, setPacerWpm] = useState(props.pacerWpm);
    const [timer, setTimer] = useState(props.timer);

    useEffect(() => {
        setPageTurningDuration(props.pageTurningDuration);
        setPaperSize(props.paperSize);
        setPacerWpm(props.pacerWpm);
        setTimer(props.timer);
    }, [props]);

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

    const handlePacerWpmChange = (event) => {
        const newValue = parseInt(event.target.value);
        setPacerWpm(newValue);
        onChange({
            ...currentState(),
            pacerWpm: newValue,
        });
    };

    const handleTimerChange = (event) => {
        const newValue = event.target.value;
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
                        <th><label htmlFor="pageTurningDuration">Page turn duration</label>:</th>
                        <td>
                            <Help title="Add a pause after each page to simulate the interruption when reading a paper book." />
                        </td>
                        <td>
                            <input id="pageTurningDuration" type="number" min="100" max="5000" onChange={handlePageTurningDurationChange} value={pageTurningDuration} /> ms
                        </td>
                    </tr>
                    <tr>
                        <th><label htmlFor="paperSize">Paper</label>:</th>
                        <td>
                            <Help title="Determine the format of the page." />
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
                    {pacerWpm > 0 && <tr>
                        <th><label htmlFor="pacerWpm">Pacer WPM</label>:</th>
                        <td>
                            <Help title="Determine the target WPM for the pacer. You must read faster to win the game." />
                        </td>
                        <td>
                            <input data-testid="pacerWpm" id="pacerWpm" type="number" min="50" max="5000" onChange={handlePacerWpmChange} value={pacerWpm} />
                        </td>
                    </tr>}
                    { timer > 0 && <tr>
                        <th><label>Timer</label>:</th>
                        <td>
                            <Help title="Determine the drill duration." />
                        </td>
                        <td>
                            <RadioButtons
                                options={[
                                    { value: 1, label: "1 minute" },
                                    { value: 2, label: "2 minutes" },
                                ]}
                                onChange={handleTimerChange}
                                value={timer} />
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

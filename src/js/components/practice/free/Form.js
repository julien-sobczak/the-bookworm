import React, { useState } from 'react';

const Form = (props) => {

    //  Drill
    const [pageTurningDuration, setPageTurningDuration] = useState(props.pageTurningDuration);
    const [paperSize, setPaperSize] = useState(props.paperSize);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            paperSize: paperSize,
            pageTurningDuration: pageTurningDuration,
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
                </tbody>
            </table>
        </>
    );
}

export default Form;
import React from 'react';
import PropTypes from 'prop-types';

import { StyledTable } from '../core/UI';
import Progress from '../toolbox/Progress';

import Button from '@material-ui/core/Button';

import * as string from '../../functions/string';

/**
 * Display the list of readings in progress.
 *
 * @param {Object} props The component properties.
 */
function ReadingsList({ readings, onSwitch }) {

    const handleSelect = (event) => {
        const index = event.target.dataset.index;
        const reading = readings[index];
        onSwitch(reading, index);
    };

    return (
        <div>
            <StyledTable>
                <tbody>
                    {readings.map((reading, index) => {
                        return (
                            <tr key={index}>
                                <td><em>{reading.description.title}</em></td>
                                <td><small>{reading.description.author}</small></td>
                                <td><small>{string.humanReadableDate(reading.lastDate)}</small></td>
                                <td><Progress value={reading.position.progress} showText /></td>
                                <td>
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        onClick={handleSelect}
                                        data-index={index}
                                        className="Clickable">
                                        Read
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
        </div>
    );
}
ReadingsList.propTypes = {
    /**
     * The list of readings in progress.
     */
    readings: PropTypes.array.isRequired,
    /**
     * Called when a user select a reading among his reading list.
     * The callback received the reading element as present in readings as the first argument,
     * and its index as the second argument.
     */
    onSwitch: PropTypes.func,
};
ReadingsList.defaultProps = {
    onSwitch: () => {},
};

export default ReadingsList;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import Text from '../../components/toolbox/Text';

function CalibrationPreview(props) {

    const [value, setValue] = useState(props.value);
    const onChange = props.onChange;

    const increment = (step) => {
        const newValue = Math.min(Math.max(value + step, 0), 200);
        setValue(newValue);
        onChange(newValue);
    };

    const handleEnlarge = () => increment(1);
    const handleShrink = () => increment(-1);

    const Table = styled.table`
        margin: 0 auto;

        td {
            height: calc(1in * ${value/100});
            width: calc(1in * ${value/100});
            text-align: center;
            vertical-align: middle;
            position: relative;
        }

        tr:nth-child(1) > td:nth-child(1) {
            background: black;
            color: white;
            box-shadow: 0 0 10px black;
        }
        tr:nth-child(1) td:nth-child(2),
        tr:nth-child(2) td:nth-child(1) {
            background: rgba(0, 0, 0, 0.5);
        }
        tr:nth-child(1) td:nth-child(3),
        tr:nth-child(2) td:nth-child(2),
        tr:nth-child(3) td:nth-child(1) {
            background: rgba(0, 0, 0, 0.4);
        }
        tr:nth-child(2) td:nth-child(3),
        tr:nth-child(3) td:nth-child(2) {
            background: rgba(0, 0, 0, 0.3);
        }
        tr:nth-child(3) td:nth-child(3) {
            background: rgba(0, 0, 0, 0.2);
        }
    `;

    const Center = styled.div`
        text-align: center;
    `;

    const Buttons = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: 1rem;
    `;

    const Value = styled.span`
        display: inline-block;
        text-align: center;
        background: rgba(0, 0, 0, 0.2);
        color: white;
        padding: 0.5rem;
        border-radius: 0.25rem;
        margin: 1rem 0;
    `;

    return (
        <Center>

            <Table>
                <tbody>
                    <tr>
                        <td><strong>1in</strong><br/><small>2.54cm</small></td>
                        <td><small>2in</small></td>
                        <td><small>3in</small></td>
                    </tr>
                    <tr>
                        <td><small>2in</small></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><small>3in</small></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
            <Buttons>
                <Tooltip title="Too large">
                    <IconButton onClick={handleShrink}>
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                </Tooltip>
                <Value>{value} %</Value>
                <Tooltip title="Too small">
                    <IconButton onClick={handleEnlarge}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Tooltip>
            </Buttons>
            <p>
                <Text manuscript arrow arrowDirection="top" arrowPosition="right" arrowVariant="secondary">Adjust the size.</Text>
            </p>
        </Center>
    );
}

CalibrationPreview.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
};
CalibrationPreview.defaultProps = {
    value: 1,
    onChange: () => {},
};

export default CalibrationPreview;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

const OptionsGame = (props) => {

    const [keyboard, setKeyboard] = useState(props.keyboardDetected);
    const [autoLevel, setAutoLevel] = useState(props.autoLevel);

    const onChange = props.onChange;

    const currentState = () => {
        return {
            keyboard: keyboard,
            autoLevel: autoLevel,
        };
    };

    const handleAutoLevelChange = (event) => {
        const newValue = event.target.checked;
        setAutoLevel(newValue);
        onChange({
            ...currentState(),
            autoLevel: newValue,
        });
    };

    const handleKeyboardChange = (event) => {
        const newValue = event.target.checked;
        setKeyboard(newValue);
        onChange({
            ...currentState(),
            keyboard: newValue,
        });
    };

    return (
        <table className="Setting">
            <tbody>
                <tr>
                    <th>Enable Keyboard:</th>
                    <td>
                        <Switch
                            data-testid="keyboard"
                            checked={keyboard}
                            onChange={handleKeyboardChange} />
                    </td>
                </tr>
                <tr>
                    <th>Auto-Level:</th>
                    <td>
                        <Switch
                            data-testid="autoLevel"
                            checked={autoLevel}
                            onChange={handleAutoLevelChange} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

OptionsGame.propTypes = {
    keyboardDetected: PropTypes.bool,
    autoLevel: PropTypes.bool,
    onChange: PropTypes.func,
};

OptionsGame.defaultProps = {
    keyboardDetected: false,
    autoLevel: false,
};

export default OptionsGame;
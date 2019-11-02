import React, { useState } from 'react';

import Switch from '@material/react-switch';

import "@material/react-switch/dist/switch.css";

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
                            nativeControlId='keyboard'
                            checked={keyboard}
                            onChange={handleKeyboardChange} />
                    </td>
                </tr>
                <tr>
                    <th>Auto-Level:</th>
                    <td>
                        <Switch
                            nativeControlId='autoLevel'
                            checked={autoLevel}
                            onChange={handleAutoLevelChange} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default OptionsGame;
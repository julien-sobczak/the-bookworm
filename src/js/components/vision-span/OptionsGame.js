import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

const OptionsGame = (props) => {

    const [keyboard, setKeyboard] = useState(props.keyboardDetected && props.keyboard);
    const [autoLevel, setAutoLevel] = useState(props.autoLevel);

    React.useEffect(() => {
        setKeyboard(props.keyboard);
        setAutoLevel(props.autoLevel);
    }, [props]);

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
                {props.keyboardDetected && <tr>
                    <th><label htmlFor="keyboard">Enable Keyboard</label>:</th>
                    <td>
                        <Switch
                            id="keyboard"
                            color="primary"
                            checked={keyboard}
                            onChange={handleKeyboardChange} />
                    </td>
                </tr>}
                <tr>
                    <th><label htmlFor="autoLevel">Auto-Level</label>:</th>
                    <td>
                        <Switch
                            id="autoLevel"
                            color="primary"
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
    keyboard: PropTypes.bool,
    autoLevel: PropTypes.bool,
    onChange: PropTypes.func,
};

OptionsGame.defaultProps = {
    keyboardDetected: false,
    keyboard: false,
    autoLevel: false,
};

export default OptionsGame;

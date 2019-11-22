import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color'; // https://casesandberg.github.io/react-color/#examples
import styled from 'styled-components';

/**
 * Simple color picker based on See https://casesandberg.github.io/react-color/#examples
 */
function ColorPicker(props) {

    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [color, setColor] = useState(props.color);

    const handleColorChange = (c) => {
        setColor(c.hex);
        if (props.onChange) {
            props.onChange(c.hex);
        }
    };

    const Color = styled.div`
        width: 36px;
        height: 24px;
        border-radius: 2px;
        background: ${color};
    `;
    const Swatch = styled.div`
        padding: 5px;
        background: '#fff';
        border-radius: 1px;
        box-shadow: 0 0 0 1px black;
        display: inline-block;
        cursor: pointer;
    `;
    const Popover = styled.div`
        position: absolute;
        z-index: 2;
        bottom: 0;
        left: 0;
    `;
    const Cover = styled.div`
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
    `;

    return (

        <div style={{'position': 'relative'}}>
            <Swatch data-testid="swatch" onClick={ () => setDisplayColorPicker(!displayColorPicker) }>
                <Color />
            </Swatch>
            { displayColorPicker ?
                <Popover>
                    <Cover onClick={ () => setDisplayColorPicker(false) }/>
                    <ChromePicker color={ color } onChange={ handleColorChange } />
                </Popover> : null }
        </div>

    );
}

ColorPicker.propTypes = {
    // Default selection
    color: PropTypes.string,
    onChange: PropTypes.func,
};

ColorPicker.defaultProps = {
    color: '#FFF',
    onChange: undefined,
};

export default ColorPicker;

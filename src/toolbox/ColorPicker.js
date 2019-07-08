import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color'; // https://casesandberg.github.io/react-color/#examples
import styled from 'styled-components';

/**
 * Simple color picker based on See https://casesandberg.github.io/react-color/#examples
 */
class ColorPicker extends React.Component {

    static propTypes = {
        // Default selection
        color: PropTypes.string,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        color: '#FFF',
        onChange: undefined,
    };

    constructor(props) {
        super(props);

        this.state = {
            displayColorPicker: false,
            color: props.color,
        };

        this.handleColorChange = this.handleColorChange.bind(this);
    }

    handleColorClick = () => {
        this.setState(state => ({
            ...state,
            displayColorPicker: !state.displayColorPicker,
        }))
    };

    handleColorClose = () => {
        this.setState(state => ({
            ...state,
            displayColorPicker: false,
        }))
    };

    handleColorChange = (color) => {
        const newState = {
            ...this.state,
            color: color.hex,
        }
        this.setState(newState);
        if (this.props.onChange) {
            this.props.onChange(color)
        }
    };

    render() {

        const Color = styled.div`
            width: 36px;
            height: 24px;
            border-radius: 2px;
            background: ${this.state.color};
        `
        const Swatch = styled.div`
            padding: 5px;
            background: '#fff';
            border-radius: 1px;
            box-shadow: 0 0 0 1px black;
            display: inline-block;
            cursor: pointer;
        `
        const Popover = styled.div`
            position: absolute;
            z-index: 2;
            bottom: 0;
            left: 0;
        `
        const Cover = styled.div`
            position: fixed;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 0px;
        `

        return (

            <div style={{'position': 'relative'}}>
                <Swatch onClick={ this.handleColorClick }>
                    <Color />
                </Swatch>
                { this.state.displayColorPicker ?
                    <Popover>
                        <Cover onClick={ this.handleColorClose }/>
                        <ChromePicker color={ this.state.color } onChange={ this.handleColorChange } />
                    </Popover> : null }
            </div>

        );
    }

}

export default ColorPicker;

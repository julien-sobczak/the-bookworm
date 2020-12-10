import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div``;
const Cursor = styled.input`
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background: black;
    outline: none;
    -webkit-transition: .2s;
    transition: opacity .2s;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: black;
        cursor: pointer;
    }

    &::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: black;
        cursor: pointer;
    }
`;

function Slider({id, value, min, max, onChange}) {
    // Implementation based on https://www.w3schools.com/howto/howto_js_rangeslider.asp
    return (
        <Container>
            <Cursor type="range" min={min * 100} max={max * 100} value={value * 100} id={id} onChange={() => onChange({target: { value: event.target.value / 100 }})} />
        </Container>
    );
}

Slider.propTypes = {
    id: PropTypes.string,
    /**
     * The value of the component. The DOM API casts this to a string.
     */
    value: PropTypes.any,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
};

Slider.defaultProps = {
    onChange: () => {},
};

export default Slider;

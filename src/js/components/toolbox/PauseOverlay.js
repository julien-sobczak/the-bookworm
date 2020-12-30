import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Overlay = styled.div`
    /* Full screen */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;

    /* Center text */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    /* Add the blur effect */
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(2px);
`;

const Message = styled.div`
    width: 100%;
    font-weight: bold;
    font-size: 1.5rem;
    padding: 1rem;
    text-align: center;
    background: var(--theme-color);
`;

const PauseOverlay = ({ onResume }) => {

    return (
        <Overlay onClick={onResume}>
            <Message>Click to Resume.</Message>
        </Overlay>
    );
};

PauseOverlay.propTypes = {
    onResume: PropTypes.func,
};

PauseOverlay.defaultProps = {
    onResume: () => {},
};

export default PauseOverlay;

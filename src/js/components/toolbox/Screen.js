import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import CloseIcon from '@material-ui/icons/Close';

function Screen({ className, onClose, scrollable, children }) {

    const FullScreen = css`
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 500;
        background-color: white;
        padding: 1rem;
    `;

    const Centered = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;

    const Scrollable = styled.div`
        padding: 2rem;
        width: 100vw;
        min-height: 100vh;
        overflow-y: scroll;

        ::-webkit-scrollbar {
            width: 0;
            background-color: var(--theme-color);
            width: 0.5em;
        }

        ::-webkit-scrollbar-thumb {
            background-color: black;
            height: 1cm;
        }
    `;

    const Container = styled.div`
        ${FullScreen}
        ${Centered}
    `;

    const CloseButton = styled.button`
        position: fixed;
        top: 1rem;
        left: 1rem;
    `;

    return (
        <Container className={className}>
            {scrollable && <Scrollable>
                <CloseButton onClick={onClose}><CloseIcon /></CloseButton>
                {children}
            </Scrollable>}

            {!scrollable && <>
                <CloseButton onClick={onClose}><CloseIcon /></CloseButton>
                {children}
            </>}
        </Container>
    );
}

Screen.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    scrollable: PropTypes.bool,
    children: PropTypes.node,
};

Screen.defaultProps = {
    onClose: undefined,
    scrollable: true,
};

export default Screen;

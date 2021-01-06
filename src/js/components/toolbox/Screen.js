import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import classnames from 'classnames';

import CloseIcon from '@material-ui/icons/Close';

function Screen({ className, onClose, centered, colored, scrollable, children }) {

    const fullScreen = css`
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 500;
        background-color: white;
        padding: 1rem;
    `;

    const center = css`
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
        ${fullScreen}
        ${center}
    `;

    const CloseButton = styled.button`
        position: fixed;
        top: 1rem;
        left: 1rem;
    `;

    const Centered = styled.div`
        ${center}
        height: 100%;
    `;

    let content = (
        <>
            <CloseButton onClick={onClose}><CloseIcon /></CloseButton>
            {children}
        </>
    );
    if (centered) {
        content = <Centered>{content}</Centered>;
    }
    if (scrollable) {
        content = <Scrollable>{content}</Scrollable>;
    }

    return (
        <Container className={classnames(className, { 'Colored': colored })}>
            {content}
        </Container>
    );
}

Screen.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    scrollable: PropTypes.bool,
    colored: PropTypes.bool,
    centered: PropTypes.bool,
    children: PropTypes.node,
};

Screen.defaultProps = {
    onClose: undefined,
    colored: false,
    centered: true,
    scrollable: true,
};

export default Screen;

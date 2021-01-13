import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Link } from "react-router-dom";
import classnames from 'classnames';

import CloseIcon from '@material-ui/icons/Close';

function Screen({ className, closable, hidden, closeUrl, onClick, onClose, centered, color, colored, scrollable, children }) {

    // Determine the background color
    let backgroundColor = 'white';
    if (colored) {
        if (color !== 'inherit') {
            backgroundColor = color;
        } else {
            backgroundColor = 'var(--theme-color)';
        }
    }

    const fullScreen = css`
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 500;
        background-color: ${backgroundColor};
        padding: 1rem;
    `;

    const hide = css`
        opacity: 0;
        z-index: 0;
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
            background-color: ${backgroundColor};
            width: 0.5em;
        }

        ::-webkit-scrollbar-thumb {
            background-color: black;
            height: 1cm;
        }
    `;

    let Container = styled.div`
        ${fullScreen}
        ${center}
    `;

    if (hidden) {
        Container = styled(Container)`
            ${hide}
        `;
    }

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
            {closable && <CloseButton onClick={onClose}>
                {closeUrl && <Link to={closeUrl}><CloseIcon /></Link>}
                {!closeUrl && <CloseIcon />}
            </CloseButton>}
            {children}
        </>
    );
    if (centered) {
        content = <Centered>{content}</Centered>;
    }
    if (scrollable) {
        content = <Scrollable>{content}</Scrollable>;
    }

    const containerOptionalProps = {};
    if (onClick) {
        containerOptionalProps.onClick = onClick;
    }

    return (
        <Container className={classnames(className)} {...containerOptionalProps}>
            {content}
        </Container>
    );
}

Screen.propTypes = {
    className: PropTypes.string,
    closable: PropTypes.bool,
    // Internal Link URL
    closeUrl: PropTypes.string,
    scrollable: PropTypes.bool,
    hidden: PropTypes.bool,
    color: PropTypes.string,
    colored: PropTypes.bool,
    centered: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
};

Screen.defaultProps = {
    closeUrl: undefined,
    closable: true,
    color: 'inherit',
    hidden: false,
    colored: false,
    centered: true,
    scrollable: true,
    onClick: undefined,
    onClose: () => {},
};

export default Screen;

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

import Screen from '../core/Screen';
import Text from './Text';

/**
 * Screen showing a timer.
 *
 * @param {Object} props The component properties.
 */
function Countdown({ duration, onTimesUp }) {

    const rota = keyframes`
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    `;

    const opa = keyframes`
        0% {
            opacity: 0;
        }
        50%, 100% {
            opacity: 1;
        }
    `;

    const Wrapper = styled.div`
        position: relative;
        background: var(--theme-color);
        transform: rotate(180deg);
        width: 250px;
        height: 250px;
        box-sizing: border-box;

        * {
            box-sizing: border-box;
        }
    `;

    const pie = css`
        width: 50%;
        height: 100%;
        transform-origin: 100% 50%;
        position: absolute;
        background: black;
    `;

    const Spinner = styled.div`
        ${pie}
        border-radius: 100% 0 0 100% / 50% 0 0 50%;
        z-index: 200;
        border-right: none;
        animation: ${rota} ${duration}ms linear 1;
    `;

    const Filler = styled.div`
        ${pie}
        border-radius: 0 100% 100% 0 / 0 50% 50% 0;
        left: 50%;
        opacity: 0;
        z-index: 100;
        animation: ${opa} ${duration}ms steps(1, end) 1 reverse;
        border-left: none;
    `;

    const Mask = styled.div`
        width: 50%;
        height: 100%;
        position: absolute;
        background: inherit;
        opacity: 1;
        z-index: 300;
        animation: ${opa} ${duration}ms steps(1, end) 1;
    `;

    const Note = styled.p`
        margin: 4rem;
        font-size: 1.75rem;
        font-weight: bold;
        letter-spacing: -1px;
    `;

    useEffect(() => {
        setTimeout(onTimesUp, duration);
    });

    return (
        <Screen colored onClick={onTimesUp}>
            <Wrapper>
                <Spinner />
                <Filler />
                <Mask />
            </Wrapper>
            <Note><Text>Click to start immediately</Text></Note>
        </Screen>
    );
}

Countdown.propTypes = {
    /**
     * The duration of the timer in milliseconds.
     */
    duration: PropTypes.number,
    /**
     * Called when time is up.
     * The callback receives no argument.
     */
    onTimesUp: PropTypes.func,
};

Countdown.defaultProps = {
    duration: 3000,
    onTimesUp: function() {},
};

export default Countdown;

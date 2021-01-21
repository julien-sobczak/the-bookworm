import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Screen appearing only on small screen mentioning the non-support on phone devices.
 *
 * @param {Object} props The component properties.
 */
function ScreenTester({minWidth, minHeight}) {

    const Container = styled.div`
        /* Hidden by default */
        visibility: hidden;

        /* Cover the scren */
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        /* Style the text */
        font-family: "Roboto Slab", cursive;
        background: linear-gradient(0deg,
            var(--home-color-8) 0%,    var(--home-color-8) 12.5%,
            var(--home-color-7) 12.5%, var(--home-color-7) 25%,
            var(--home-color-6) 25%,   var(--home-color-6) 37.5%,
            var(--home-color-5) 37.5%, var(--home-color-5) 50%,
            var(--home-color-4) 50%,   var(--home-color-4) 62.5%,
            var(--home-color-3) 62.5%, var(--home-color-3) 75%,
            var(--home-color-2) 75%,   var(--home-color-2) 87.5%,
            var(--home-color-1) 87.5%, var(--home-color-1) 100%
        );
        letter-spacing: 1px;

        /* Center the text */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        svg {
            width: 90%;
        }
        svg text {
            fill: black;
            paint-order: stroke;
            stroke: white;
            stroke-width: 4px;
            stroke-linecap: round;
            stroke-linejoin: round;
            font-weight: 800;
        }

        @media (max-width: ${minWidth}), (max-height: ${minHeight}) {
            visibility: visible;
            z-index: 999;
        }
    `;

    return (
        <Container>
            <svg viewBox="0 0 62 50">
                <text x="3" y="15">Screen</text>
                <text x="3" y="30">Too</text>
                <text x="3" y="45">Small</text>
            </svg>
        </Container>
    );
}

ScreenTester.propTypes = {
    /**
     * Minimum width for the viewport of the application.
     * The value must be a valid CSS dimension.
     */
    minWidth: PropTypes.string.isRequired,
    /**
     * Minimum height for the viewport of the application.
     * The value must be a valid CSS dimension.
     */
    minHeight: PropTypes.string.isRequired,
};

export default ScreenTester;

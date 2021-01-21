import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Max WPM in the bar
const maxWpm = 2000;
// Width of the bar
const widthBar = '1.1cm';

const Bar = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: ${widthBar};
    border: 0.1cm solid black;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
    transition: width 0.2s linear;
`;

const Mark = styled.span`
    position: absolute;
    left: 0.1cm;
    width: ${widthBar};
    text-align: center;
    font-size: 0.7em;
    font-weight: 900;
    color: white;
    margin-top: 0.2cm;
    padding-right: 0.3cm;
`;

const Step = styled.span`
    position: absolute;
    left: ${widthBar};
    background: black;
    color: white;
    font-size: 0.8em;
    padding: 0.4em;
`;

const Cursor = styled.span`
    position: absolute;
    height: ${widthBar};
    width: ${widthBar};
    color: white;
    background-color: black;
    box-shadow: 0 0 0 0.35cm rgba(0; 0; 0; 0.3);
    border-radius: 50%;
    z-index: 2;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

/**
 * Vertical Bar to visualize a WPM among common speed reader types.
 *
 * @param {Object} props The component properties.
 */
function BarWpm({ wpm }) {

    // Calculate the vertical position of the cursor inside the bar
    let position = 50;
    let text = wpm;

    // Support the default WPM (0)
    if (wpm > 0) {
        position = 100 - (wpm * 100 / maxWpm);
    } else {
        text = '?';
    }

    // Adjust to make sure the cursor is always visible
    if (position < 0) {
        position = 0;
    } else if (position > 90) {
        position = 90;
    }

    return (
        <Bar>

            {/* Position the cursor */}
            <Cursor data-testid="wpm-cursor" style={{ top: `${position}%` }}>{text}</Cursor>

            {/* Add markers for comparison */}
            <Mark style={{ top: "10%" }}>{maxWpm}</Mark>
            <Step style={{ top: "10%" }}>Champion</Step>

            <Mark style={{ top: "30%" }}>800</Mark>
            <Step style={{ top: "30%" }}>Speed Reader</Step>

            <Mark style={{ top: "80%" }}>400</Mark>
            <Step style={{ top: "80%" }}>Fast Reader</Step>

            <Mark style={{ top: "90%" }}>200</Mark>
            <Step style={{ top: "90%" }}>Average Reader</Step>

        </Bar>
    );
}

BarWpm.propTypes = {
    /**
     * The User WPM.
     */
    wpm: PropTypes.number,
};

BarWpm.defaultProps = {
    wpm: 200,
};

export default BarWpm;

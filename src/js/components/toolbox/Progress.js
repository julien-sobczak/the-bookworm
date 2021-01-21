import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Small status bar showing the percent of completion.
 *
 * @param {Object} props The component properties.
 */
function Progress({value, showText}) {

    const ProgressContainer = styled.div`
        display: inline-block;
        position: relative;
        width: 3cm;
        height: 0.20cm;
        top: 0.3cm;
        border-radius: 0.1cm;
        background: rgba(0,0,0,0.5);
    `;
    const ProgressBar = styled.div`
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: ${value}%;
        border-radius: 0.1cm;
        background: white;
    `;
    const ProgressText = styled.div`
        position: absolute;
        top: -0.6cm;
        left: 0;
        right: 0;
        font-size: 0.4cm;
        font-weight: 900;
        color: white;
        text-align: center;
    `;

    return (
        <ProgressContainer>
            {showText && <ProgressText>{value} %</ProgressText>}
            <ProgressBar data-testid="bar" />
        </ProgressContainer>
    );
}

Progress.propTypes = {
    /**
     * The current value in percent.
     */
    value: PropTypes.number,
    /**
     * Enable the display of the percent value in the bar.
     */
    showText: PropTypes.bool,
};

Progress.defaultTypes = {
    showText: false,
};

export default Progress;

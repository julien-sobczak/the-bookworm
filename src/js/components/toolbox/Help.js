import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function Help({ tip }) {

    const Icon = styled.span `
        display: inline-block;
        background-color: black;
        color: white;
        text-align: center;
        width: 2rem;
        height: 2rem;
        padding: 0.5rem;
        margin: 0 0.5rem;
        border-radius: 50%;
        font-weight: bold;
    `;

    return (
        // Check Tooltip.css
        <Icon className="tool" data-tip={tip}>?</Icon>
    );
}

Help.propTypes = {
    tip: PropTypes.string.isRequired,
};

export default Help;

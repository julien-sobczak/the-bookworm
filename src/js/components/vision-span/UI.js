import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


/*
 * Vision Span Drills
 */

export const Serie = styled.div`
    margin-top: 0.5em;
    margin-bottom: 0.5em;
`;
export const Line = styled.div`
    line-height: 1.5em;
`;

export function Cell({ valid, highlight }) {
    const DefaultCell = styled.span`
        display: inline-block;
        width: 0.25in;
        text-align: center;
    `;
    const ValidCell = styled(DefaultCell)`
        color: green;
    `;
    const HighlightCell = styled(DefaultCell)`
        background-color: green;
        color: white;
    `;
    if (valid) return <ValidCell />;
    if (highlight) return <HighlightCell />;
    return <DefaultCell />;
}
Cell.propTypes = {
    valid: PropTypes.bool,
    highlight: PropTypes.bool,
};
Cell.defaultProps = {
    valid: false,
    highlight: false,
};

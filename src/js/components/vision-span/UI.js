import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

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

export function Cell({ className, valid, highlight, style, children }) {
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
    const props = {
        className: classnames("Cell", className),
        style: style,
    };
    if (valid) return <ValidCell {...props}>{children}</ValidCell>;
    if (highlight) return <HighlightCell {...props}>{children}</HighlightCell>;
    return <DefaultCell {...props}>{children}</DefaultCell>;
}
Cell.propTypes = {
    className: PropTypes.string,
    valid: PropTypes.bool,
    highlight: PropTypes.bool,
    style: PropTypes.object,
    children: PropTypes.node.isRequired,
};
Cell.defaultProps = {
    className: undefined,
    valid: false,
    highlight: false,
    style: {},
};

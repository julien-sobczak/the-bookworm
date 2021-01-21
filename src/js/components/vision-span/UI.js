import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

//
// This file regroups common UI components specific to the Library section.
//

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

/**
 * A single occurence of a letter to read.
 *
 * Cells are organized in different shapes depending the drill.
 *
 * @param {Object} props The component properties.
 */
export function Cell({ className, valid, style, children, testId }) {
    const DefaultCell = styled.span`
        display: inline-block;
        width: 0.25in;
        text-align: center;
    `;
    const ValidCell = styled(DefaultCell)`
        color: green;
    `;
    const props = {
        className: classnames("Cell", className),
        style: style,
    };
    if (testId) {
        props['data-testid'] = testId;
    }
    if (valid) return <ValidCell {...props}>{children}</ValidCell>;
    return <DefaultCell {...props}>{children}</DefaultCell>;
}
Cell.propTypes = {
    /**
     * A CSS class name to add on the letter.
     */
    className: PropTypes.string,
    /**
     * Determine if the letter has already been entered correctly.
     */
    valid: PropTypes.bool,
    /**
     * Additional CSS styles.
     */
    style: PropTypes.object,
    /**
     * An test identifier to add to the cell element.
     */
    testId: PropTypes.string,
    /**
     * The content of the cell. Must be a single letter.
     */
    children: PropTypes.node.isRequired,
};
Cell.defaultProps = {
    className: undefined,
    valid: false,
    highlight: false,
    testId: undefined,
    style: {},
};

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Screen from '../core/Screen';

//
// This file regroups common UI components specific to the Library section.
//

/**
 * Main screen for the Library section.
 *
 * This component is a wrapper around <Screen> to apply custom styling.
 *
 * @param {Object} props The components props
 */
export function LibraryScreen(props) {
    const Wrapper = styled.div`
        .Bookshelf {
            max-height: 12rem;
            padding: 2em;
        }

        .Bookshelf td {
            height: 2.5em;
            padding: 0.5em;
            border-bottom: 1px solid white;
        }
        .Bookshelf .BookTitle button {
            font-weight: 500;
            color: black;

        }
        .Bookshelf .BookMetadata {
            font-size: 0.8em;
            color: white;
        }


        .LibraryFilters > * {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
         }
        .LibraryFilters input {
            font-size: 150%;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid black;
            border-radius: 0.2em;
            padding: 0.2em;
            width: 100%;
            color: white;
            text-align: center;
        }
        .LibraryFilters input::placeholder {
            color: white;
            opacity: 1; /* Firefox */
        }
        .LibraryFilters li {
            display: inline-block;
            padding: 0.2em;
            text-align: center;
            border-radius: 0.2em;
        }
        .LibraryFilters li.Selected {
            background: rgba(0, 0, 0, 0.5);
            color: white;
            font-weight: bold;
        }
        .LibraryFilters li sup {
            font-size: 0.5em;
            font-weight: 700;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50vh;
            padding: 0.25em 0.5em;
            color: white;
        }
        .LibraryFilters li.Selected sup {
            background-color: var(--theme-color);
            color: black;
        }
        .LibraryFilters button[disabled] {
            cursor: none;
            color: rgba(0, 0, 0, 0.3)
        }
    `;

    return (
        <Wrapper>
            <Screen {...props} className="Library" colored>
                {props.children}
            </Screen>
        </Wrapper>
    );
}
LibraryScreen.propTypes = {
    /**
     * The content of the screen.
     */
    children: PropTypes.node,
};

/**
 * Screen to preview a content.
 *
 * This component is a wrapper around <Screen> to apply custom styling.
 *
 * @param {Object} props The component properties.
 */
export function PreviewContentScreen(props) {
    const Wrapper = styled.div``;

    return (
        <Wrapper>
            <Screen {...props} scrollable>
                {props.children}
            </Screen>
        </Wrapper>
    );
}
PreviewContentScreen.propTypes = {
    /**
     * The content of the screen.
     */
    children: PropTypes.node,
};

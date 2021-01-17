import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Screen from '../core/Screen';

function LibraryScreen(props) {
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
    children: PropTypes.node,
};

function PreviewContentScreen(props) {
    const Wrapper = styled.div`

    `;

    return (
        <Wrapper>
            <Screen className="PreviewContent" {...props} scrollable> {/* TODO remove CSS class */}
                {props.children}
            </Screen>
        </Wrapper>
    );
}
PreviewContentScreen.propTypes = {
    children: PropTypes.node,
};

export { LibraryScreen, PreviewContentScreen };

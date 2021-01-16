import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Screen from './Screen';

function ScreenStats(props) {
    const Wrapper = styled.div`
        table {
            font-weight: 600;
            margin-bottom: 4rem;
            border-radius: 1rem;
            background-color: black;
            color: var(--theme-color);
        }

        th, td {
            padding: 1rem;
            font-size: 150%;
        }
        th {
            text-align: center;
        }
        td {
            text-align: left;
        }
        tr {
            border-bottom: 2px solid var(--theme-color);
        }
    `;

    return (
        <Wrapper>
            <Screen {...props} colored closable={false}>
                {props.children}
            </Screen>
        </Wrapper>
    );
}
ScreenStats.propTypes = {
    children: PropTypes.node,
};

function ScreenDrill(props) {
    const Wrapper = styled.div`

    `;

    return (
        <Wrapper>
            <Screen {...props} closable={false}>
                {props.children}
            </Screen>
        </Wrapper>
    );
}
ScreenDrill.propTypes = {
    children: PropTypes.node,
};


function ScreenLibrary(props) {
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
ScreenLibrary.propTypes = {
    children: PropTypes.node,
};

function ScreenPreviewContent(props) {
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
ScreenPreviewContent.propTypes = {
    children: PropTypes.node,
};

function Form({ children }) {

    const Container = styled.div`
        width: 80%;
        max-width: 10in;
        margin: 0 auto;
        margin-top: 5em;

        p {
            text-align: center;
            margin: 1rem 0 1rem;
        }

        /* Forms are shown on colored backgroud */
        select,
        input {
            /* Desactive default OS style */
            background-color: transparent !important;
            border: 1px solid black;
            padding: 0.5em;
            border-radius: 0.25em;
            margin-right: 0.25em;
        }

        /* Form use table to align fields. */
        table {
            font-weight: 900;
        }
        table td {
            margin: 0.25em 0;
            height: 3em;
            vertical-align: middle;
        }
        table th {
            text-align: right;
            vertical-align: middle;
            color: black;
        }
        table th, table td {
            padding: 0.25rem;
        }
    `;

    return (
        <Container>
            {children}
        </Container>
    );
}

Form.propTypes = {
    children: PropTypes.node,
};

const Scrollable = styled.div`
    /* https://scotch.io/tutorials/customize-the-browsers-scrollbar-with-css */
    overflow-y: scroll;

    &::-webkit-scrollbar {
        width: 0;
        background-color: var(--theme-color);
        width: 0.5em;
    }

    &::-webkit-scrollbar-thumb {
        background-color: black;
        height: 1cm;
    }
`;

const StyledTable = styled.table`
    width: 80%;
    margin: 2em auto;

    td, th {
        text-align: center;
        padding: 0.5cm;
        vertical-align: middle;
    }
    em {
        font-weight: 700;
    }
    thead tr {
        border-bottom: 0.1cm solid black;
    }
    tbody tr {
        border-bottom: 0.1cm solid rgba(0,0,0,0.5);
    }
`;

const DrillControlGroup = styled.div`
    position: fixed;
    z-index: 999;
    right: var(--wide-margin);
    top: var(--wide-margin);
    text-align: right;
`;

const DrillArea = styled.div`
    position: fixed;
    top: 2em;
    left: 2em;
    right: 2em;
    bottom: 2em;

    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

export { Form, ScreenStats, ScreenDrill, ScreenLibrary, ScreenPreviewContent, Scrollable, StyledTable, DrillControlGroup, DrillArea };

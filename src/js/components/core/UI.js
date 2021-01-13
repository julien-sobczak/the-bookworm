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

export { Form, ScreenStats, ScreenDrill, ScreenLibrary, ScreenPreviewContent, Scrollable };

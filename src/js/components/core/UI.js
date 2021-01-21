import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Screen from './Screen';

// This file contains UI components shared among all drills.

/**
 * Wrapper around <Screen> to apply specific styles concerning statistics.
 *
 * @param {Object} props The component properties.
 */
function StatsScreen(props) {
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
StatsScreen.propTypes = {
    children: PropTypes.node,
};

/**
 * Wrapper around <Screen> to apply specific styles to drill screens.
 *
 * @param {Object} props The component properties.
 */
function DrillScreen(props) {
    const Wrapper = styled.div``;

    return (
        <Wrapper>
            <Screen {...props} closable={false}>
                {props.children}
            </Screen>
        </Wrapper>
    );
}
DrillScreen.propTypes = {
    children: PropTypes.node,
};

/**
 * Wrapper around <form> elements to apply specific styles.
 *
 * @param {Object} props The component properties.
 */
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

/**
 * <div> element showing scrollbar when the content cannot fit in the available space.
 */
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

/**
 * <table> element with custom styling.
 */
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

/**
 *  Wrapper around drill controls <Button> elements.
 */
const DrillControlGroup = styled.div`
    position: fixed;
    z-index: 999;
    right: var(--wide-margin);
    top: var(--wide-margin);
    text-align: right;
`;

/**
 * <div> element around drill content.
 */
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

export { Form, StatsScreen, DrillScreen, Scrollable, StyledTable, DrillControlGroup, DrillArea };

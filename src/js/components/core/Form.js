import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
        table td {
            margin: 0.25em 0;
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

export default Form;

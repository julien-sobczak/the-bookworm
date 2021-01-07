import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import InfoIcon from '@material-ui/icons/Info';

const defaults = css`
    font-size: 1rem;
    color: black;
`;

const Text = styled.span`
    ${defaults}
    font-size: ${props => props.size === "small" ? '80%' : (props.size === "large" ? '1.5rem' : '1rem') };
`;

const Error = styled(Text)`
    color: red;
    background: black;
    padding: 0.5rem;
`;

const Manuscript = styled(Text)`
    font-family: 'Sriracha', cursive;
    font-size: 120%;
    font-weight: bold;
`;

const Info = ({ children }) => {
    return (
        <>
            <Text><InfoIcon size="small" /> {children}</Text>
        </>
    );
};
Info.propTypes = {
    children: PropTypes.node.isRequired,
};

const Note = styled(Text)`
    display: inline-block;
    background: black;
    color: white;
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    border-radius: 0.5rem;
    font-family: 'Sriracha', cursive;
`;

export { Text as default, Error, Info, Manuscript, Note };

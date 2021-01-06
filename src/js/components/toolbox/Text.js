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

export { Text as default, Error, Info };

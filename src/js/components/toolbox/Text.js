import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { ReactComponent as ArrowManuscriptPrimaryImage } from '../../../images/arrow-scribble-1.svg';
import { ReactComponent as ArrowManuscriptSecondaryImage } from '../../../images/arrow-scribble-2.svg';
import InfoIcon from '@material-ui/icons/Info';

const defaults = css`
    font-size: 1em;
    color: black;
`;

const Text = styled.span`
    ${defaults}
    font-size: ${props => props.size === "small" ? '80%' : (props.size === "large" ? '1.5em' : '1em') };
    background: ${props => props.background ? 'black' : 'inherit' };
    padding: ${props => props.background ? '0.5em' : 'initial' };
    color: ${props => props.background ? 'white' : 'inherit' };
    border-radius: ${props => props.background ? '50vh' : 'initial' };
`;

const Error = styled(Text)`
    color: red;
    background: black;
    padding: 0.5em;
`;

const Manuscript = ({ children, size, arrow, arrowDirection, arrowPosition, arrowVariant }) => {
    const ManuscriptText = styled(Text)`
        font-size: ${size === "small" ? '0.8em' : (size === "large" ? '1.5em' : '1em') };
        font-family: 'Sriracha', cursive;
        font-weight: bold;
    `;

    const textContent = <ManuscriptText>{children}</ManuscriptText>;
    if (!arrow) {
        return textContent;
    }

    const stylesTransformArrow = {
        'left-top': {
            transform: 'rotate(90deg) scaleX(-1)',
            top: "-1em",
            left: "-3em",
        },
        'right-bottom': {
            transform: 'rotate(-90deg) scaleX(-1)',
            top: "0.5em",
            right: "-4em",
        },
        'left-bottom': {
            transform: 'rotate(90deg)',
            top: "0em",
            left: "-3em",
        },
        'right-top': {
            transform: 'rotate(270deg)',
            top: "-1em",
            right: "-3.5em",
        }
        // TODO complete
    };
    const styles = {
        container: {
            position: "relative",
            display: "inline-block",
            margin: "0.5em",
        },
        arrow: {
            position: "absolute",
            width: "2em",
            height: "2em",
            marginRight: "1em",
            ...stylesTransformArrow[arrowPosition + '-' + arrowDirection],
        },
    };
    const Arrow = (arrowVariant === 'primary') ?
        <ArrowManuscriptPrimaryImage style={styles.arrow} /> :
        <ArrowManuscriptSecondaryImage style={styles.arrow} />;
    return (
        <span style={styles.container}>
            {arrowPosition === 'left' && Arrow}
            {textContent}
            {arrowPosition === 'right' && Arrow}
        </span>
    );
};
Manuscript.propTypes = {
    children: PropTypes.node.isRequired,
    size: PropTypes.string,
    arrow: PropTypes.bool,
    arrowDirection: PropTypes.oneOf(['top', 'bottom']),
    arrowPosition: PropTypes.oneOf(['left', 'right']),
    arrowVariant: PropTypes.oneOf(['primary', 'secondary']),
};
Manuscript.defaultProps = {
    size: "medium",
    arrow: false,
    arrowDirection: 'top',
    arrowPosition: 'left',
    arrowVariant: 'primary',
};

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
    padding: 0.5em 1em;
    margin: 0.5em;
    border-radius: 0.5em;
    font-family: 'Sriracha', cursive;
`;

export { Text as default, Error, Info, Manuscript, Note };

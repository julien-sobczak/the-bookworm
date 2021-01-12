import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ReactComponent as ArrowManuscriptPrimaryImage } from '../../../images/arrow-scribble-1.svg';
import { ReactComponent as ArrowManuscriptSecondaryImage } from '../../../images/arrow-scribble-2.svg';
import InfoIcon from '@material-ui/icons/Info';

const Text = ({ manuscript, background, size, arrow, arrowDirection, arrowPosition, arrowVariant, children }) => {

    const DefaultText = styled.span`
        font-size: 1em;
        color: black;
        font-size: ${size === "small" ? '80%' : (size === "large" ? '1.5em' : '1em') };
        background: ${background ? 'black' : 'inherit' };
        padding: ${background ? '0.5em' : 'initial' };
        color: ${background ? 'white' : 'inherit' };
        border-radius: ${background ? '50vh' : 'initial' };
    `;

    const ManuscriptText = styled(DefaultText)`
        font-family: 'Sriracha', cursive;
        font-weight: bold;
    `;

    const textContent = manuscript ?
        <ManuscriptText>{children}</ManuscriptText> :
        <DefaultText>{children}</DefaultText>;

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
        },
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
Text.propTypes = {
    // Enable to format using a Cursive font
    manuscript: PropTypes.bool,
    // Enable to print the text on a black background
    background: PropTypes.bool,
    // Relative size of the text.
    size: PropTypes.oneOf(["small", "medium", "large"]),
    // Show an arrow.
    arrow: PropTypes.bool,
    // Determine if the arrow points upward or downward.
    arrowDirection: PropTypes.oneOf(['top', 'bottom']),
    // Determine if the array is positioned at the left or right of the text.
    arrowPosition: PropTypes.oneOf(['left', 'right']),
    // Determine the style for the arrow.
    arrowVariant: PropTypes.oneOf(['primary', 'secondary']),
    // Text is passed as children elements.
    children: PropTypes.node.isRequired,
};
Text.defaultProps = {
    manuscript: false,
    background: false,
    size: "medium",
    arrow: false,
    arrowDirection: 'top',
    arrowPosition: 'left',
    arrowVariant: 'primary',
};

const Info = (props) => {
    return (
        <>
            <Text {...props}><InfoIcon size="small" /> {props.children}</Text>
        </>
    );
};
Info.propTypes = {
    ...Text.propTypes,
    children: PropTypes.node.isRequired,
};

export { Text as default, Info };

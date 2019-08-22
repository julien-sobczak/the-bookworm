import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from "../toolbox/Fn";

const Styled = React.forwardRef((props, ref) => {

    const css = function() {
        const defaultClassName = props.className ? props.className + ' ': '';
        const fontFamilyClass = capitalize(props.fontFamily);
        const fontSizeClass = 'Size' + props.fontSize;
        const fontStyleClass = props.fontStyle.split(' ').map(capitalize).join('');
        const chunkStyleClass = 'Chunk' + capitalize(props.chunkStyle);
        return `${defaultClassName}Styled ${fontFamilyClass} ${fontSizeClass} ${fontStyleClass} ${chunkStyleClass}`
    };

    const styles = function() {
        const inheritedStyle = (props.style) ? props.style : {};
        const styles = {
            ...inheritedStyle,
            backgroundColor: props.backgroundColor,
            color: props.color,
        };
        return styles;
    };

    return (
        <div {...props.id && { 'id' : props.id }}
            ref={ref}
            className={css()}
            style={styles()}>
            {props.children}
        </div>
    );

});

Styled.propTypes = {
    // Text options
    fontFamily: PropTypes.string,
    fontSize: PropTypes.string,
    fontStyle: PropTypes.string,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,

    // Chunk options
    chunkStyle: PropTypes.string, // `color`, `highlight`, `underline`
};

Styled.defaultProps = {
    // Text options
    fontFamily: 'Roboto',
    fontSize: '14pt',
    fontStyle: 'normal',
    backgroundColor: 'white',
    color: 'black',

    // Chunk options
    chunkStyle: "highlight",
};

export default Styled;

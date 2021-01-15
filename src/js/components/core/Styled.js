import React from 'react';
import PropTypes from 'prop-types';

import * as string from "../../functions/string";

const defaultTextSettings = {
    fontFamily: 'Roboto',
    fontSize: '14pt',
    fontStyle: 'normal',
    theme: 'Light',
};

const Styled = React.forwardRef((props, ref) => {

    const css = function() {
        const defaultClassName = props.className ? props.className + ' ': '';
        const fontFamilyClass = string.capitalize(props.fontFamily);
        const fontSizeClass = 'Size' + props.fontSize;
        const fontStyleClass = props.fontStyle.split(' ').map(string.capitalize).join('');
        const chunkStyleClass = 'Chunk' + string.capitalize(props.chunkStyle);
        return `${defaultClassName}Styled ${fontFamilyClass} ${fontSizeClass} ${fontStyleClass} ${chunkStyleClass}`;
    };

    const styles = function() {
        const inheritedStyle = (props.style) ? props.style : {};
        const styles = {
            ...inheritedStyle,
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
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.any,

    // Text options
    fontFamily: PropTypes.string,
    fontSize: PropTypes.string,
    fontStyle: PropTypes.string,

    // Chunk options
    chunkStyle: PropTypes.string, // `color`, `highlight`, `underline`
};

Styled.defaultProps = {
    // Text options
    fontFamily: 'Roboto',
    fontSize: '14pt',
    fontStyle: 'normal',

    // Chunk options
    chunkStyle: "highlight",
};

export { Styled as default, defaultTextSettings };
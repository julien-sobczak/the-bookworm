import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as string from "../../functions/string";

const defaultTextSettings = {
    fontFamily: 'Roboto',
    fontSize: '14pt',
    fontStyle: 'normal',
    theme: 'Light',
};

const Styled = React.forwardRef((props, ref) => {

    const fontFamilyClass = string.capitalize(props.fontFamily);
    const fontSizeClass = 'Size' + props.fontSize;
    const fontStyleClass = props.fontStyle.split(' ').map(string.capitalize).join('');
    const chunkStyleClass = 'Chunk' + string.capitalize(props.chunkStyle);
    const classNames = [
        fontFamilyClass,
        fontSizeClass,
        fontStyleClass,
        chunkStyleClass
    ];

    return (
        <div {...props.id && { 'id' : props.id }}
            ref={ref}
            className={classnames('Styled', props.className, ...classNames, { 'Centered': props.centered } )}
            style={props.style}>
            {props.children}
        </div>
    );

});
Styled.displayName = 'Styled';

Styled.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.any,

    centered: PropTypes.bool,

    // Text options
    fontFamily: PropTypes.string,
    fontSize: PropTypes.string,
    fontStyle: PropTypes.string,

    // Chunk options
    chunkStyle: PropTypes.string, // `color`, `highlight`, `underline`
};

Styled.defaultProps = {
    style: {},

    centered: false,

    // Text options
    fontFamily: 'Roboto',
    fontSize: '14pt',
    fontStyle: 'normal',

    // Chunk options
    chunkStyle: "highlight",
};

export { Styled as default, defaultTextSettings };

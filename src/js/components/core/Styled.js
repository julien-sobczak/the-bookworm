import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as string from "../../functions/string";

/**
 * Default properties.
 */
const defaultTextSettings = {
    fontFamily: 'Roboto',
    fontSize: '14pt',
    fontStyle: 'normal',
    theme: 'Light',
};

/**
 * <div> element applying the user text settings on its content.
 *
 * @param {Object} props The component properties.
 */
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
    /**
     * An optional id attribute.
     */
    id: PropTypes.string,
    /**
     * An optional CSS class.
     */
    className: PropTypes.string,
    /**
     * Optional CSS styles.
     */
    style: PropTypes.object,
    /**
     * Content to stylize.
     */
    children: PropTypes.any,
    /**
     * True to center the content vertically and horizontally.
     */
    centered: PropTypes.bool,

    // Text options
    /**
     * The font family.
     */
    fontFamily: PropTypes.string,
    /**
     * The font size.
     */
    fontSize: PropTypes.string,
    /**
     * The font style.
     */
    fontStyle: PropTypes.string,
    /**
     * The chunk style. Only useful for chunking drills.
     */
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

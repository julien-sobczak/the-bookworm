import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from "../toolbox/Fn";

const Styled = React.forwardRef((props, ref) => {

    const css = function() {
        const defaultClassName = props.className ? props.className + ' ': '';
        const fontFamilyClass = capitalize(props.fontFamily);
        const fontSizeClass = 'Size' + props.fontSize;
        const fontStyleClass = props.fontStyle.split(' ').map(capitalize).join('');
        return `${defaultClassName}${fontFamilyClass} ${fontSizeClass} ${fontStyleClass}`
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
    fontFamily: PropTypes.string,
    fontSize: PropTypes.string,
    fontStyle: PropTypes.string,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
};

Styled.defaultProps = {
    fontFamily: 'Roboto',
    fontSize: '14pt',
    fontStyle: 'normal',
    backgroundColor: 'white',
    color: 'black',
};

export default Styled;

import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from "../toolbox/Fn";

class Styled extends React.Component {

    css() {

        const defaultClassName = this.props.className ? this.props.className + ' ': '';
        const fontFamilyClass = capitalize(this.props.fontFamily);
        const fontSizeClass = 'Size' + this.props.fontSize;
        const fontStyleClass = this.props.fontStyle.split(' ').map(capitalize).join('');

        return `${defaultClassName}${fontFamilyClass} ${fontSizeClass} ${fontStyleClass}`
    }

    render() {
        return (
            <div {...this.props.id && { 'id' : this.props.id }}
                className={this.css()}
                style={{backgroundColor: this.props.backgroundColor, color: this.props.color}}>
                {this.props.children}
            </div>
        );
    }

}

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

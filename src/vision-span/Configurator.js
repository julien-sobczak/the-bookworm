import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component used to adjust drill settings.
 */
class Configurator extends React.Component {

    static propTypes = {
        enablePaperSize: PropTypes.bool,

        // Default selection
        fontFamily: PropTypes.string,
        fontSize: PropTypes.string,
        fontStyle: PropTypes.string,
        backgroundColor: PropTypes.string,
        color: PropTypes.string,
    };

    static defaultProps = {
        enablePaperSize: false,
        fontFamily: 'Roboto',
        fontSize: '12pt',
        fontStyle: 'normal',
        backgroundColor: 'white',
        color: 'black',
    };

    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.fontStyle,
            backgroundColor: props.backgroundColor,
            color: props.color,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleFontFamilyClick = this.handleFontFamilyClick.bind(this);
        this.handleFontStyleClick = this.handleFontStyleClick.bind(this);
        this.handleFontSizeClick = this.handleFontSizeClick.bind(this);
    }

    /** Called when the user successfully finish one drill. */
    handleExpand = (event) => {
        this.setState(state =>  ({
            ...state,
            expanded: !state.expanded,
        }))
    }

    handleFontFamilyClick = (event) => {
        const newFontFamily = event.target.dataset.value;
        if (this.state.fontFamily === newFontFamily) return;
        this.setState(state =>  ({
            ...state,
            fontFamily: newFontFamily,
        }))
        this.notifyChange();
    }

    handleFontStyleClick = (event) => {
        const newFontStyle = event.target.dataset.value;
        if (this.state.fontStyle === newFontStyle) return;
        this.setState(state =>  ({
            ...state,
            fontStyle: newFontStyle,
        }))
        this.notifyChange();
    }

    handleFontSizeClick = (event) => {
        const newFontSize = event.target.dataset.value;
        if (this.state.fontSize === newFontSize) return;
        this.setState(state =>  ({
            ...state,
            fontSize: newFontSize,
        }))
        this.notifyChange();
    }

    notifyChange() {
        this.props.onChange({
            fontFamily: this.state.fontFamily,
            fontSize: this.state.fontSize,
            fontStyle: this.state.fontStyle,
            backgroundColor: this.state.backgroundColor,
            color: this.state.color,
        })
    }

    render() {
        return (
            <div className="Configurator">
                {!this.state.expanded && <button className="SettingsButton" onClick={this.handleExpand}><i className="material-icons">style</i></button>}

                {this.state.expanded &&
                    <div className="Settings">
                        <button className="SettingsButton" onClick={this.handleExpand}><i className="material-icons">close</i></button>
                        <div className="Content">
                            <table className="Setting">
                                <tbody>
                                    <tr>
                                        <th>Typeface:</th>
                                        <td>
                                            <span onClick={this.handleFontFamilyClick} className={"Option Roboto " + (this.state.fontFamily === 'Roboto' ? 'selected' : '')} data-value="Roboto">Roboto</span>
                                            <span onClick={this.handleFontFamilyClick} className={"Option SourceCodePro " + (this.state.fontFamily === 'SourceCodePro' ? 'selected' : '')} data-value="SourceCodePro">Source Code Pro</span>
                                            <span onClick={this.handleFontFamilyClick} className={"Option Slabo " + (this.state.fontFamily === 'Slabo' ? 'selected' : '')} data-value="Slabo">Slabo</span>
                                            <span onClick={this.handleFontFamilyClick} className={"Option Sacramento " + (this.state.fontFamily === 'Sacramento' ? 'selected' : '')} data-value="Sacramento">Sacramento</span>
                                            <span onClick={this.handleFontFamilyClick} className={"Option FredokaOne " + (this.state.fontFamily === 'FredokaOne' ? 'selected' : '')} data-value="FredokaOne">Fredoka One</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Variant:</th>
                                        <td>
                                            <span onClick={this.handleFontStyleClick} className={"Option Normal " + (this.state.fontStyle === 'normal' ? 'selected' : '')} data-value="normal">Normal</span>
                                            <span onClick={this.handleFontStyleClick} className={"Option Italic " + (this.state.fontStyle === 'italic' ? 'selected' : '')} data-value="italic">Italic</span>
                                            <span onClick={this.handleFontStyleClick} className={"Option Bold " + (this.state.fontStyle === 'bold' ? 'selected' : '')} data-value="bold">Bold</span>
                                            <span onClick={this.handleFontStyleClick} className={"Option BoldItalic " + (this.state.fontStyle === 'bold italic' ? 'selected' : '')} data-value="bold italic">Bold Italic</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Size:</th>
                                        <td>
                                            <span onClick={this.handleFontSizeClick} className={"Option Size10pt " + (this.state.fontSize === '10pt' ? 'selected' : '')} data-value="10pt">10 pt</span>
                                            <span onClick={this.handleFontSizeClick} className={"Option Size12pt " + (this.state.fontSize === '12pt' ? 'selected' : '')} data-value="12pt">12 pt</span>
                                            <span onClick={this.handleFontSizeClick} className={"Option Size14pt " + (this.state.fontSize === '14pt' ? 'selected' : '')} data-value="14pt">14 pt</span>
                                            <span onClick={this.handleFontSizeClick} className={"Option Size16pt " + (this.state.fontSize === '16pt' ? 'selected' : '')} data-value="16pt">16 pt</span>
                                            <span onClick={this.handleFontSizeClick} className={"Option Size18pt " + (this.state.fontSize === '18pt' ? 'selected' : '')} data-value="18pt">18 pt</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        );
    }

}

export default Configurator;

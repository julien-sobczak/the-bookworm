import React from 'react';
import PropTypes from 'prop-types';
import ColorPicker from '../toolbox/ColorPicker';

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
        theme: PropTypes.string,
        backgroundColor: PropTypes.string,
        color: PropTypes.string,
    };

    static defaultProps = {
        enablePaperSize: false,
        fontFamily: 'Roboto',
        fontSize: '12pt',
        fontStyle: 'normal',
        theme: 'Light',
        backgroundColor: Configurator.THEME_LIGHT_TEXT_COLOR,
        color: Configurator.THEME_LIGHT_BACKGROUND_COLOR,
    };

    constructor(props) {
        super(props);

        this.state = {
            expanded: false,

            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.fontStyle,
            theme: props.theme,
            backgroundColor: props.backgroundColor,
            color: props.color,
        };

        this.handleFontFamilyClick = this.handleFontFamilyClick.bind(this);
        this.handleFontStyleClick = this.handleFontStyleClick.bind(this);
        this.handleFontSizeClick = this.handleFontSizeClick.bind(this);
        this.handleThemeClick = this.handleThemeClick.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleBackgroundColorChange = this.handleBackgroundColorChange.bind(this);
    }


    /** Called when the user expand/unexpand the setting panel. */
    handleExpand = (event) => {
        this.setState(state => ({
            ...state,
            expanded: !state.expanded,
        }))
    }


    handleFontFamilyClick = (event) => {
        const newFontFamily = event.target.dataset.value;
        if (this.state.fontFamily === newFontFamily) return;
        const newState = {
            ...this.state,
            fontFamily: newFontFamily,
        }
        this.setState(newState);
        this.props.onChange(newState)
    }

    handleFontStyleClick = (event) => {
        const newFontStyle = event.target.dataset.value;
        if (this.state.fontStyle === newFontStyle) return;
        const newState = {
            ...this.state,
            fontStyle: newFontStyle,
        }
        this.setState(newState);
        this.props.onChange(newState)
    }

    handleFontSizeClick = (event) => {
        const newFontSize = event.target.dataset.value;
        if (this.state.fontSize === newFontSize) return;
        const newState = {
            ...this.state,
            fontSize: newFontSize,
        }
        this.setState(newState);
        this.props.onChange(newState)
    }

    handleThemeClick = (event) => {
        const newTheme = event.target.dataset.value;
        if (this.state.theme === newTheme) return;
        const newState = {
            ...this.state,
            theme: newTheme,
        }
        if (newTheme === 'Light') {
            newState.color = Configurator.THEME_LIGHT_TEXT_COLOR;
            newState.backgroundColor = Configurator.THEME_LIGHT_BACKGROUND_COLOR;
        } else if (newTheme === 'Dark') {
            newState.color = Configurator.THEME_DARK_TEXT_COLOR;
            newState.backgroundColor = Configurator.THEME_DARK_BACKGROUND_COLOR;
        }
        this.setState(newState);
        this.props.onChange(newState)
    }

    handleColorChange = (color) => {
        const newState = {
            ...this.state,
            color: color,
        }
        this.setState(newState);
        this.props.onChange(newState)
    };

    handleBackgroundColorChange = (color) => {
        const newState = {
            ...this.state,
            backgroundColor: color,
        }
        this.setState(newState);
        this.props.onChange(newState)
    };


    render() {

        return (
            <div className="Configurator">
                {!this.state.expanded && <button className="SettingsButton" onClick={this.handleExpand}><i className="material-icons">style</i></button>}

                {this.state.expanded &&
                    <div className="Settings">
                        <button className="SettingsCloseButton" onClick={this.handleExpand}><i className="material-icons">close</i></button>
                        <div className="Content">
                            <table className="Setting">
                                <tbody>
                                    <tr>
                                        <th>Typeface:</th>
                                        <td>
                                            <span onClick={this.handleFontFamilyClick} className={"GraphicOption Roboto " + (this.state.fontFamily === 'Roboto' ? 'selected' : '')} data-value="Roboto">Roboto</span>
                                            <span onClick={this.handleFontFamilyClick} className={"GraphicOption SourceCodePro " + (this.state.fontFamily === 'SourceCodePro' ? 'selected' : '')} data-value="SourceCodePro">Source Code Pro</span>
                                            <span onClick={this.handleFontFamilyClick} className={"GraphicOption Slabo " + (this.state.fontFamily === 'Slabo' ? 'selected' : '')} data-value="Slabo">Slabo</span>
                                            <span onClick={this.handleFontFamilyClick} className={"GraphicOption Sacramento " + (this.state.fontFamily === 'Sacramento' ? 'selected' : '')} data-value="Sacramento">Sacramento</span>
                                            <span onClick={this.handleFontFamilyClick} className={"GraphicOption FredokaOne " + (this.state.fontFamily === 'FredokaOne' ? 'selected' : '')} data-value="FredokaOne">Fredoka One</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Variant:</th>
                                        <td>
                                            <span onClick={this.handleFontStyleClick} className={"GraphicOption Normal " + (this.state.fontStyle === 'normal' ? 'selected' : '')} data-value="normal">Normal</span>
                                            <span onClick={this.handleFontStyleClick} className={"GraphicOption Italic " + (this.state.fontStyle === 'italic' ? 'selected' : '')} data-value="italic">Italic</span>
                                            <span onClick={this.handleFontStyleClick} className={"GraphicOption Bold " + (this.state.fontStyle === 'bold' ? 'selected' : '')} data-value="bold">Bold</span>
                                            <span onClick={this.handleFontStyleClick} className={"GraphicOption BoldItalic " + (this.state.fontStyle === 'bold italic' ? 'selected' : '')} data-value="bold italic">Bold Italic</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Size:</th>
                                        <td>
                                            <span onClick={this.handleFontSizeClick} className={"GraphicOption Size10pt " + (this.state.fontSize === '10pt' ? 'selected' : '')} data-value="10pt">10 pt</span>
                                            <span onClick={this.handleFontSizeClick} className={"GraphicOption Size12pt " + (this.state.fontSize === '12pt' ? 'selected' : '')} data-value="12pt">12 pt</span>
                                            <span onClick={this.handleFontSizeClick} className={"GraphicOption Size14pt " + (this.state.fontSize === '14pt' ? 'selected' : '')} data-value="14pt">14 pt</span>
                                            <span onClick={this.handleFontSizeClick} className={"GraphicOption Size16pt " + (this.state.fontSize === '16pt' ? 'selected' : '')} data-value="16pt">16 pt</span>
                                            <span onClick={this.handleFontSizeClick} className={"GraphicOption Size18pt " + (this.state.fontSize === '18pt' ? 'selected' : '')} data-value="18pt">18 pt</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Theme:</th>
                                        <td>
                                            <span onClick={this.handleThemeClick} className={"GraphicOption Light "  + (this.state.theme === 'Light'  ? 'selected' : '')} data-value="Light">Light</span>
                                            <span onClick={this.handleThemeClick} className={"GraphicOption Dark "   + (this.state.theme === 'Dark'   ? 'selected' : '')} data-value="Dark">Dark</span>
                                            <span onClick={this.handleThemeClick} className={"GraphicOption Custom " + (this.state.theme === 'Custom' ? 'selected' : '')} data-value="Custom">Custom</span>
                                            { this.state.theme === 'Custom' &&
                                              <span style={{display: 'flex'}}>
                                                <span className="SubGraphicOption">Text:</span>       <ColorPicker color={ this.state.color }           onChange={ this.handleColorChange } />
                                                <span className="SubGraphicOption">Background:</span> <ColorPicker color={ this.state.backgroundColor } onChange={ this.handleBackgroundColorChange } />
                                              </span>
                                            }
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

Configurator.THEME_LIGHT_TEXT_COLOR = '#000000';
Configurator.THEME_LIGHT_BACKGROUND_COLOR = '#FFFFFF';
Configurator.THEME_DARK_TEXT_COLOR = Configurator.THEME_LIGHT_BACKGROUND_COLOR;
Configurator.THEME_DARK_BACKGROUND_COLOR = Configurator.THEME_LIGHT_TEXT_COLOR;

export default Configurator;

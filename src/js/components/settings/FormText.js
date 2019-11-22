import React, { useState } from 'react';
import PropTypes from 'props-types';

import Styled from './Styled';

const FormText = (props) => {

    const [fontFamily, setFontFamily] = useState(props.fontFamily);
    const [fontSize, setFontSize] = useState(props.fontSize);
    const [fontStyle, setFontStyle] = useState(props.fontStyle);
    const [theme, setTheme] = useState(props.theme);
    const onChange = props.onChange;

    const currentState = () => {
        return {
            fontFamily: fontFamily,
            fontSize: fontSize,
            fontStyle: fontStyle,
            theme: theme,
        };
    };

    const handleFontFamilyClick = (event) => {
        const newValue = event.target.dataset.value;
        if (fontFamily === newValue) return;
        setFontFamily(newValue);
        onChange({
            ...currentState(),
            fontFamily: newValue,
        });
    };

    const handleFontStyleClick = (event) => {
        const newValue = event.target.dataset.value;
        if (fontStyle === newValue) return;
        setFontStyle(newValue);
        onChange({
            ...currentState(),
            fontStyle: newValue,
        });
    };

    const handleFontSizeClick = (event) => {
        const newValue = event.target.dataset.value;
        if (fontSize === newValue) return;
        setFontSize(newValue);
        onChange({
            ...currentState(),
            fontSize: newValue,
        });
    };

    const handleThemeClick = (event) => {
        const newValue = event.target.dataset.value;
        if (theme === newValue) return;
        setTheme(newValue);
        onChange({
            ...currentState(),
            theme: newValue,
        });
    };

    return (
        <table className="Setting">
            <tbody>
                <tr>
                    <th>Typeface:</th>
                    <td>
                        <span onClick={handleFontFamilyClick} className={"GraphicOption Roboto "        + (fontFamily === 'Roboto' ? 'selected' : '')} data-value="Roboto">Roboto</span>
                        <span onClick={handleFontFamilyClick} className={"GraphicOption SourceCodePro " + (fontFamily === 'SourceCodePro' ? 'selected' : '')} data-value="SourceCodePro">Source Code Pro</span>
                        <span onClick={handleFontFamilyClick} className={"GraphicOption Slabo "         + (fontFamily === 'Slabo' ? 'selected' : '')} data-value="Slabo">Slabo</span>
                        <span onClick={handleFontFamilyClick} className={"GraphicOption Sacramento "    + (fontFamily === 'Sacramento' ? 'selected' : '')} data-value="Sacramento">Sacramento</span>
                        <span onClick={handleFontFamilyClick} className={"GraphicOption FredokaOne "    + (fontFamily === 'FredokaOne' ? 'selected' : '')} data-value="FredokaOne">Fredoka One</span>
                    </td>
                </tr>
                <tr>
                    <th>Variant:</th>
                    <td>
                        <span onClick={handleFontStyleClick} className={"GraphicOption Normal "     + (fontStyle === 'normal' ? 'selected' : '')} data-value="normal">Normal</span>
                        <span onClick={handleFontStyleClick} className={"GraphicOption Italic "     + (fontStyle === 'italic' ? 'selected' : '')} data-value="italic">Italic</span>
                        <span onClick={handleFontStyleClick} className={"GraphicOption Bold "       + (fontStyle === 'bold' ? 'selected' : '')} data-value="bold">Bold</span>
                        <span onClick={handleFontStyleClick} className={"GraphicOption BoldItalic " + (fontStyle === 'bold italic' ? 'selected' : '')} data-value="bold italic">Bold Italic</span>
                    </td>
                </tr>
                <tr>
                    <th>Size:</th>
                    <td>
                        <span onClick={handleFontSizeClick} className={"GraphicOption Size10pt " + (fontSize === '10pt' ? 'selected' : '')} data-value="10pt">10 pt</span>
                        <span onClick={handleFontSizeClick} className={"GraphicOption Size12pt " + (fontSize === '12pt' ? 'selected' : '')} data-value="12pt">12 pt</span>
                        <span onClick={handleFontSizeClick} className={"GraphicOption Size14pt " + (fontSize === '14pt' ? 'selected' : '')} data-value="14pt">14 pt</span>
                        <span onClick={handleFontSizeClick} className={"GraphicOption Size16pt " + (fontSize === '16pt' ? 'selected' : '')} data-value="16pt">16 pt</span>
                        <span onClick={handleFontSizeClick} className={"GraphicOption Size18pt " + (fontSize === '18pt' ? 'selected' : '')} data-value="18pt">18 pt</span>
                    </td>
                </tr>
                <tr>
                    <th>Theme:</th>
                    <td>
                        <span onClick={handleThemeClick} className={"GraphicOption ThemeLight " + (theme === 'Light' ? 'selected' : '')} data-value="Light">Light</span>
                        <span onClick={handleThemeClick} className={"GraphicOption ThemeSepia " + (theme === 'Sepia' ? 'selected' : '')} data-value="Sepia">Sepia</span>
                        <span onClick={handleThemeClick} className={"GraphicOption ThemeDark "  + (theme === 'Dark'  ? 'selected' : '')} data-value="Dark">Dark</span>
                        <span onClick={handleThemeClick} className={"GraphicOption ThemeBlack " + (theme === 'Black' ? 'selected' : '')} data-value="Black">Black</span>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

FormText.propTypes = {
    ...Styled.propTypes,
    onChange: PropTypes.func.isRequired,
};

FormText.defaultProps = {
    ...Styled.defaultProps,
};

export default FormText;

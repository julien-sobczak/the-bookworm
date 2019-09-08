import React, { useState } from 'react';

const FormText = (props) => {

    const [fontFamily, setFontFamily] = useState(props.fontFamily);
    const [fontSize, setFontSize] = useState(props.fontSize);
    const [fontStyle, setFontStyle] = useState(props.fontStyle);
    const [theme, setTheme] = useState(props.theme);
    const onChange = props.onChange;

    const handleFontFamilyClick = (event) => {
        const newFontFamily = event.target.dataset.value;
        if (fontFamily === newFontFamily) return;
        setFontFamily(newFontFamily)
        onChange({
            fontFamily: newFontFamily,
            fontSize: fontSize,
            fontStyle: fontStyle,
            theme: theme,
        });
    }

    const handleFontStyleClick = (event) => {
        const newFontStyle = event.target.dataset.value;
        if (fontStyle === newFontStyle) return;
        setFontStyle(newFontStyle)
        onChange({
            fontFamily: fontFamily,
            fontSize: fontSize,
            fontStyle: newFontStyle,
            theme: theme,
        });
    }

    const handleFontSizeClick = (event) => {
        const newFontSize = event.target.dataset.value;
        if (fontSize === newFontSize) return;
        setFontSize(newFontSize);
        onChange({
            fontFamily: fontFamily,
            fontSize: newFontSize,
            fontStyle: fontStyle,
            theme: theme,
        });
    }

    const handleThemeClick = (event) => {
        const newTheme = event.target.dataset.value;
        if (theme === newTheme) return;
        setTheme(newTheme);
        onChange({
            fontFamily: fontFamily,
            fontSize: fontSize,
            fontStyle: fontStyle,
            theme: newTheme,
        });
    }

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
                        <span onClick={handleThemeClick} className={"GraphicOption Light "  + (theme === 'Light'  ? 'selected' : '')} data-value="Light">Light</span>
                        <span onClick={handleThemeClick} className={"GraphicOption Dark "   + (theme === 'Dark'   ? 'selected' : '')} data-value="Dark">Dark</span>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default FormText;

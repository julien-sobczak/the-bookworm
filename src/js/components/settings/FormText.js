import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Styled from '../toolbox/Styled';
import RadioButtons from '../toolbox/RadioButtons';

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
        const newValue = event.target.value;
        if (fontFamily === newValue) return;
        setFontFamily(newValue);
        onChange({
            ...currentState(),
            fontFamily: newValue,
        });
    };

    const handleFontStyleClick = (event) => {
        const newValue = event.target.value;
        if (fontStyle === newValue) return;
        setFontStyle(newValue);
        onChange({
            ...currentState(),
            fontStyle: newValue,
        });
    };

    const handleFontSizeClick = (event) => {
        const newValue = event.target.value;
        if (fontSize === newValue) return;
        setFontSize(newValue);
        onChange({
            ...currentState(),
            fontSize: newValue,
        });
    };

    const handleThemeClick = (event) => {
        const newValue = event.target.value;
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
                    <th><label>Typeface</label>:</th>
                    <td>
                        <RadioButtons 
                            options={[
                                { value: 'Roboto',        label: 'Roboto',          className: 'Roboto'        },
                                { value: 'SourceCodePro', label: 'Source Code Pro', className: 'SourceCodePro' },
                                { value: 'Slabo',         label: 'Slabo',           className: 'Slabo'         },
                                { value: 'Sacramento',    label: 'Sacramento',      className: 'Sacramento'    },
                                { value: 'FredokaOne',    label: 'Fredoka One',     className: 'FredokaOne'    },
                            ]} 
                            onChange={handleFontFamilyClick} 
                            value={fontFamily} />
                    </td>
                </tr>
                <tr>
                    <th><label>Variant</label>:</th>
                    <td>
                        <RadioButtons
                            options={[
                                { value: 'normal',      label: 'Normal',      className: 'Normal'     },
                                { value: 'italic',      label: 'Italic',      className: 'Italic'     },
                                { value: 'bold',        label: 'Bold',        className: 'Bold'       },
                                { value: 'bold italic', label: 'Bold Italic', className: 'BoldItalic' },
                            ]} 
                            onChange={handleFontStyleClick} 
                            value={fontStyle} />
                    </td>
                </tr>
                <tr>
                    <th><label>Size</label>:</th>
                    <td>
                        <RadioButtons 
                            options={[
                                { value: '10pt', label: '10 pt', classsName: 'Size10pt' },
                                { value: '12pt', label: '12 pt', classsName: 'Size12pt' },
                                { value: '14pt', label: '14 pt', classsName: 'Size14pt' },
                                { value: '16pt', label: '16 pt', classsName: 'Size16pt' },
                                { value: '18pt', label: '18 pt', classsName: 'Size18pt' },
                            ]} 
                            onChange={handleFontSizeClick} 
                            value={fontSize} />
                    </td>
                </tr>
                <tr>
                    <th><label>Theme</label>:</th>
                    <td>
                        <RadioButtons 
                            options={[
                                { value: 'Light', className: 'ThemeLight' },
                                { value: 'Sepia', className: 'ThemeSepia' },
                                { value: 'Dark',  className: 'ThemeDark'  },
                                { value: 'Black', className: 'ThemeBlack' },
                            ]} 
                            onChange={handleThemeClick} 
                            value={theme} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

FormText.propTypes = {
    ...Styled.propTypes,
    onChange: PropTypes.func,
};

FormText.defaultProps = {
    ...Styled.defaultProps,
};

export default FormText;

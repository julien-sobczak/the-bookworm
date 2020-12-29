import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormText from './FormText';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { getByLabelText } = render(
        <FormText fontFamily="Roboto" fontSize="12pt" fontStyle="normal" theme="Light" onChange={mockFn} />
    );

    // Change the font family
    fireEvent.click(getByLabelText("Monospace"));
    expect(mockFn.mock.calls[0][0]).toMatchObject({
        fontFamily: "SourceCodePro",
        fontSize: "12pt",
        fontStyle: "normal",
        theme: "Light",
    });

    // Change the font size
    fireEvent.click(getByLabelText("Bold Italic"));
    expect(mockFn.mock.calls[1][0]).toMatchObject({
        fontFamily: "SourceCodePro",
        fontSize: "12pt",
        fontStyle: "bold italic",
        theme: "Light",
    });

    // Change the font style
    fireEvent.click(getByLabelText("14 pt"));
    expect(mockFn.mock.calls[2][0]).toMatchObject({
        fontFamily: "SourceCodePro",
        fontSize: "14pt",
        fontStyle: "bold italic",
        theme: "Light",
    });

    // Change the theme
    fireEvent.click(getByLabelText("Dark"));
    expect(mockFn.mock.calls[3][0]).toMatchObject({
        fontFamily: "SourceCodePro",
        fontSize: "14pt",
        fontStyle: "bold italic",
        theme: "Dark",
    });
});

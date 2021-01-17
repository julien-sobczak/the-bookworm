import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Viewer from './Viewer';

afterEach(cleanup);

test('letters', async () => {
    const drill = {
        lines: [
            {
                columns: [
                    { label: "A", valid: true, },
                    { label: "B", valid: true, },
                    { label: "C", valid: true, },
                ],
            },
            {
                columns: [
                    { label: "D", valid: true, },
                    { label: "E", },
                    { label: "F", },
                ],
            },
            {
                columns: [
                    { label: "G", },
                    { label: "H", },
                    { label: "I", },
                ],
            },
        ],
    };

    const { getByTestId } = render(
        <Viewer
            size={3}
            span="1in"
            drill={drill} />
    );

    // Check characters are well organized
    expect(getByTestId('Line0Column0')).toHaveTextContent("A");
    expect(getByTestId('Line0Column1')).toHaveTextContent("B");
    expect(getByTestId('Line0Column2')).toHaveTextContent("C");
    expect(getByTestId('Line1Column0')).toHaveTextContent("D");
    expect(getByTestId('Line1Column1')).toHaveTextContent("E");
    expect(getByTestId('Line1Column2')).toHaveTextContent("F");
    expect(getByTestId('Line2Column0')).toHaveTextContent("G");
    expect(getByTestId('Line2Column1')).toHaveTextContent("H");
    expect(getByTestId('Line2Column2')).toHaveTextContent("I");
});

test('larger cell width', async () => {
    const drill = {
        lines: [
            {
                columns: [
                    { label: "A", valid: true, },
                    { label: "B", valid: true, },
                    { label: "C", valid: true, },
                ],
            },
            {
                columns: [
                    { label: "D", valid: true, },
                    { label: "E", },
                    { label: "F", },
                ],
            },
            {
                columns: [
                    { label: "G", },
                    { label: "H", },
                    { label: "I", },
                ],
            },
        ],
    };

    const { getByTestId } = render(
        <Viewer
            size={3}
            span="1.75in"
            drill={drill} />
    );

    // Each span is marked by a CSS class
    expect(getByTestId('Line0Column0').parentNode).toHaveClass("Width1_75in");
    expect(getByTestId('Line1Column1').parentNode).toHaveClass("Width1_75in");
    expect(getByTestId('Line2Column2').parentNode).toHaveClass("Width1_75in");
});

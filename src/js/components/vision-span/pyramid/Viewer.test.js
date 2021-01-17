import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Viewer from './Viewer';

afterEach(cleanup);

test('letter positions', async () => {
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
        ],
    };

    const { getByTestId } = render(
        <Viewer
            lines={2}
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
});

test('a larger column span', async () => {
    const drill = {
        lines: [
            {
                columns: [
                    { label: "A", },
                    { label: "B", },
                    { label: "C", },
                ],
            },
            {
                columns: [
                    { label: "D", },
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
            {
                columns: [
                    { label: "J", },
                    { label: "K", },
                    { label: "L", },
                ],
            },
            {
                columns: [
                    { label: "M", },
                    { label: "N", },
                    { label: "O", },
                ],
            },
            {
                columns: [
                    { label: "P", },
                    { label: "Q", },
                    { label: "R", },
                ],
            },
            {
                columns: [
                    { label: "S", },
                    { label: "T", },
                    { label: "U", },
                ],
            },
        ],
    };

    const { getByTestId } = render(
        <Viewer
            lines={7}
            spans="2in"
            drill={drill} />
    );

    // Each span is marked by a CSS class
    expect(getByTestId('Line0Column1')).toHaveClass("SpanLeft0in   SpanRight0in");
    expect(getByTestId('Line1Column1')).toHaveClass("SpanLeft0_5in SpanRight0_5in");
    expect(getByTestId('Line2Column1')).toHaveClass("SpanLeft1in   SpanRight1in");
    expect(getByTestId('Line3Column1')).toHaveClass("SpanLeft1_5in SpanRight1_5in");
    expect(getByTestId('Line4Column1')).toHaveClass("SpanLeft2in   SpanRight2in");
    expect(getByTestId('Line5Column1')).toHaveClass("SpanLeft2_5in SpanRight2_5in");
    expect(getByTestId('Line6Column1')).toHaveClass("SpanLeft2in   SpanRight2in");
    // FIXME debug this test... Must have stop at SpanLeft2in/SpanRight2in
});

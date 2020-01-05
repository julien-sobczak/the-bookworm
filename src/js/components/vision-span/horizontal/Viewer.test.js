import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Viewer from './Viewer';

afterEach(cleanup);

test('with two series and two lines', async () => {
    const drill = [
      {
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
          }
        ],
      },
      {
        lines: [
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
          }
        ],
      },
    ];

    const { getByTestId } = render(
        <Viewer
            lines={2}
            columns={3}
            spans={["0.5in", "0.5in"]}
            drill={drill} />
    );

    // Check characters are well organized
    expect(getByTestId('Serie0Line0Column0')).toHaveTextContent("A");
    expect(getByTestId('Serie0Line0Column1')).toHaveTextContent("B");
    expect(getByTestId('Serie0Line0Column2')).toHaveTextContent("C");
    expect(getByTestId('Serie0Line1Column0')).toHaveTextContent("D");
    expect(getByTestId('Serie0Line1Column1')).toHaveTextContent("E");
    expect(getByTestId('Serie0Line1Column2')).toHaveTextContent("F");
    expect(getByTestId('Serie1Line0Column0')).toHaveTextContent("G");
    expect(getByTestId('Serie1Line0Column1')).toHaveTextContent("H");
    expect(getByTestId('Serie1Line0Column2')).toHaveTextContent("I");
    expect(getByTestId('Serie1Line1Column0')).toHaveTextContent("J");
    expect(getByTestId('Serie1Line1Column1')).toHaveTextContent("K");
    expect(getByTestId('Serie1Line1Column2')).toHaveTextContent("L");

    // Valid entries mut be highlighted
    expect(getByTestId('Serie0Line1Column0')).toHaveClass('valid');
    expect(getByTestId('Serie0Line1Column1')).not.toHaveClass('valid');
});

test('larger column spans', async () => {
  const drill = [
    {
      lines: [
        {
          columns: [
            { label: "A", },
            { label: "B", },
            { label: "C", },
            { label: "D", },
            { label: "E", },
          ],
        },
      ],
    },
  ];

  const { getByTestId } = render(
      <Viewer
          lines={1}
          columns={5}
          spans={["1.75in", "0.5in", "0.5in", "1.75in"]}
          drill={drill} />
  );

  // Each span is marked by a CSS class
  expect(getByTestId('Serie0Line0Column0')).toHaveClass("SpanLeft0in    SpanRight1_75in");
  expect(getByTestId('Serie0Line0Column1')).toHaveClass("SpanLeft1_75in SpanRight0_5in");
  expect(getByTestId('Serie0Line0Column2')).toHaveClass("SpanLeft0_5in  SpanRight0_5in");
  expect(getByTestId('Serie0Line0Column3')).toHaveClass("SpanLeft0_5in  SpanRight1_75in");
  expect(getByTestId('Serie0Line0Column4')).toHaveClass("SpanLeft1_75in SpanRight0in");
});
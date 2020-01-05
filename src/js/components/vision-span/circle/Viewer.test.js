import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Viewer from './Viewer';

afterEach(cleanup);

test('letter positions', async () => {
    const drill = {
      center:      { label: "A", valid: true, },
      top:         { label: "B", valid: true, },
      topRight:    { label: "C", valid: true, },
      right:       { label: "D", valid: true, },
      bottomRight: { label: "E", valid: true, },
      bottom:      { label: "F", },
      bottomLeft:  { label: "G", },
      left:        { label: "H", },
      topLeft:     { label: "I", },
    };

    const { getByTestId } = render(
        <Viewer
            span="0.5in"
            drill={drill} />
    );

    // Check characters are well organized
    expect(getByTestId('LetterCenter')).toHaveTextContent("A");
    expect(getByTestId('LetterTop')).toHaveTextContent("B");
    expect(getByTestId('LetterTopRight')).toHaveTextContent("C");
    expect(getByTestId('LetterRight')).toHaveTextContent("D");
    expect(getByTestId('LetterBottomRight')).toHaveTextContent("E");
    expect(getByTestId('LetterBottom')).toHaveTextContent("F");
    expect(getByTestId('LetterBottomLeft')).toHaveTextContent("G");
    expect(getByTestId('LetterLeft')).toHaveTextContent("H");
    expect(getByTestId('LetterTopLeft')).toHaveTextContent("I");

    // Valid entries mut be highlighted
    expect(getByTestId('LetterRight')).toHaveClass('valid');
    expect(getByTestId('LetterLeft')).not.toHaveClass('valid');
});

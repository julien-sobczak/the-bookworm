import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BarWpm from './BarWpm';

it('shows a cursor to place the given WPM', () => {
    const { getByTestId } = render(<BarWpm wpm={400}/>);
    expect(getByTestId('wpm-cursor')).toHaveStyle("top: 80%");
    expect(getByTestId('wpm-cursor')).toHaveTextContent("400");
});

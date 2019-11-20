import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Paper from './Paper';

it('copy children', () => {
    const { queryByText, getByTestId } = render(<Paper paperSize="A5">Hello World</Paper>);

    expect(queryByText('Hello World')).toBeTruthy();
    expect(getByTestId('paper')).toHaveClass('PaperA5');
});

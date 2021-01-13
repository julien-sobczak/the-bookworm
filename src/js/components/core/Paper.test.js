import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Paper from './Paper';

afterEach(cleanup);
    
it('copies children', () => {
    const { queryByText } = render(<Paper>Hello World</Paper>);
    expect(queryByText('Hello World')).toBeTruthy();
});

it('supports various paper sizes', () => {
    const { container, queryByText } = render(<Paper paperSize="A5">Hello World</Paper>);
    expect(container.firstChild).toHaveClass('PaperA5');
    expect(queryByText('Hello World')).toBeTruthy();
});
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PanelError from './PanelError';

afterEach(cleanup);

it('shows the error if message is not empty', () => {
    const mockFn = jest.fn();
    const { getByTestId, getByText } = render(<PanelError message="Too bad" onClear={mockFn}/>);
    expect(getByText('Too bad')).toBeTruthy();

    // Close the panel
    getByTestId('panel').click();
    expect(mockFn.mock.calls.length).toBe(1);
});

it('hides the panel if message is empty', () => {
    const { queryByTestId } = render(<PanelError message="" />);
    expect(queryByTestId('panel')).toBeFalsy();
});

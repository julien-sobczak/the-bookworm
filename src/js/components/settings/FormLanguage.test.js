import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormLanguage from './FormLanguage';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { getByTestId } = render(<FormLanguage native="French" onChange={mockFn} />);

    // Change the native language
    fireEvent.change(getByTestId('native'), { target: { value: 'English' } });

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toMatchObject({
        native: "English",
    });
});

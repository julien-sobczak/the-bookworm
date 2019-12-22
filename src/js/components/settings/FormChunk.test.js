import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormChunk from './FormChunk';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { getByLabelText } = render(
        <FormChunk chunkStyle="color" onChange={mockFn} />
    );

    // Change the chunk style
    fireEvent.click(getByLabelText('Highlight'));

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toMatchObject({
        chunkStyle: "highlight",
    });
});

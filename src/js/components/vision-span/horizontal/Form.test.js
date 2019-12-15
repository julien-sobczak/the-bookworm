import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { getByTestId } = render(
        <Form 
            lines={1} 
            columns={3} 
            spans={["0.5in", "0.5in"]}
            multiple={false}
            autoLevel={true}
            onChange={mockFn} 
            keyboardDetected={false} />
    );
});

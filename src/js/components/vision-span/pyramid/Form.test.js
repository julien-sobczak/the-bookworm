import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { getByLabelText, getByAltText } = render(
        <Form
            lines={1}
            span="0.5in"
            autoLevel
            keyboardDetected={false}
            onChange={mockFn} />
    );

    // Edit Game settings

    // Disable auto-level
    const autoLevelSwitch = getByLabelText(/Auto-Level/i);
    autoLevelSwitch.click();
    fireEvent.change(autoLevelSwitch, { target: { checked: "" } });

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toMatchObject({
        keyboard: false,
        autoLevel: false,
    });

    // Edit Drill settings

    // Change the span
    fireEvent.change(getByLabelText(/Span/i), { target: { value: '2in' } });

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(2);
    expect(mockFn.mock.calls[1][0]).toMatchObject({
        keyboard: false,
        autoLevel: false,
        span: '2in',
    });

    // Finally, change the number of lines
    fireEvent.click(getByAltText(/5 lines/i));

    // Should trigger the last onChange event
    expect(mockFn.mock.calls.length).toEqual(3);
    expect(mockFn.mock.calls[2][0]).toMatchObject({
        keyboard: false,
        autoLevel: false,
        lines: 5,
        span: '2in',
    });
});

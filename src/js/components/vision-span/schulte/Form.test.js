import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { getByLabelText, getByAltText } = render(
        <Form 
            size={3} 
            span="1in"
            autoLevel={true}
            keyboardDetected={false}
            onChange={mockFn} />
    );

    // Edit Game settings

    // Enable the keyboard 
    const keyboardSwitch = getByLabelText(/Enable Keyboard/i);
    keyboardSwitch.click();
    fireEvent.change(keyboardSwitch, { target: { checked: true } });

    // Disable auto-level
    const autoLevelSwitch = getByLabelText(/Auto-Level/i);
    autoLevelSwitch.click();
    fireEvent.change(autoLevelSwitch, { target: { checked: "" } });

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(2);
    expect(mockFn.mock.calls[1][0]).toMatchObject({
        keyboard: true,
        autoLevel: false,
    });

    // Edit Drill settings

    // Change the span
    fireEvent.change(getByLabelText(/Span/i), { target: { value: '2in' } });

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(3);
    expect(mockFn.mock.calls[2][0]).toMatchObject({
        span: '2in',
    });

    // Change the size
    fireEvent.click(getByAltText(/width 5/i));

    // Should trigger the last onChange event
    expect(mockFn.mock.calls.length).toEqual(4);
    expect(mockFn.mock.calls[3][0]).toMatchObject({
        size: 5,
        span: '2in',
        keyboard: true,
        autoLevel: false,
    });
});

import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { getByTestId, queryByTestId } = render(
        <Form 
            size={3} 
            span="1in"
            autoLevel={true}
            keyboardDetected={false}
            onChange={mockFn} />
    );

    // Edit Game settings

    // Enable the keyboard 
    const keyboardSwitch = getByTestId('keyboard');
    const keyboardCheckbox = keyboardSwitch.querySelector('[type="checkbox"]');
    keyboardCheckbox.click();
    fireEvent.change(keyboardCheckbox, { target: { checked: true } });

    // Disable auto-level
    const autoLevelSwitch = getByTestId('autoLevel');
    const autoLevelCheckbox = autoLevelSwitch.querySelector('[type="checkbox"]');
    autoLevelCheckbox.click();
    fireEvent.change(autoLevelCheckbox, { target: { checked: "" } });

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(2);
    expect(mockFn.mock.calls[1][0]).toMatchObject({
        keyboard: true,
        autoLevel: false,
    });

    // Edit Drill settings

    // Change the span
    fireEvent.change(getByTestId('span'), { target: { value: '2in' } })

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(3);
    expect(mockFn.mock.calls[2][0]).toMatchObject({
        span: '2in',
    });

    // Change the size
    fireEvent.click(getByTestId('size5'));

    // Should trigger the last onChange event
    expect(mockFn.mock.calls.length).toEqual(4);
    expect(mockFn.mock.calls[3][0]).toMatchObject({
        size: 5,
        span: '2in',
        keyboard: true,
        autoLevel: false,
    });
});

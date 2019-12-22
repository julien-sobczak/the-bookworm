import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { getByTestId, queryByTestId } = render(
        <Form 
            lines={1} 
            columns={3} 
            spans={["0.5in", "0.5in"]}
            multiple={false}
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
    fireEvent.change(getByTestId('span0'), { target: { value: '2in' } })

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(3);
    expect(mockFn.mock.calls[2][0]).toMatchObject({
        spans: ['2in', '2in'],
    });

    // Change the number of columns
    fireEvent.click(getByTestId('columns5'));

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(4);
    expect(mockFn.mock.calls[3][0]).toMatchObject({
        spans: ['0.25in', '0.25in', '0.25in', '0.25in'], // Reset the spans
    });

    // Change just one span
    fireEvent.change(getByTestId('span0'), { target: { value: '2in' } });

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(5)
    expect(mockFn.mock.calls[4][0]).toMatchObject({
        spans: ['2in', '0.25in', '0.25in', '2in'], // Spans are symmetrical
    });

    // Finally, change the number of series
    expect(queryByTestId('lines2')).not.toBeInTheDocument();
    fireEvent.click(getByTestId('seriesMultiple')); // Lines control should appear
    await wait(() => {
        expect(queryByTestId('lines2')).toBeInTheDocument()
    });
    fireEvent.click(getByTestId('lines2'));

    // Should trigger the last onChange event
    expect(mockFn.mock.calls.length).toEqual(7)
    expect(mockFn.mock.calls[6][0]).toMatchObject({
        keyboard: true,
        autoLevel: false,
        lines: 2,
        columns: 5,
        multiple: true,
        spans: ['2in', '0.25in', '0.25in', '2in'], // Spans are symmetrical
    });
});

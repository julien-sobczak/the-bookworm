import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { queryByTestId, getByLabelText } = render(
        <Form 
            pageTurningDuration={300}
            paperSize="a5"
            pacerWpm={0}
            timer={0}
            onChange={mockFn} />
    );

    // Advanced options are disabled by default
    expect(queryByTestId('pacerWpm')).not.toBeInTheDocument();
    expect(queryByTestId('timer1')).not.toBeInTheDocument();

    // Change the page turning duration
    fireEvent.change(getByLabelText(/page turn duration/i), { target: { value: 1000 } });

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toMatchObject({
        pageTurningDuration: 1000,
    });

    // Change the page turning duration
    fireEvent.change(getByLabelText(/paper/i), { target: { value: 'a6' } });
    
    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(2);
    expect(mockFn.mock.calls[1][0]).toMatchObject({
        paperSize: 'a6',
        pageTurningDuration: 1000,
    });
});

it('supports a pacer', async () => {
    const mockFn = jest.fn();
    const { queryByTestId, getByLabelText } = render(
        <Form 
            pageTurningDuration={300}
            paperSize="a5"
            pacerWpm={250}
            timer={0}
            onChange={mockFn} />
    );

    // Advanced options are disabled by default
    expect(queryByTestId('pacerWpm')).toBeInTheDocument();
    
    // Change the page turning duration
    fireEvent.change(getByLabelText(/pacer WPM/i), { target: { value: 300 } });

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toMatchObject({
        pacerWpm: 300,
    });
});

it('supports a timer', async () => {
    const mockFn = jest.fn();
    const { queryByTestId, getByTestId } = render(
        <Form 
            pageTurningDuration={300}
            paperSize="a5"
            pacerWpm={0}
            timer={1}
            onChange={mockFn} />
    );

    // Advanced options are disabled by default
    expect(queryByTestId('timer1')).toBeInTheDocument();
    
    // Change the page turning duration
    fireEvent.click(getByTestId('timer2'));

    // Should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toMatchObject({
        timer: 2,
    });
});
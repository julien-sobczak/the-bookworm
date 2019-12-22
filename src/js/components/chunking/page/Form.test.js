import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { getByLabelText, queryByLabelText, getByTestId, queryByTestId } = render(
        <Form 
            wpm={250}
            pageTurningDuration={100}
            paperSize="a5"
            disableVisualRegression={false}
            disableVisualProgression={false}
            disableVisualProblemStyle="fade"
            chunkMode="width"
            chunkWidth="2in"
            chunkWords={2}
            chunkStops={1}
            onChange={mockFn} />
    );

    // Only chunkMode width options are visible
    expect(queryByLabelText(/chunk width/i)).toBeInTheDocument();
    // chunkMode words options are hidden
    expect(queryByLabelText(/chunk words/i)).not.toBeInTheDocument();
    // chunkMode stops options are hidden
    expect(queryByTestId('chunkStops1')).not.toBeInTheDocument();
    
    // Change the chunk mode to words
    fireEvent.click(getByTestId('chunkModeWords'));
    expect(queryByLabelText(/chunk words/i)).toBeInTheDocument();
    expect(queryByLabelText(/chunk width/i)).not.toBeInTheDocument();
    
    // Change the chunk mode to words
    fireEvent.click(getByTestId('chunkModeStops'));
    expect(queryByTestId('chunkStops1')).toBeInTheDocument();
    expect(queryByLabelText(/chunk words/i)).not.toBeInTheDocument();
    
    // Restore the original chunk mode 
    fireEvent.click(getByTestId('chunkModeWidth'));
    // and change the chunk width
    fireEvent.change(getByLabelText(/chunk width/i), { target: { value: '1in' } });
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(4);
    expect(mockFn.mock.calls[3][0]).toMatchObject({
        chunkMode: 'width',
        chunkWidth: '1in',
    });

    // Try to tune the chunk mode words
    fireEvent.click(getByTestId('chunkModeWords'));
    // and change the number of words
    fireEvent.change(getByLabelText(/chunk words/i), { target: { value: 3 } });
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(6);
    expect(mockFn.mock.calls[5][0]).toMatchObject({
        chunkMode: 'words',
        chunkWords: 3,
    });

    // Try to tune the chunk mode stops
    fireEvent.click(getByTestId('chunkModeStops'));
    // and change the number of stops
    fireEvent.click(getByTestId('chunkStops3'));
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(8);
    expect(mockFn.mock.calls[7][0]).toMatchObject({
        chunkMode: 'stops',
        chunkStops: 3,
    });

    // Increase the WPM
    fireEvent.change(getByLabelText(/wpm/i), { target: { value: 500 } });
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(9);
    expect(mockFn.mock.calls[8][0]).toMatchObject({
        wpm: 500,
    });

    // Reduce the page turning duration
    fireEvent.change(getByLabelText(/page turn duration/i), { target: { value: 50 } });
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(10);
    expect(mockFn.mock.calls[9][0]).toMatchObject({
        pageTurningDuration: 50,
    });

    // Change the paper size
    fireEvent.change(getByLabelText(/paper/i), { target: { value: "a6" } });
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(11);
    expect(mockFn.mock.calls[10][0]).toMatchObject({
        paperSize: 'a6',
    });

    // Play with visual problems
    expect(queryByTestId('styleTransparent')).not.toBeInTheDocument();
    fireEvent.click(getByLabelText(/Disable visual regression/i));
    fireEvent.change(getByLabelText(/Disable visual regression/i), { target: { checked: true } }); // enable
    expect(queryByTestId('styleTransparent')).toBeInTheDocument();
    fireEvent.click(getByLabelText(/Disable visual progression/i));
    fireEvent.change(getByLabelText(/Disable visual progression/i), { target: { checked: true } }); // enable
    expect(queryByTestId('styleTransparent')).toBeInTheDocument();
    fireEvent.click(getByTestId('styleFade'));
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(14);
    expect(mockFn.mock.calls[13][0]).toMatchObject({
        disableVisualRegression: true,
        disableVisualProgression: true,
        disableVisualProblemStyle: 'fade',
    });
});

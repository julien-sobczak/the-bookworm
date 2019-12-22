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
            columns={2}
            columnWidth="2in"
            linesMax={10}
            chunkMode="width"
            chunkWidth="2in"
            chunkWidthMin="2in"
            chunkWidthMax="2in"
            chunkWords={2}
            chunkTransition="wave"
            chunkSteps={5}
            onChange={mockFn} />
    );

    // Only chunkMode width options are visible
    expect(queryByLabelText(/chunk width/i)).toBeInTheDocument();
    // chunkMode words options are hidden
    expect(queryByLabelText(/chunk words/i)).not.toBeInTheDocument();
    // chunkMode dynamic options are hidden
    expect(queryByLabelText(/Min/i)).not.toBeInTheDocument();
    expect(queryByLabelText(/Max/i)).not.toBeInTheDocument();
    expect(queryByTestId('chunkTransitionWave')).not.toBeInTheDocument();
    expect(queryByLabelText(/Steps/i)).not.toBeInTheDocument();
    
    // Change the chunk mode to words
    fireEvent.click(getByTestId('chunkModeWords'));
    expect(queryByLabelText(/chunk words/i)).toBeInTheDocument();
    expect(queryByLabelText(/chunk width/i)).not.toBeInTheDocument();
    
    // Change the chunk mode to words
    fireEvent.click(getByTestId('chunkModeDynamic'));
    expect(queryByLabelText(/Min/i)).toBeInTheDocument();
    expect(queryByLabelText(/Max/i)).toBeInTheDocument();
    expect(queryByTestId('chunkTransitionWave')).toBeInTheDocument();
    expect(queryByLabelText(/Steps/i)).toBeInTheDocument();
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
    fireEvent.click(getByTestId('chunkModeDynamic'));
    // and change the options
    fireEvent.change(getByLabelText(/Min/i), { target: { value: '0.5in' } })
    fireEvent.change(getByLabelText(/Max/i), { target: { value: '1.75in' } })
    fireEvent.click(getByTestId('chunkTransitionStep'));
    fireEvent.change(getByLabelText(/Steps/i), { target: { value: 10 } })
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(11);
    expect(mockFn.mock.calls[10][0]).toMatchObject({
        chunkMode: 'dynamic',
        chunkWidthMin: '0.5in',
        chunkWidthMax: '1.75in',
        chunkTransition: 'step',
        chunkSteps: 10,
    });

    // Increase the WPM
    fireEvent.change(getByLabelText(/wpm/i), { target: { value: 500 } });
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(12);
    expect(mockFn.mock.calls[11][0]).toMatchObject({
        wpm: 500,
    });

    // Reduce the number of columns
    fireEvent.click(getByTestId('columns3'));
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(13);
    expect(mockFn.mock.calls[12][0]).toMatchObject({
        columns: 3,
    });

    // Change the column width
    fireEvent.change(getByLabelText(/width/i), { target: { value: "2.5in" } });
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(14);
    expect(mockFn.mock.calls[13][0]).toMatchObject({
        columnWidth: '2.5in',
    });

    // Change the number of lines
    fireEvent.click(getByTestId('linesMax20'));
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(15);
    expect(mockFn.mock.calls[14][0]).toMatchObject({
        linesMax: 20,
    });
});

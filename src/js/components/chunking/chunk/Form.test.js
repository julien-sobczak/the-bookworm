import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

afterEach(cleanup);

it('allows editing values', async () => {
    const mockFn = jest.fn();
    const { getByLabelText, queryByLabelText, getByTestId, queryByTestId } = render(
        <Form
            wpm={250}
            linesPerChunk={1}
            neighborChunksPosition="horizontal"
            showPreviousChunk={false}
            showNextChunk={false}
            chunkMode="width"
            chunkWidth="2in"
            chunkWords={1}
            chunkWidthMin="0.25in"
            chunkWidthMax="2.5in"
            chunkTransition="step"
            chunkSteps={10}
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
    expect(mockFn.mock.calls.length).toEqual(10);
    expect(mockFn.mock.calls[9][0]).toMatchObject({
        chunkMode: 'dynamic',
        chunkWidthMin: '0.5in',
        chunkWidthMax: '1.75in',
        chunkTransition: 'step',
        chunkSteps: 10,
    });

    // Increase the WPM
    fireEvent.change(getByLabelText(/wpm/i), { target: { value: 500 } });
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(11);
    expect(mockFn.mock.calls[10][0]).toMatchObject({
        wpm: 500,
    });

    // Increase the number of lines
    fireEvent.click(getByTestId('linesPerChunk2'));
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(12);
    expect(mockFn.mock.calls[11][0]).toMatchObject({
        linesPerChunk: 2,
    });

    // Show surrounding chunks
    expect(queryByTestId('neighborChunksPositionVertical')).not.toBeInTheDocument();
    fireEvent.click(getByLabelText(/show previous chunk/i));
    fireEvent.change(getByLabelText(/show previous chunk/i), { target: { checked: true } });
    expect(queryByTestId('neighborChunksPositionVertical')).toBeInTheDocument();
    fireEvent.click(getByLabelText(/show next chunk/i));
    fireEvent.change(getByLabelText(/show next chunk/i), { target: { checked: true } });
    expect(queryByTestId('neighborChunksPositionVertical')).toBeInTheDocument();
    fireEvent.click(getByTestId('neighborChunksPositionVertical'));
    // should trigger onChange event
    expect(mockFn.mock.calls.length).toEqual(15);
    expect(mockFn.mock.calls[14][0]).toMatchObject({
        showPreviousChunk: true,
        showNextChunk: true,
        neighborChunksPosition: 'vertical',
    });
});

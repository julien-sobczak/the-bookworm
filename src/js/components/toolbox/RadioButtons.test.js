import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RadioButtons from './RadioButtons';

afterEach(cleanup);

it('displays each option', () => {
    const { getByText } = render(<RadioButtons value={2} options={[[1, "One column"], [2, "Two columns"]]} />);
    expect(getByText("One column")).toBeInTheDocument();
    expect(getByText("Two columns")).toBeInTheDocument();

    // Second option must be selected
    expect(getByText("One column").classList.contains('selected')).toBe(false);
    expect(getByText("Two columns").classList.contains('selected')).toBe(true);
});

it('supports string values', () => {
    const mockFn = jest.fn();
    const { getByText } = render(
        <RadioButtons 
            value="blur" 
            options={[["fade", "Fade"], ["blur", "Blur"]]}
            onChange={mockFn} />
    );
    
    fireEvent.click(getByText("Fade"));
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toBe("fade");

    fireEvent.click(getByText("Blur"));
    expect(mockFn.mock.calls.length).toEqual(2);
    expect(mockFn.mock.calls[1][0]).toBe("blur");
});

it('supports integer values', () => {
    const mockFn = jest.fn();
    const { getByText } = render(
        <RadioButtons 
            value={2} 
            options={[[1, "One column"], [2, "Two columns"]]}
            onChange={mockFn} />
    );

    fireEvent.click(getByText("One column"));
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toBe(1);

    fireEvent.click(getByText("Two columns"));
    expect(mockFn.mock.calls.length).toEqual(2);
    expect(mockFn.mock.calls[1][0]).toBe(2);
});

it('supports boolean values', () => {
    const mockFn = jest.fn();
    const { getByText } = render(
        <RadioButtons 
            value={false} 
            options={[[false, "Single"], [true, "Multiple"]]}
            onChange={mockFn} />
    );
    
    fireEvent.click(getByText("Multiple"));
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toBe(true);

    fireEvent.click(getByText("Single"));
    expect(mockFn.mock.calls.length).toEqual(2);
    expect(mockFn.mock.calls[1][0]).toBe(false);
});
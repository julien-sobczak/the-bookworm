import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RadioButtons from './RadioButtons';

afterEach(cleanup);

it('displays each option', () => {
    const { getByText } = render(
        <RadioButtons 
            value={2} 
            options={[{ value: 1, label: "One column"}, { value: 2, label: "Two columns" }]} />);
    expect(getByText("One column")).toBeInTheDocument();
    expect(getByText("Two columns")).toBeInTheDocument();

    // Second option must be selected
    expect(getByText("One column").closest('span').classList.contains('selected')).toBe(false);
    expect(getByText("Two columns").closest('span').classList.contains('selected')).toBe(true);
});

it('triggers onChange callback string values', () => {
    const mockFn = jest.fn();
    const { getByText } = render(
        <RadioButtons 
            value={2} 
            options={[{ value: 1, label: "One column"}, { value: 2, label: "Two columns"}]}
            onChange={mockFn} />
    );

    fireEvent.click(getByText("One column"));
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toMatchObject({ target: { value: 1 } });

    fireEvent.click(getByText("Two columns"));
    expect(mockFn.mock.calls.length).toEqual(2);
    expect(mockFn.mock.calls[1][0]).toMatchObject({ target: { value: 2 } });
});

it('supports alt on input', () => {
    const mockFn = jest.fn();
    const { getByAltText } = render(
        <RadioButtons 
            value={2} 
            options={[{ value: 1, alt: "One column"}, { value: 2, alt: "Two columns"}]}
            onChange={mockFn} />
    );

    fireEvent.click(getByAltText("One column"));
    expect(mockFn.mock.calls.length).toEqual(1);
    expect(mockFn.mock.calls[0][0]).toMatchObject({ target: { value: 1 } });

    fireEvent.click(getByAltText("Two columns"));
    expect(mockFn.mock.calls.length).toEqual(2);
    expect(mockFn.mock.calls[1][0]).toMatchObject({ target: { value: 2 } });
});

it('uses values as labels if omitted', () => {
    const mockFn = jest.fn();
    const { getByText, getByLabelText } = render(
        <RadioButtons 
            value="horizontal"
            options={[{ value: "vertical"}, { value: "horizontal"}]} 
            onChange={mockFn} />
    );

    expect(getByText("Vertical")).toBeInTheDocument(); // Capitalize the value
    expect(getByText("Horizontal")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Vertical"));
    fireEvent.click(getByLabelText("Horizontal"));

    expect(mockFn.mock.calls.length).toEqual(2);
    expect(mockFn.mock.calls[0][0]).toMatchObject({ target: { value: "vertical" } });
    expect(mockFn.mock.calls[1][0]).toMatchObject({ target: { value: "horizontal" } });
});
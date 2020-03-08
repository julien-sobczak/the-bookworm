import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Measurer from './Measurer';

it('measures the width of inches and texts in pixels', () => {
    const mockFn = jest.fn();
    render(
        <div>
            <div id="root-chunker"></div>
            <Measurer onChange={mockFn} elementId="measurer">Test</Measurer>
        </div>);
    // The code considers 1em = 16px when running outside a browser
    expect(mockFn.mock.calls[0][0]).toMatchObject({
        '0in': { width:   0, height: 16 },
        '1in': { width: 100, height: 16 },
        '2in': { width: 200, height: 16 },
        '3in': { width: 300, height: 16 },
        '4in': { width: 400, height: 16 },
    });

    // The code considers one letter is equals to 10px
    expect(Measurer.measure("Test")).toEqual([40, 16]);
});

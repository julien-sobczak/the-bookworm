import React from 'react';
import { render, cleanup, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Drill from './Drill';

afterEach(cleanup);

it('allows the user to enter characters using the keyboard', async () => {
    const mockDrillFn = jest.fn();
    const mockCompleteFn = jest.fn();
    
    const { container, getByTitle } = render(
        <Drill 
            lines={1} 
            columns={3} 
            spans={["0.5in", "0.5in"]}
            multiple={false}
            autoLevel={false}
            keyboard={true}
            onNewDrill={mockDrillFn}
            onComplete={mockCompleteFn} />
    );

    expect(mockDrillFn.mock.calls.length).toEqual(1);
    const drill = mockDrillFn.mock.calls[0][0];

    expect(drill).toHaveLength(1); // Multiple series is disabled

    // Pass the drill
    press(container, drill[0].lines[0].columns[0].label);
    press(container, drill[0].lines[0].columns[1].label);
    press(container, drill[0].lines[0].columns[2].label);

    // Check results
    fireEvent.click(getByTitle('Stop'));
    expect(mockCompleteFn.mock.calls.length).toEqual(1);
    const results = mockCompleteFn.mock.calls[0][0];
    expect(results.stats).toMatchObject({
        "totalAnswers": 3,
        "correctAnswers": 3,
        "wrongAnswers": 0,
    });

    // A new drill must have been generated
    expect(mockDrillFn.mock.calls.length).toEqual(2);
});

function press(domNode, character) {
    const code = character.charCodeAt(0);
    fireEvent.keyUp(domNode, { key: character, code: code, keyCode: code, charCode: code });
}
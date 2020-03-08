import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Drill from './Drill';
import * as interaction from '../../../functions/interaction';
import * as engine from '../../../functions/engine';

afterEach(cleanup);

it('allows the user to enter characters using the keyboard', async () => {
    const mockDrillFn = jest.fn();
    const mockCompleteFn = jest.fn();

    const { container, getByTitle } = render(
        <Drill
            span="0.5in"
            autoLevel={false}
            keyboard={true}
            onNewDrill={mockDrillFn}
            onComplete={mockCompleteFn} />
    );

    expect(mockDrillFn.mock.calls.length).toEqual(1);
    const drill = mockDrillFn.mock.calls[0][0];
    expect(drill).not.toBeNull();

    // Pass the drill
    completeDrillWithoutError(container, drill);

    // Check results
    fireEvent.click(getByTitle('Stop'));
    expect(mockCompleteFn.mock.calls.length).toEqual(1);
    const results = mockCompleteFn.mock.calls[0][0];
    expect(results.stats).toMatchObject({
        "totalAnswers": 9,
        "correctAnswers": 9,
        "wrongAnswers": 0,
    });

    // A new drill must have been generated
    expect(mockDrillFn.mock.calls.length).toEqual(2);
});

it('allows the user to change the span', async () => {
    const mockLevelFn = jest.fn();
    const { getByTitle } = render(
        <Drill
            span="0.5in"
            spanControls={true}
            onLevelChange={mockLevelFn} />
    );

    // Increase the span
    fireEvent.click(getByTitle("Increase span"));
    expect(mockLevelFn.mock.calls.length).toEqual(1);

    // Reduce the span
    fireEvent.click(getByTitle("Reduce span"));
    expect(mockLevelFn.mock.calls.length).toEqual(2);
});

it('allows playing without keyboard', async () => {
    const mockDrillFn = jest.fn();
    const mockLevelFn = jest.fn();
    const { container } = render(
        <Drill
            span="0.5in"
            keyboard={false}
            onNewDrill={mockDrillFn}
            onLevelChange={mockLevelFn} />
    );

    // Initial drill was generated
    expect(mockDrillFn.mock.calls.length).toEqual(1);

    // Pass to the next drill
    fireEvent.keyUp(container, { keyCode: interaction.KEY_RIGHT });
    expect(mockDrillFn.mock.calls.length).toEqual(2);

    // Try again
    fireEvent.keyUp(container, { keyCode: interaction.KEY_RIGHT });
    expect(mockDrillFn.mock.calls.length).toEqual(3);

    // Increase the level
    fireEvent.keyUp(container, { keyCode: interaction.KEY_UP });
    expect(mockLevelFn.mock.calls.length).toEqual(1);
    expect(mockLevelFn.mock.calls[0][0]).toMatchObject({
        span: "0.75in",
    });

    // Reduce the level
    fireEvent.keyUp(container, { keyCode: interaction.KEY_DOWN });
    expect(mockLevelFn.mock.calls.length).toEqual(2);
    expect(mockLevelFn.mock.calls[1][0]).toMatchObject({
        span: "0.5in",
    });
});

it('supports auto-level mode', async () => {
    const mockDrillFn = jest.fn();
    const mockLevelFn = jest.fn();

    const { container } = render(
        <Drill
            span="0.5in"
            autoLevel={true}
            keyboard={true}
            onNewDrill={mockDrillFn}
            onLevelChange={mockLevelFn} />
    );

    expect(mockDrillFn.mock.calls.length).toEqual(1);
    let drill = mockDrillFn.mock.calls[0][0];
    expect(drill).not.toBeNull();

    // Pass the drill without errors
    completeDrillWithoutError(container, drill);

    // Level UP
    expect(mockLevelFn.mock.calls.length).toEqual(1);
    expect(mockLevelFn.mock.calls[0][0]).toMatchObject({
        span: "0.75in",
    });

    // A new drill must have been generated
    expect(mockDrillFn.mock.calls.length).toEqual(2);
    drill = mockDrillFn.mock.calls[1][0];
    expect(drill).not.toBeNull();

    // Pass the drill with just one error
    completeDrillWithNErrors(container, drill, 1);

    // Level ==
    expect(mockLevelFn.mock.calls.length).toEqual(1); // unchanged

    // A new drill must have been generated
    expect(mockDrillFn.mock.calls.length).toEqual(3);
    drill = mockDrillFn.mock.calls[2][0];
    expect(drill).not.toBeNull();

    // Pass the drill with too many errors
    completeDrillWithNErrors(container, drill, 5);

    // Level DOWN
    expect(mockLevelFn.mock.calls.length).toEqual(2);
    expect(mockLevelFn.mock.calls[1][0]).toMatchObject({
        span: "0.5in",
    });
});

// Test Helpers

function completeDrillWithoutError(container, drill) {
    completeDrillWithNErrors(container, drill, 0);
}

function completeDrillWithNErrors(container, drill, n) {
    const labels = [
        drill.center.label,
        drill.top.label,
        drill.topRight.label,
        drill.right.label,
        drill.bottomRight.label,
        drill.bottom.label,
        drill.bottomLeft.label,
        drill.left.label,
        drill.topLeft.label,
    ];

    // Generate the errors first
    for (let i = 0; i < n; i++) {
        press(container, engine.differentLetter(...labels));
    }

    // Validate the drill
    press(container, drill.center.label);
    press(container, drill.top.label);
    press(container, drill.topRight.label);
    press(container, drill.right.label);
    press(container, drill.bottomRight.label);
    press(container, drill.bottom.label);
    press(container, drill.bottomLeft.label);
    press(container, drill.left.label);
    press(container, drill.topLeft.label);
}

function press(domNode, character) {
    const code = character.charCodeAt(0);
    fireEvent.keyUp(domNode, { key: character, code: code, keyCode: code, charCode: code });
}
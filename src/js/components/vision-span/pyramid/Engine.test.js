import Engine from './Engine';

it('notifies when the drill is finished', () => {
    const handleFinish = jest.fn();
    const lines = 3;
    const engine = new Engine(lines, handleFinish);

    const drill = engine.getDrill();
    expect(drill.lines).toHaveLength(lines);
    expect(drill.lines[0].columns).toHaveLength(3);

    for (let l = 0; l < drill.lines.length; l++) {
        engine.registerInput(drill.lines[l].columns[0].label);
        engine.registerInput(drill.lines[l].columns[1].label);
        engine.registerInput(drill.lines[l].columns[2].label);
    }

    expect(handleFinish).toHaveBeenCalledTimes(1);
});

it('supports new drill', () => {
    const engine = new Engine(1);
    const initialDrill = engine.getDrill();
    const newDrill = engine.newDrill();
    expect(newDrill).not.toEqual(initialDrill);
});
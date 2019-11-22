import Engine from './Engine';

it('notifies when the drill is finished', () => {
    const handleFinish = jest.fn()
    const size = 3
    const engine = new Engine(size, handleFinish)

    const drill = engine.getDrill()
    expect(drill.lines).toHaveLength(size)
    expect(drill.lines[0].columns).toHaveLength(size)

    // Center
    engine.registerInput(drill.lines[1].columns[1].label)
    // Outer circle
    engine.registerInput(drill.lines[0].columns[0].label)
    engine.registerInput(drill.lines[0].columns[1].label)
    engine.registerInput(drill.lines[0].columns[2].label)
    engine.registerInput(drill.lines[1].columns[2].label)
    engine.registerInput(drill.lines[2].columns[2].label)
    engine.registerInput(drill.lines[2].columns[1].label)
    engine.registerInput(drill.lines[2].columns[0].label)
    engine.registerInput(drill.lines[1].columns[0].label)

    expect(handleFinish).toHaveBeenCalledTimes(1)
})

it('supports new drill', () => {
    const engine = new Engine(3);
    const initialDrill = engine.getDrill();
    const newDrill = engine.newDrill();
    expect(newDrill).not.toEqual(initialDrill);
});

it('supports various table sizes', () => {
    expect(new Engine(3).getDrill()).not.toBeNull()
    expect(new Engine(5).getDrill()).not.toBeNull()
    expect(new Engine(7).getDrill()).not.toBeNull()
    expect(new Engine(9).getDrill()).not.toBeNull()

    // But
    expect(() => new Engine(1).getDrill()).toThrow()
    expect(() => new Engine(2).getDrill()).toThrow()
    expect(() => new Engine(4).getDrill()).toThrow()
})
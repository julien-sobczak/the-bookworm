import Engine from './Engine';

it('notifies when the drill is finished', () => {
    const handleFinish = jest.fn()
    const lines = 1
    const columns = 3
    const series = 1
    const engine = new Engine(lines, columns, series, handleFinish)

    const drill = engine.getDrill()
    expect(drill).toHaveLength(series)
    expect(drill[0].lines).toHaveLength(lines)
    expect(drill[0].lines[0].columns).toHaveLength(columns)

    engine.registerInput(drill[0].lines[0].columns[0].label)
    engine.registerInput(drill[0].lines[0].columns[1].label)
    engine.registerInput(drill[0].lines[0].columns[2].label)

    expect(handleFinish).toHaveBeenCalledTimes(1)

    const newDrill = engine.getDrill()
    expect(newDrill).not.toEqual(drill)
})

it('supports various sizes', () => {
    expect(new Engine(1, 3, 1).getDrill()).not.toBeNull()
    expect(new Engine(1, 5, 1).getDrill()).not.toBeNull()
    expect(new Engine(1, 7, 1).getDrill()).not.toBeNull()
    expect(new Engine(1, 9, 1).getDrill()).not.toBeNull()

    // But
    expect(() => new Engine(1, 1, 1).getDrill()).toThrow()
    expect(() => new Engine(1, 2, 1).getDrill()).toThrow()
    expect(() => new Engine(1, 4, 1).getDrill()).toThrow()
})

it('supports multiple series', () => {
    const handleFinish = jest.fn()
    const lines = 2
    const columns = 5
    const series = 2
    const engine = new Engine(lines, columns, series, handleFinish)

    const drill = engine.getDrill()
    expect(drill).toHaveLength(series)
    expect(drill[0].lines).toHaveLength(lines)
    expect(drill[0].lines[0].columns).toHaveLength(columns)
})
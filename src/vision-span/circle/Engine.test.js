import Engine from './Engine';

it('notifies when the drill is finished', () => {
    const handleFinish = jest.fn()
    const letter = /[A-Z]/
    const engine = new Engine(handleFinish)

    const drill = engine.getDrill()
    expect(drill.center.label).toMatch(letter)
    expect(drill.top.label).toMatch(letter)
    expect(drill.topRight.label).toMatch(letter)
    expect(drill.right.label).toMatch(letter)
    expect(drill.bottomRight.label).toMatch(letter)
    expect(drill.bottom.label).toMatch(letter)
    expect(drill.bottomLeft.label).toMatch(letter)
    expect(drill.left.label).toMatch(letter)
    expect(drill.topLeft.label).toMatch(letter)

    // Center
    engine.registerInput(drill.center.label)
    // Circle
    engine.registerInput(drill.top.label)
    engine.registerInput(drill.topRight.label)
    engine.registerInput(drill.right.label)
    engine.registerInput(drill.bottomRight.label)
    engine.registerInput(drill.bottom.label)
    engine.registerInput(drill.bottomLeft.label)
    engine.registerInput(drill.left.label)
    engine.registerInput(drill.topLeft.label)

    expect(handleFinish).toHaveBeenCalledTimes(1)

    const newDrill = engine.getDrill()
    expect(newDrill).not.toEqual(drill)
})

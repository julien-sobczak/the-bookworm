import DrillPage from './DrillPage';

it('should calculate the chunk reading time', () => {
    const textContaining500Characters = "This is a long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long text."
    expect(DrillPage.chunkDuration(textContaining500Characters, 100)).toBe(1 * 60 * 1000); // 100 WPM = 500 characters in one minnute
});

it('should take into account the physical eye limitations', () => {
    const veryShortChunk = "is"
    expect(DrillPage.chunkDuration(veryShortChunk, 500)).toBe(275); // See implementation
});
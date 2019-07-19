import DrillPage from './DrillPage';

it('calculate chunk duration', () => {
    const textContaining500Characters = "This is a long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long text."
    expect(DrillPage.chunkDuration(textContaining500Characters, 100)).toBe(1 * 60 * 1000); // 100 WPM = 500 characters in one minnute
});

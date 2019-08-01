import DrillChunkReader from './DrillChunkReader';

it('group all chunks from the same block', () => {
    const chunks = [
        {
            text: "Ceci",
            tag: "p",
            startingChunk: true,
        },
        {
            text: "est",
            tag: "p",
        },
        {
            text: "un",
            tag: "p",
        },
        {
            text: "test",
            tag: "p",
            endingChunk: true,
        },
    ];
    const linesPerChunk = 2;
    const groupedChunks = DrillChunkReader.groupChunks(chunks, linesPerChunk);
    expect(groupedChunks.length).toBe(2);
    expect(groupedChunks).toEqual([
        {
            text: "Ceci<br/>est",
            tag: "p",
            startingChunk: true,
        },
        {
            text: "un<br/>test",
            tag: "p",
            endingChunk: true,
        },
    ])
});


it('do not group chunks from different blocks', () => {
    const chunks = [
        {
            text: "I",
            tag: "p",
            startingChunk: true,
        },
        {
            text: "am",
            tag: "p",
        },
        {
            text: "Julien",
            tag: "p",
            endingChunk: true,
        },
        {
            text: "I",
            tag: "p",
            startingChunk: true,
        },
        {
            text: "am",
            tag: "p",
        },
        {
            text: "33",
            tag: "p",
            endingChunk: true,
        },
    ];
    const linesPerChunk = 2;
    const groupedChunks = DrillChunkReader.groupChunks(chunks, linesPerChunk);
    expect(groupedChunks.length).toBe(4);
    expect(groupedChunks).toEqual([
        {
            text: "I<br/>am",
            tag: "p",
            startingChunk: true,
        },
        {
            text: "Julien",
            tag: "p",
            endingChunk: true,
        },
        {
            text: "I<br/>am",
            tag: "p",
            startingChunk: true,
        },
        {
            text: "33",
            tag: "p",
            endingChunk: true,
        },
    ])
});


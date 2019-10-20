import { statsContent, statsPages, statsChunks, countWords, countLetters } from './library';

describe('countWords', () => {

    it('calculates the number of words', () => {
        const text = "A very, simple, but useful example!";
        expect(countWords(text)).toBe(6);
    });

});

describe('countLetters', () => {

    it('calculates the number of letters', () => {
        const textWithoutHTML = "A simple text";
        const textWithHTML = "“I ain't, aunt; it <i>is</i> all done.”";
        expect(countLetters(textWithoutHTML)).toBe(13);
        expect(countLetters(textWithHTML)).toBe(32);
    });
});

describe('statsContent', () => {

    it('calculates various statistics about the content', () => {
        const content = {
            title: "The Adventures of Tom Sawyer",
            author: "Mark Twain",
            subtitle: "Chapter 3",
            blocks: [
                { tag: "h2", content: "Chapter 3" },
                { tag: "p", content: "TOM presented himself before Aunt Polly, ..." },
                { tag: "p", content: "“What, a'ready? How much have you done?”" },
                { tag: "p", content: "“It's all done, aunt.”" },
                { tag: "p", content: "“Tom, don't lie to me--I can't bear it.”" },
                { tag: "p", content: "“I ain't, aunt; it <i>is</i> all done.”" },
                { tag: "p", content: "Aunt Polly placed small trust in such evidence..." },
            ]
        };
        const stats = statsContent(content, 100);
        expect(stats.paragraphs).toBe(7);
        expect(stats.words).toBe(43);
        expect(stats.letters).toBe(243);
        expect(stats.durationInSeconds).toBe(100);
        expect(stats.wpm).toBe(29);
    });

});

describe('statsPages', () => {

    it('calculates various statistics about the pages', () => {
        const pages = [
            {
                "number": 1,
                "blocks": [
                    {
                        tag: "h2", content: "Chapter 3",
                        chunks: ["Chapter 3"],
                    },
                    {
                        tag: "p", content: "TOM presented himself before Aunt Polly",
                        chunks: ["TOM presented", " ", "himself before", " ", "Aunt Polly,"],
                    },
                    {
                        tag: "p", content: "“What, a'ready? How much have you done?”",
                        chunks: ["“What, a'ready?", " ", "How much have you done?”"],
                    },
                ]
            },
        ];
        const stats = statsPages(pages);
        expect(stats.pages).toBe(1);
        expect(stats.chunks).toBe(6);
    });

});

describe('statsChunks', () => {

    it('calculates various statistics about chnuks', () => {
        const chunks = [
            { tag: "h2", text: "Chapter 3" },
            { tag: "p", text: "TOM presented" },
            { tag: "p", text: "himself before" },
            { tag: "p", text: "Aunt Polly," },
        ];
        const stats = statsChunks(chunks);
        expect(stats.chunks).toBe(4);
    })
});

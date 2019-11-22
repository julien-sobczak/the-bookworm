import * as library from './library';

describe('countWords', () => {

    it('calculates the number of words', () => {
        const text = "A very, simple, but useful example!";
        expect(library.countWords(text)).toBe(6);
    });

});

describe('countLetters', () => {

    it('calculates the number of letters', () => {
        const textWithoutHTML = "A simple text";
        const textWithHTML = "“I ain't, aunt; it <i>is</i> all done.”";
        expect(library.countLetters(textWithoutHTML)).toBe(13);
        expect(library.countLetters(textWithHTML)).toBe(32);
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
        const stats = library.statsContent(content, 100);
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
        const stats = library.statsPages(pages);
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
        const stats = library.statsChunks(chunks);
        expect(stats.chunks).toBe(4);
    });
});

describe('nextPosition', () => {

    const content = {
        sections: [
            {
                title: "Section 1",
                blocks: [
                    { tag: "h2", content: "Section 1"},
                    { tag: "p", content: "Text 1"},
                ],
            },
            {
                title: "Section 2",
                blocks: [
                    { tag: "h2", content: "Section 2"},
                    { tag: "p", content: "Text 2"},
                ],
            },
        ]
    };

    it('moves to the next section when the section is finished', () => {
        const lastPosition = {
            section: 0,
            block: 1,
        };
        expect(library.nextPosition(lastPosition, content)).toMatchObject({
            section: 1,
            block: 0,
        });
    });

    it('moves to the next block when the section is unfinished', () => {
        const lastPosition = {
            section: 0,
            block: 0,
        };
        expect(library.nextPosition(lastPosition, content)).toMatchObject({
            section: 0,
            block: 1,
        });
    });

    it('moves to the start when the last section is finished', () => {
        const lastPosition = {
            section: 1,
            block: 1,
        };
        expect(library.nextPosition(lastPosition, content)).toMatchObject({
            section: 0,
            block: 0,
            progress: 100,
        });
    });

});

describe('extractContent', () => {

    it('calculates various statistics about chnuks', () => {
        const drillContent = {
            title: "Section 1",
            blocks: [
                { tag: "h2", content: "Section 1"},
                { tag: "p", content: "Text 1"},
                { tag: "p", content: "Text 2"},
            ],
        };
        const subContent = library.extractContent(drillContent, 1, 2);
        expect(subContent).toMatchObject({
            title: "Section 1",
            blocks: [
                { tag: "p", content: "Text 1"},
            ],
        });
    });
});

describe('isoLanguage', () => {

    it('returns the ISO code from the ISO language name', () => {
        expect(library.isoLanguage("French")).toBe('fr');
        expect(library.isoLanguage("English")).toBe('en');
    });
});
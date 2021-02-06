import * as library from './library';

describe('isoLanguage', () => {

    it('returns the ISO code from the ISO language name', () => {
        expect(library.isoLanguage("French")).toBe('fr');
        expect(library.isoLanguage("English")).toBe('en');
    });
});

describe('GutenbergParser', () => {

    it('applies post-processing rules', () => {
        const postProcessBlock = library.GutenbergParser.postProcessBlock;

        // Example 1: with two successive spaces
        const content1 = `YOU don't know about me without you have read a book by the name of The
Adventures of Tom Sawyer; but that ain't no matter.  That book was made
by Mr. Mark Twain, and he told the truth, mainly.  There was things
which he stretched, but mainly he told the truth.`;
        expect(postProcessBlock(content1)).toBe(`YOU don't know about me without you have read a book by the name of The
Adventures of Tom Sawyer; but that ain't no matter. That book was made
by Mr. Mark Twain, and he told the truth, mainly. There was things
which he stretched, but mainly he told the truth.`);

        // Example 2: with em dash
        const content2 = `Aunt Polly--Tom's Aunt Polly, she
is--and Mary, and the Widow Douglas is all told about in that book, which
is mostly a true book, with some stretchers, as I said before.`;
        expect(postProcessBlock(content2)).toBe(`Aunt Polly—Tom's Aunt Polly, she
is—and Mary, and the Widow Douglas is all told about in that book, which
is mostly a true book, with some stretchers, as I said before.`);

        // Example 3: italized text
        const content3 = `Some thought it would be good to kill the _families_ of boys that told the secrets.`;
        expect(postProcessBlock(content3)).toBe(`Some thought it would be good to kill the <i>families</i> of boys that told the secrets.`);

        // Example 4: mixed
        const content4 = `_Them_ letters.  I be bound, if I have to take a-holt of you I'll--`;
        expect(postProcessBlock(content4)).toBe(`<i>Them</i> letters. I be bound, if I have to take a-holt of you I'll—`);

        // Example 5: more complicated italized text
        const content5 = `Presently she began again. “I wonder if I shall fall right _through_
the earth! How funny it’ll seem to come out among the people that walk
with their heads downward! The Antipathies, I think—” (she was rather
glad there _was_ no one listening, this time, as it didn’t sound at all
the right word) “—but I shall have to ask them what the name of the
country is, you know. Please, Ma’am, is this New Zealand or Australia?”
(and she tried to curtsey as she spoke—fancy _curtseying_ as you’re
falling through the air! Do you think you could manage it?) “And what
an ignorant little girl she’ll think me for asking! No, it’ll never do
to ask: perhaps I shall see it written up somewhere.”`;
        expect(postProcessBlock(content5)).toBe(`Presently she began again. “I wonder if I shall fall right <i>through</i>
the earth! How funny it’ll seem to come out among the people that walk
with their heads downward! The Antipathies, I think—” (she was rather
glad there <i>was</i> no one listening, this time, as it didn’t sound at all
the right word) “—but I shall have to ask them what the name of the
country is, you know. Please, Ma’am, is this New Zealand or Australia?”
(and she tried to curtsey as she spoke—fancy <i>curtseying</i> as you’re
falling through the air! Do you think you could manage it?) “And what
an ignorant little girl she’ll think me for asking! No, it’ll never do
to ask: perhaps I shall see it written up somewhere.”`);
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

    const raw = {
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
        const text = new library.Text(raw);
        text.seekPosition({
            section: 0,
            block: 1,
        });
        expect(text.nextPosition()).toMatchObject({
            section: 1,
            block: 0,
        });
        expect(text.progress()).toBe(50);
    });

    it('moves to the next block when the section is unfinished', () => {
        const text = new library.Text(raw);
        text.seekPosition({
            section: 0,
            block: 0,
        });
        expect(text.nextPosition()).toMatchObject({
            section: 0,
            block: 1,
        });
        expect(text.progress()).toBe(0);
    });

    it('moves to the last block when the end is reached', () => {
        const text = new library.Text(raw);
        text.seekPosition({ // Last block
            section: 1,
            block: 1,
        });;
        expect(text.nextPosition()).toMatchObject({
            section: 1,
            block: 1,
        });
        expect(text.progress()).toBe(100);
    });

});

describe('extractContent', () => {

    it('calculates various statistics about chunks', () => {
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

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { LineWidthChunker, LineWordsChunker, LineStopsChunker, PagerTest, partition, trimChunks } from './Pager';

afterEach(cleanup);

describe('partition', () => {

    it('test', () => {
        const a = [114, 8, 18];
        expect(partition(a, 1)).toEqual([a]);

        const b = [150, 32, 118, 33, 36, 33, 61, 0];
        expect(partition(b, 3)).toEqual([[150], [32, 118], [33, 36, 33, 61, 0]]);
    });

});


const characterWidth = 1; // We simulate a fixed-width font by considering each character to measure the same length.

function makeTokens(texts) {
    const result = [];
    let offsetLeft = 0;
    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const width = text.length * characterWidth;
        result.push({
            // Mock the properties of HTMLElement used in the code
            innerText: text,
            innerHTML: text,
            offsetLeft: offsetLeft,
            offsetWidth: width,
        });
        offsetLeft += width;
    }
    return result;
}

describe('LineWidthChunker', () => {

    it('enforces the maximum chunk width', () => {
        const c = new LineWidthChunker(10, 11);
        const l = makeTokens(
            ["This", " ", "is", " ", "a", " ", "first", " ", "test"]);
        expect(c.chunkize(l)).toEqual([
            "This is a", " ", "first test",
        ]);
    });

    it('tolerate words than cannot really fit in one chunk', () => {
        const c = new LineWidthChunker(10, 11);
        const l = makeTokens(
            ["This", " ", "word", " ", "iiiiiiiiissssssssssssss", " ", "too", " ", "long"]);
        expect(c.chunkize(l)).toEqual([
            "This word", " ", "iiiiiiiiissssssssssssss", " ", "too long"
        ]);
    });

});

describe('LineWordsChunker', () => {

    it('enforces the maximum number of words per chunk', () => {
        const c = new LineWordsChunker(2);
        const l = makeTokens(
            ["This", " ", "is", " ", "a", " ", "first", " ", "test"]);
        expect(c.chunkize(l)).toEqual([
            "This is", " ", "a first", " ", "test",
        ]);
    });

});

describe('LineStopsChunker', () => {

    it('splits a line into the specific number of chunks', () => {
        const tokens = ["This", " ", "is", " ", "a", " ", "first", " ", "test"];
        const c = new LineStopsChunker(2, tokens.join("").length);
        const l = makeTokens(tokens);
        expect(c.chunkize(l)).toEqual([
            "This is a", " ", "first test",
        ]);
    });

    it('always split based on the largest line length', () => {
        const tokens = ["the", " ", "end."];
        const c = new LineStopsChunker(2, 30); // The largest line contains 30 characters
        const l = makeTokens(tokens);
        expect(c.chunkize(l)).toEqual([
            "the end.", // Do not split!
        ]);
    });

});

describe('trimChunks', () => {

    it('extracts separators from real chunks', () => {

        // Only spaces
        expect(trimChunks(["TOM presented ", "himself before ", "Aunt Polly", " who was sitting by"])).
            toEqual(["TOM presented", " ", "himself before", " ", "Aunt Polly", " ", "who was sitting by"]);

        // With special separators
        expect(trimChunks(["“Tom, don't", " lie to me--", "I can't bear it.”"])).
            toEqual(["“Tom, don't", " ", "lie to me", "--", "I can't bear it.”"]);

    });

});

describe('PagerTest', () => {

    const content = {
        title: "The Adventures of Tom Sawyer",
        author: "Mark Twain",
        subtitle: "Chapter 3",
        blocks: [
            { tag: "h2", content: "Chapter 3" },
            { tag: "p", content: "TOM presented himself before Aunt Polly, who was sitting by an open window in a pleasant rearward apartment, which was bedroom, breakfast-room, dining-room, and library, combined. The balmy summer air, the restful quiet, the odor of the flowers, and the drowsing murmur of the bees had had their effect, and she was nodding over her knitting--for she had no company but the cat, and it was asleep in her lap. Her spectacles were propped up on her gray head for safety. She had thought that of course Tom had deserted long ago, and she wondered at seeing him place himself in her power again in this intrepid way. He said: “Mayn't I go and play now, aunt?”" },
            { tag: "p", content: "“What, a'ready? How much have you done?” “It's all done, aunt.”" },
            { tag: "p", content: "“Tom, don't lie to me--I can't bear it.”" },
            { tag: "p", content: "“I ain't, aunt; it <i>is</i> all done.”" },
            { tag: "p", content: "Aunt Polly placed small trust in such evidence. She went out to see for herself; and she would have been content to find twenty per cent. of Tom's statement true." },
        ]
    };

    it('simulates a fixed-font to paginate without using the DOM API', () => {
        const mockFn = jest.fn();
        render(
            <PagerTest
                content={content}
                charactersPerLine={60}
                linesPerPage={5}
                chunkMode="none"
                onDone={mockFn} />
        );
        expect(mockFn.mock.calls.length).toEqual(1);
        expect(mockFn.mock.calls[0][0]).toMatchObject([
            {
                "number": 1,
                "blocks": [
                    {
                        "block": 0,
                        "tag": "h2",
                        "content": "Chapter 3",
                        "lines": [
                            "Chapter 3",
                        ],
                    },
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "TOM presented himself before Aunt Polly, who was sitting by an open window in a pleasant rearward apartment, which was bedroom, breakfast-room, dining-room, and library, combined. The balmy summer air, the restful quiet, the",
                        "lines": [
                            "TOM presented himself before Aunt Polly, who was sitting by",
                            "an open window in a pleasant rearward apartment, which was",
                            "bedroom, breakfast-room, dining-room, and library,",
                            "combined. The balmy summer air, the restful quiet, the",
                        ],
                    },
                ],
            },
            {
                "number": 2,
                "blocks": [
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "odor of the flowers, and the drowsing murmur of the bees had had their effect, and she was nodding over her knitting--for she had no company but the cat, and it was asleep in her lap. Her spectacles were propped up on her gray head for safety. She had thought that of course Tom",
                        "lines": [
                            "odor of the flowers, and the drowsing murmur of the bees",
                            "had had their effect, and she was nodding over her",
                            "knitting--for she had no company but the cat, and it was",
                            "asleep in her lap. Her spectacles were propped up on her",
                            "gray head for safety. She had thought that of course Tom",
                        ],
                    },
                ],
            },
            {
                "number": 3,
                "blocks": [
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "had deserted long ago, and she wondered at seeing him place himself in her power again in this intrepid way. He said: “Mayn't I go and play now, aunt?”",
                        "lines": [
                            "had deserted long ago, and she wondered at seeing him",
                            "place himself in her power again in this intrepid way. He",
                            "said: “Mayn't I go and play now, aunt?”",
                        ],
                    },
                    {
                        "block": 2,
                        "tag": "p",
                        "content": "“What, a'ready? How much have you done?” “It's all done, aunt.”",
                        "lines": [
                            "“What, a'ready? How much have you done?” “It's all done,",
                            "aunt.”",
                        ],
                    },
                ],
            },
            {
                "number": 4,
                "blocks": [
                    {
                        "block": 3,
                        "tag": "p",
                        "content": "“Tom, don't lie to me--I can't bear it.”",
                        "lines": [
                            "“Tom, don't lie to me--I can't bear it.”",
                        ],
                    },
                    {
                        "block": 4,
                        "tag": "p",
                        "content": "“I ain't, aunt; it is all done.”",
                        "lines": [
                            "“I ain't, aunt; it is all done.”",
                        ],
                    },
                    {
                        "block": 5,
                        "tag": "p",
                        "content": "Aunt Polly placed small trust in such evidence. She went out to see for herself; and she would have been content to find twenty per cent. of Tom's statement true.",
                        "lines": [
                            "Aunt Polly placed small trust in such evidence. She went",
                            "out to see for herself; and she would have been content to",
                            "find twenty per cent. of Tom's statement true.",
                        ],
                    },
                ],
            },
        ]);
    });

    it('supports the width chunk mode', () => {
        const mockFn = jest.fn();
        render(
            <PagerTest
                content={content}
                charactersPerLine={60}
                linesPerPage={5}
                chunkMode="width"
                chunkWidth="1.5in"
                onDone={mockFn} />
        );
        expect(mockFn.mock.calls.length).toEqual(1);
        expect(mockFn.mock.calls[0][0]).toMatchObject([
            {
                "number": 1,
                "blocks": [
                    {
                        "block": 0,
                        "tag": "h2",
                        "content": "Chapter 3",
                        "lines": [
                            "Chapter 3",
                        ],
                        "chunks": ["Chapter 3"],
                    },
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "TOM presented himself before Aunt Polly, who was sitting by an open window in a pleasant rearward apartment, which was bedroom, breakfast-room, dining-room, and library, combined. The balmy summer air, the restful quiet, the",
                        "lines": [
                            "TOM presented himself before Aunt Polly, who was sitting by",
                            "an open window in a pleasant rearward apartment, which was",
                            "bedroom, breakfast-room, dining-room, and library,",
                            "combined. The balmy summer air, the restful quiet, the",
                        ],
                        "chunks": ["TOM presented", " ", "himself before", " ", "Aunt Polly,", " ", "who was", " ", "sitting by", "an open window", " ", "in a pleasant", " ", "rearward", " ", "apartment,", " ", "which was", "bedroom,", " ", "breakfast-room,", " ", "dining-room,", " ", "and library,", "combined. The", " ", "balmy summer", " ", "air, the", " ", "restful quiet,", " ", "the"],
                    },
                ],
            },
            {
                "number": 2,
                "blocks": [
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "odor of the flowers, and the drowsing murmur of the bees had had their effect, and she was nodding over her knitting--for she had no company but the cat, and it was asleep in her lap. Her spectacles were propped up on her gray head for safety. She had thought that of course Tom",
                        "lines": [
                            "odor of the flowers, and the drowsing murmur of the bees",
                            "had had their effect, and she was nodding over her",
                            "knitting--for she had no company but the cat, and it was",
                            "asleep in her lap. Her spectacles were propped up on her",
                            "gray head for safety. She had thought that of course Tom",
                        ],
                        "chunks": ["odor of the", " ", "flowers, and", " ", "the drowsing", " ", "murmur of the", " ", "bees", "had had their", " ", "effect, and", " ", "she was", " ", "nodding over", " ", "her", "knitting--for", " ", "she had no", " ", "company but", " ", "the cat, and", " ", "it was", "asleep in her", " ", "lap. Her", " ", "spectacles", " ", "were propped", " ", "up on her", "gray head for", " ", "safety. She", " ", "had thought", " ", "that of course", " ", "Tom"],
                    },
                ],
            },
            {
                "number": 3,
                "blocks": [
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "had deserted long ago, and she wondered at seeing him place himself in her power again in this intrepid way. He said: “Mayn't I go and play now, aunt?”",
                        "lines": [
                            "had deserted long ago, and she wondered at seeing him",
                            "place himself in her power again in this intrepid way. He",
                            "said: “Mayn't I go and play now, aunt?”",
                        ],
                        "chunks": ["had deserted", " ", "long ago, and", " ", "she wondered", " ", "at seeing him", "place himself", " ", "in her power", " ", "again in this", " ", "intrepid way.", " ", "He", "said: “Mayn't", " ", "I go and play", " ", "now, aunt?”"],
                    },
                    {
                        "block": 2,
                        "tag": "p",
                        "content": "“What, a'ready? How much have you done?” “It's all done, aunt.”",
                        "lines": [
                            "“What, a'ready? How much have you done?” “It's all done,",
                            "aunt.”",
                        ],
                        "chunks": ["“What,", " ", "a'ready? How", " ", "much have you", " ", "done?” “It's", " ", "all done,", "aunt.”"],
                    },
                ],
            },
            {
                "number": 4,
                "blocks": [
                    {
                        "block": 3,
                        "tag": "p",
                        "content": "“Tom, don't lie to me--I can't bear it.”",
                        "lines": [
                            "“Tom, don't lie to me--I can't bear it.”",
                        ],
                        "chunks": ["“Tom, don't", " ", "lie to me--I", " ", "can't bear", " ", "it.”"],
                    },
                    {
                        "block": 4,
                        "tag": "p",
                        "content": "“I ain't, aunt; it is all done.”",
                        "lines": [
                            "“I ain't, aunt; it is all done.”",
                        ],
                        "chunks": ["“I ain't,", " ", "aunt; it is", " ", "all done.”"],
                    },
                    {
                        "block": 5,
                        "tag": "p",
                        "content": "Aunt Polly placed small trust in such evidence. She went out to see for herself; and she would have been content to find twenty per cent. of Tom's statement true.",
                        "lines": [
                            "Aunt Polly placed small trust in such evidence. She went",
                            "out to see for herself; and she would have been content to",
                            "find twenty per cent. of Tom's statement true.",
                        ],
                        "chunks": ["Aunt Polly", " ", "placed small", " ", "trust in such", " ", "evidence. She", " ", "went", "out to see for", " ", "herself; and", " ", "she would have", " ", "been content", " ", "to", "find twenty", " ", "per cent. of", " ", "Tom's", " ", "statement", " ", "true."],
                    },
                ],
            },
        ]);
    });

    it('supports the words chunk mode', () => {
        const mockFn = jest.fn();
        render(
            <PagerTest
                content={content}
                charactersPerLine={60}
                linesPerPage={5}
                chunkMode="words"
                chunkWords={2}
                onDone={mockFn} />
        );
        expect(mockFn.mock.calls.length).toEqual(1);
        expect(mockFn.mock.calls[0][0]).toMatchObject([
            {
                "number": 1,
                "blocks": [
                    {
                        "block": 0,
                        "tag": "h2",
                        "content": "Chapter 3",
                        "lines": [
                            "Chapter 3",
                        ],
                        "chunks": ["Chapter 3"],
                    },
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "TOM presented himself before Aunt Polly, who was sitting by an open window in a pleasant rearward apartment, which was bedroom, breakfast-room, dining-room, and library, combined. The balmy summer air, the restful quiet, the",
                        "lines": [
                            "TOM presented himself before Aunt Polly, who was sitting by",
                            "an open window in a pleasant rearward apartment, which was",
                            "bedroom, breakfast-room, dining-room, and library,",
                            "combined. The balmy summer air, the restful quiet, the",
                        ],
                        "chunks": ["TOM presented", " ", "himself before", " ", "Aunt Polly,", " ", "who was", " ", "sitting by", "an open", " ", "window in", " ", "a pleasant", " ", "rearward apartment,", " ", "which was", "bedroom, breakfast-room,", " ", "dining-room, and", " ", "library,", "combined. The", " ", "balmy summer", " ", "air, the", " ", "restful quiet,", " ", "the"],
                    },
                ],
            },
            {
                "number": 2,
                "blocks": [
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "odor of the flowers, and the drowsing murmur of the bees had had their effect, and she was nodding over her knitting--for she had no company but the cat, and it was asleep in her lap. Her spectacles were propped up on her gray head for safety. She had thought that of course Tom",
                        "lines": [
                            "odor of the flowers, and the drowsing murmur of the bees",
                            "had had their effect, and she was nodding over her",
                            "knitting--for she had no company but the cat, and it was",
                            "asleep in her lap. Her spectacles were propped up on her",
                            "gray head for safety. She had thought that of course Tom",
                        ],
                        "chunks": ["odor of", " ", "the flowers,", " ", "and the", " ", "drowsing murmur", " ", "of the", " ", "bees", "had had", " ", "their effect,", " ", "and she", " ", "was nodding", " ", "over her", "knitting--for", " ", "she had", " ", "no company", " ", "but the", " ", "cat, and", " ", "it was", "asleep in", " ", "her lap.", " ", "Her spectacles", " ", "were propped", " ", "up on", " ", "her", "gray head", " ", "for safety.", " ", "She had", " ", "thought that", " ", "of course", " ", "Tom"],
                    },
                ],
            },
            {
                "number": 3,
                "blocks": [
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "had deserted long ago, and she wondered at seeing him place himself in her power again in this intrepid way. He said: “Mayn't I go and play now, aunt?”",
                        "lines": [
                            "had deserted long ago, and she wondered at seeing him",
                            "place himself in her power again in this intrepid way. He",
                            "said: “Mayn't I go and play now, aunt?”",
                        ],
                        "chunks": ["had deserted", " ", "long ago,", " ", "and she", " ", "wondered at", " ", "seeing him", "place himself", " ", "in her", " ", "power again", " ", "in this", " ", "intrepid way.", " ", "He", "said: “Mayn't", " ", "I go", " ", "and play", " ", "now, aunt?”"],
                    },
                    {
                        "block": 2,
                        "tag": "p",
                        "content": "“What, a'ready? How much have you done?” “It's all done, aunt.”",
                        "lines": [
                            "“What, a'ready? How much have you done?” “It's all done,",
                            "aunt.”",
                        ],
                        "chunks": ["“What, a'ready?", " ", "How much", " ", "have you", " ", "done?” “It's", " ", "all done,", "aunt.”"],
                    },
                ],
            },
            {
                "number": 4,
                "blocks": [
                    {
                        "block": 3,
                        "tag": "p",
                        "content": "“Tom, don't lie to me--I can't bear it.”",
                        "lines": [
                            "“Tom, don't lie to me--I can't bear it.”",
                        ],
                        "chunks": ["“Tom, don't", " ", "lie to", " ", "me--I", " ", "can't bear", " ", "it.”"],
                    },
                    {
                        "block": 4,
                        "tag": "p",
                        "content": "“I ain't, aunt; it is all done.”",
                        "lines": [
                            "“I ain't, aunt; it is all done.”",
                        ],
                        "chunks": ["“I ain't,", " ", "aunt; it", " ", "is all", " ", "done.”"],
                    },
                    {
                        "block": 5,
                        "tag": "p",
                        "content": "Aunt Polly placed small trust in such evidence. She went out to see for herself; and she would have been content to find twenty per cent. of Tom's statement true.",
                        "lines": [
                            "Aunt Polly placed small trust in such evidence. She went",
                            "out to see for herself; and she would have been content to",
                            "find twenty per cent. of Tom's statement true.",
                        ],
                        "chunks": ["Aunt Polly", " ", "placed small", " ", "trust in", " ", "such evidence.", " ", "She went", "out to", " ", "see for", " ", "herself; and", " ", "she would", " ", "have been", " ", "content to", "find twenty", " ", "per cent.", " ", "of Tom's", " ", "statement true."],
                    },
                ],
            },
        ]);
    });

    it('supports the stops chunk mode', () => {
        const mockFn = jest.fn();
        render(
            <PagerTest
                content={content}
                charactersPerLine={60}
                linesPerPage={5}
                chunkMode="stops"
                chunkStops={2}
                onDone={mockFn} />
        );
        expect(mockFn.mock.calls.length).toEqual(1);
        expect(mockFn.mock.calls[0][0]).toMatchObject([
            {
                "number": 1,
                "blocks": [
                    {
                        "block": 0,
                        "tag": "h2",
                        "content": "Chapter 3",
                        "lines": [
                            "Chapter 3",
                        ],
                        "chunks": ["Chapter 3"],
                    },
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "TOM presented himself before Aunt Polly, who was sitting by an open window in a pleasant rearward apartment, which was bedroom, breakfast-room, dining-room, and library, combined. The balmy summer air, the restful quiet, the",
                        "lines": [
                            "TOM presented himself before Aunt Polly, who was sitting by",
                            "an open window in a pleasant rearward apartment, which was",
                            "bedroom, breakfast-room, dining-room, and library,",
                            "combined. The balmy summer air, the restful quiet, the",
                        ],
                        "chunks": ["TOM presented himself before Aunt", " ", "Polly, who was sitting by", "an open window in a pleasant rearward", " ", "apartment, which was", "bedroom, breakfast-room, dining-room,", " ", "and library,", "combined. The balmy summer air,", " ", "the restful quiet, the"],
                    },
                ],
            },
            {
                "number": 2,
                "blocks": [
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "odor of the flowers, and the drowsing murmur of the bees had had their effect, and she was nodding over her knitting--for she had no company but the cat, and it was asleep in her lap. Her spectacles were propped up on her gray head for safety. She had thought that of course Tom",
                        "lines": [
                            "odor of the flowers, and the drowsing murmur of the bees",
                            "had had their effect, and she was nodding over her",
                            "knitting--for she had no company but the cat, and it was",
                            "asleep in her lap. Her spectacles were propped up on her",
                            "gray head for safety. She had thought that of course Tom",
                        ],
                        "chunks": ["odor of the flowers, and the", " ", "drowsing murmur of the bees", "had had their effect, and she", " ", "was nodding over her", "knitting--for she had no company", " ", "but the cat, and it was", "asleep in her lap. Her spectacles", " ", "were propped up on her", "gray head for safety. She had", " ", "thought that of course Tom"],
                    },
                ],
            },
            {
                "number": 3,
                "blocks": [
                    {
                        "block": 1,
                        "tag": "p",
                        "content": "had deserted long ago, and she wondered at seeing him place himself in her power again in this intrepid way. He said: “Mayn't I go and play now, aunt?”",
                        "lines": [
                            "had deserted long ago, and she wondered at seeing him",
                            "place himself in her power again in this intrepid way. He",
                            "said: “Mayn't I go and play now, aunt?”",
                        ],
                        "chunks": ["had deserted long ago, and she", " ", "wondered at seeing him", "place himself in her power again", " ", "in this intrepid way. He", "said: “Mayn't I go and play now,", " ", "aunt?”"],
                    },
                    {
                        "block": 2,
                        "tag": "p",
                        "content": "“What, a'ready? How much have you done?” “It's all done, aunt.”",
                        "lines": [
                            "“What, a'ready? How much have you done?” “It's all done,",
                            "aunt.”",
                        ],
                        "chunks": ["“What, a'ready? How much have", " ", "you done?” “It's all done,", "aunt.”"],
                    },
                ],
            },
            {
                "number": 4,
                "blocks": [
                    {
                        "block": 3,
                        "tag": "p",
                        "content": "“Tom, don't lie to me--I can't bear it.”",
                        "lines": [
                            "“Tom, don't lie to me--I can't bear it.”",
                        ],
                        "chunks": ["“Tom, don't lie to me--I can't", " ", "bear it.”"],
                    },
                    {
                        "block": 4,
                        "tag": "p",
                        "content": "“I ain't, aunt; it is all done.”",
                        "lines": [
                            "“I ain't, aunt; it is all done.”",
                        ],
                        "chunks": ["“I ain't, aunt; it is all done.”"],
                    },
                    {
                        "block": 5,
                        "tag": "p",
                        "content": "Aunt Polly placed small trust in such evidence. She went out to see for herself; and she would have been content to find twenty per cent. of Tom's statement true.",
                        "lines": [
                            "Aunt Polly placed small trust in such evidence. She went",
                            "out to see for herself; and she would have been content to",
                            "find twenty per cent. of Tom's statement true.",
                        ],
                        "chunks": ["Aunt Polly placed small trust", " ", "in such evidence. She went", "out to see for herself; and she", " ", "would have been content to", "find twenty per cent. of Tom's", " ", "statement true."],
                    },
                ],
            },
        ]);
    });

});
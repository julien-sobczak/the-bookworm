import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import waitForExpect from 'wait-for-expect';

import Drill from './Drill';

afterEach(cleanup);

// Increate timeouts
const timeout = 20000;
jest.setTimeout(timeout);
waitForExpect.defaults.timeout = timeout;

describe('Drill', () => {

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
        ]
    };

    it('plays the content automatically', async () => {
        const mockChunkFn = jest.fn();
        const mockCompleteFn = jest.fn();

        render(
            <Drill
                pagerMode="fixed"
                content={content}
                charactersPerLine={60}
                linesPerPage={5}
                wpm={2000}
                onChunkChange={mockChunkFn}
                onComplete={mockCompleteFn} />
        );

        // Wait drill completion
        await waitForExpect(() => {
            expect(mockCompleteFn.mock.calls.length).toEqual(1);
        });

        const results = mockCompleteFn.mock.calls[0][0];
        expect(results.stats.chunks).toBeGreaterThan(1);
        expect(results.stats.durationInSeconds).toBeGreaterThan(1);
        expect(results.stats.letters).toBeGreaterThan(1);
        expect(results.stats.pages).toBeGreaterThan(1);
        expect(results.stats.paragraphs).toBeGreaterThan(1);
        expect(results.stats.words).toBeGreaterThan(1);
        expect(results.stats.wpm).toBeGreaterThan(1);
        expect(results.stats.wpm).toBeLessThanOrEqual(1500);

        // The position must have changed the number of chunks.
        expect(mockChunkFn.mock.calls.length).toBe(results.stats.chunks-1); // There N-1 changes to display N chunks
    });

});

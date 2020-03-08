import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import waitForExpect from 'wait-for-expect';

import Drill from './Drill';
import * as interaction from '../../functions/interaction';

afterEach(cleanup);

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
            { tag: "p", content: "Aunt Polly placed small trust in such evidence. She went out to see for herself; and she would have been content to find twenty per cent. of Tom's statement true." },
        ]
    };

    it('plays the content automatically', async () => {
        const mockStartFn = jest.fn();
        const mockCompleteFn = jest.fn();

        const { container } = render(
            <Drill
                pagerMode="fixed"
                content={content}
                charactersPerLine={60}
                linesPerPage={5}
                wpm={1500}
                onStart={mockStartFn}
                onComplete={mockCompleteFn} />
        );

        // Wait for drill to be ready
        await waitForExpect(() => {
            expect(mockStartFn.mock.calls.length).toEqual(1);
        });

        // Turn the pages
        for (let p = 0; p < mockStartFn.mock.calls[0][0].pages; p++) {
            await sleep(1000);
            fireEvent.keyUp(container, { keyCode: interaction.KEY_RIGHT });
        }

        // Wait drill completion
        expect(mockCompleteFn.mock.calls.length).toEqual(1);
        const results = mockCompleteFn.mock.calls[0][0];
        expect(results.stats.durationInSeconds).toBeGreaterThanOrEqual(0);
        expect(results.stats.letters).toBeGreaterThan(1);
        expect(results.stats.pages).toBeGreaterThanOrEqual(1);
        expect(results.stats.paragraphs).toBeGreaterThan(1);
        expect(results.stats.words).toBeGreaterThan(1);
        expect(results.stats.wpm).toBeGreaterThan(1);
    });

});

/* Test Helpers */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

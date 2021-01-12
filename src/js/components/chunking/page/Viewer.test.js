import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Viewer from './Viewer';

afterEach(cleanup);

describe('Viewer', () => {

    const page = {
        blocks: [
            {
                tag: "h2",
                content: "Chapter 3",
                chunks: ["Chapter 3"],
            },
            {
                tag: "p",
                content: "TOM presented himself before Aunt Polly,",
                chunks: ["TOM presented himself", " ", "before Aunt Polly,"],
                continued: true,
                continuation: false,
            },
            {
                tag: "p",
                content: "“What, a'ready? How much have you done?”",
                chunks: ["“What, a'ready?", " ", "How much have", " ", "you done?”"],
            },
        ],
    };

    it('highlights the current block', async () => {
        const { getByText } = render(
            <Viewer
                page={page}
                blockPosition={1}
                chunkPosition={2} />
        );

        // Check characters are well organized
        expect(getByText("before Aunt Polly,")).toHaveClass('Selected');
    });

    it('can hide previous and/or next blocks', async () => {
        const { container, getByText } = render(
            <Viewer
                page={page}
                blockPosition={2}
                chunkPosition={2}
                disableVisualRegression
                disableVisualProgression
                disableVisualProblemStyle="blur" />
        );

        // Chunks are marked as being before or after the current chunk
        expect(getByText("“What, a'ready?")).toHaveClass('Before');
        expect(getByText("you done?”")).toHaveClass('After');

        // Add style is marked as a CSS annotation
        expect(container.firstChild).toHaveClass('DisableVisualProblemStyleBlur');
    });

});

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PageContent from './PageContent';

it('sets CSS classes', () => {
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
        ],
    };

    const { container, getByText } = render(<PageContent page={page} blockPosition={1} chunkPosition={0} />);

    // class Selected
    expect(getByText('Chapter 3')).not.toHaveClass('Selected');
    expect(getByText('TOM presented himself')).toHaveClass('Selected');
    expect(getByText('before Aunt Polly,')).not.toHaveClass('Selected');

    // class Before/After
    expect(getByText('Chapter 3')).toHaveClass('Before');
    expect(getByText('before Aunt Polly,')).toHaveClass('After');

    // class Chunk/Space
    expect(getByText('Chapter 3')).toHaveClass('Chunk');
    expect(getByText('before Aunt Polly,').previousSibling).toHaveClass('Space');

    // class Continuation/Continued/Entire
    expect(container.querySelector('h2')).toHaveClass('Entire');
    expect(container.querySelector('p')).toHaveClass('Continued');
});

it('preserves HTML tags in content', () => {
    const page = {
        blocks: [
            {
                tag: "p",
                content: "TOM presented <i>himself</i> before Aunt Polly,",
                chunks: ["TOM presented <i>himself</i>", " ", "before Aunt Polly,"],
            },
        ],
    };

    const { getByText } = render(<PageContent page={page} />);

    expect(getByText('TOM presented himself')).toContainHTML(
        '<span class="Selected Chunk">TOM presented himself</span>');
});

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Viewer from './Viewer';

afterEach(cleanup);

describe('Viewer', () => {

    const chunks = {
        previousChunk: { text: "Chapter 3" },
        currentChunk:  { text: "TOM presented himself" },
        nextChunk:     { text: "before Aunt Polly," },
    };

    it('can print all chunks', async () => {
        const { getByText } = render(
            <Viewer
                {...chunks}
                showPreviousChunk
                showNextChunk />
        );

        // Check characters are well organized
        expect(getByText("Chapter 3")).toBeInTheDocument();
        expect(getByText("TOM presented himself")).toBeInTheDocument();
        expect(getByText("before Aunt Polly,")).toBeInTheDocument();
    });

    it('can print surrouding chunks vertically', async () => {
        const { container } = render(
            <Viewer
                {...chunks}
                showPreviousChunk
                showNextChunk
                neighborChunksPosition="vertical" />
        );

        // An annotation is added to the parent element
        expect(container.firstChild).toHaveClass('NeighborPositionVertical');
    });

    it('can print surrouding chunks horizontally', async () => {
        const { container } = render(
            <Viewer
                {...chunks}
                showPreviousChunk
                showNextChunk
                neighborChunksPosition="horizontal" />
        );

        // An annotation is added to the parent element
        expect(container.firstChild).toHaveClass('NeighborPositionHorizontal');
    });

});

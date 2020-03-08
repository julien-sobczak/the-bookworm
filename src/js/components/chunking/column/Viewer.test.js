import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Viewer from './Viewer';

afterEach(cleanup);

describe('Viewer', () => {

    const chunks = [
        { text: "Chapter 3" },
        { text: "TOM presented himself" },
        { text: "before Aunt Polly," },
        { text: "“What, a'ready?" },
        { text: "How much have" },
        { text: "you done?”" },
    ];

    it('highlights the current block', async () => {
        const { getByText } = render(
            <Viewer
                chunks={chunks}
                chunkPosition={2} />
        );

        // Check characters are well organized
        expect(getByText("before Aunt Polly,")).toHaveClass('Selected');
    });

});
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

    it('show all the blocks', async () => {
        const { getByText } = render(
            <Viewer page={page} />
        );

        expect(getByText("Chapter 3")).toBeInTheDocument();
        expect(getByText("TOM presented himself")).toBeInTheDocument();
        expect(getByText("before Aunt Polly,")).toBeInTheDocument();
        expect(getByText("“What, a'ready?")).toBeInTheDocument();
        expect(getByText("How much have")).toBeInTheDocument();
        expect(getByText("you done?”")).toBeInTheDocument();
    });

});
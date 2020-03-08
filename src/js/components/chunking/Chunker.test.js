import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Chunker from './Chunker';

afterEach(cleanup);

describe('Chunker', () => {

    const content = {
        title: "The Adventures of Tom Sawyer",
        author: "Mark Twain",
        subtitle: "Chapter 3",
        blocks: [
            { tag: "h2", content: "Chapter 3" },
            { tag: "p", content: "TOM presented himself before Aunt Polly." },
            { tag: "p", content: "“What, a'ready? How much have you done?”" },
            { tag: "p", content: "“It's all done, aunt.”" },
        ]
    };

    it('supports words mode chunking', () => {
        const mockFn = jest.fn();
        render(
            <Chunker
                content={content}
                chunkMode="words"
                chunkWords={3}
                onDone={mockFn} />
        );
        expect(mockFn.mock.calls.length).toEqual(1);
        expect(mockFn.mock.calls[0][0]).toMatchObject([
            {
                "block": 0,
                "tag": "h2",
                "text": "Chapter 3",
                "startingChunk": true,
                "endingChunk": true,
            },
            {
                "block": 1,
                "tag": "p",
                "text": "TOM presented himself",
                "startingChunk": true,
                "endingChunk": false,
            },
            {
                "block": 1,
                "tag": "p",
                "text": "before Aunt Polly.",
                "startingChunk": false,
                "endingChunk": true,
            },
            {
                "block": 2,
                "tag": "p",
                "text": "“What, a'ready? How",
                "startingChunk": true,
                "endingChunk": false,
            },
            {
                "block": 2,
                "tag": "p",
                "text": "much have you",
                "startingChunk": false,
                "endingChunk": false,
            },
            {
                "block": 2,
                "tag": "p",
                "text": "done?”",
                "startingChunk": false,
                "endingChunk": true,
            },
            {
                "block": 3,
                "tag": "p",
                "text": "“It's all done,",
                "startingChunk": true,
                "endingChunk": false,
            },
            {
                "block": 3,
                "tag": "p",
                "text": "aunt.”",
                "startingChunk": false,
                "endingChunk": true,
            },
        ]);
    });

    it('supports width mode chunking', () => {
        const mockFn = jest.fn();
        render(
            <Chunker
                content={content}
                chunkMode="width"
                chunkWidth="2.5in"
                chunkAccuracy={1}
                onDone={mockFn} />
        );
        expect(mockFn.mock.calls.length).toEqual(1);
        expect(mockFn.mock.calls[0][0]).toMatchObject([
            {
                "block": 0,
                "tag": "h2",
                "text": "Chapter 3",
                "startingChunk": true,
                "endingChunk": true,
            },
            {
                "block": 1,
                "tag": "p",
                "text": "TOM presented himself",
                "startingChunk": false,
                "endingChunk": false,
            },
            {
                "block": 1,
                "tag": "p",
                "text": "before Aunt Polly.",
                "startingChunk": false,
                "endingChunk": true,
            },
            {
                "block": 2,
                "tag": "p",
                "text": "“What, a'ready? How much",
                "startingChunk": false,
                "endingChunk": false,
            },
            {
                "block": 2,
                "tag": "p",
                "text": "have you done?”",
                "startingChunk": false,
                "endingChunk": true,
            },
            {
                "block": 3,
                "tag": "p",
                "text": "“It's all done, aunt.”",
                "startingChunk": true,
                "endingChunk": true,
            },
        ]);
    });

    it('supports dynamic mode chunking', () => {
        const mockFn = jest.fn();
        render(
            <Chunker
                content={content}
                chunkMode="dynamic"
                chunkWidthMin="2in"
                chunkWidthMax="4in"
                chunkTransition="step"
                chunkSteps={2}
                onDone={mockFn} />
        );
        expect(mockFn.mock.calls.length).toEqual(1);
        expect(mockFn.mock.calls[0][0]).toMatchObject([
            {
                "block": 0,
                "tag": "h2",
                "text": "Chapter 3",
                "startingChunk": true,
                "endingChunk": true,
            },
            {
                "block": 1,
                "tag": "p",
                "text": "TOM presented himself before Aunt Polly.",
                "startingChunk": true,
                "endingChunk": true,
            },
            {
                "block": 2,
                "tag": "p",
                "text": "“What, a'ready? How",
                "startingChunk": false,
                "endingChunk": false,
            },
            {
                "block": 2,
                "tag": "p",
                "text": "much have you done?”",
                "startingChunk": false,
                "endingChunk": true,
            },
            {
                "block": 3,
                "tag": "p",
                "text": "“It's all done,",
                "startingChunk": false,
                "endingChunk": false,
            },
            {
                "block": 3,
                "tag": "p",
                "text": "aunt.”",
                "startingChunk": false,
                "endingChunk": true,
            },
        ]);
    });

});

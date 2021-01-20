import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import ChunkViewer from '../chunking/chunk/Viewer';

/**
 * This step explains the chunking technique.
 */
function Step6() {

    const makeChunk = (text) => {
        return {
            text: text,
            startingChunk: false,
            endingChunk: false,
        };
    };

    const example = ["to be", "or not", "to be"];
    let [previousChunk, setPreviousChunk] = useState(makeChunk(example[0]));
    let [currentChunk, setCurrentChunk] = useState(makeChunk(example[1]));
    let [nextChunk, setNextChunk] = useState(makeChunk(example[2]));

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentChunk.text === "or not") {
                setPreviousChunk(makeChunk("or not"));
                setCurrentChunk(makeChunk("to be"));
                setNextChunk(makeChunk("or not"));
            } else {
                setPreviousChunk(makeChunk("to be"));
                setCurrentChunk(makeChunk("or not"));
                setNextChunk(makeChunk("to be"));
            }
        }, 500);
        return () => clearInterval(interval);
    });

    const DrillViewport = styled.div`
        position: relative;
        height: 11rem;

        --chunk-color: black;
    `;

    return (
        <>
            <h2>Chunking</h2>

            <p><strong>Chunking involves reading a group of words to limit the number of eye fixations</strong>. The objective of the drills is to train your eyes to read larger chunks, faster.</p>

            <DrillViewport>
                <ChunkViewer neighborChunksPosition={'vertical'}
                    showPreviousChunk
                    showNextChunk
                    fontStyle={"bold"}
                    previousChunk={previousChunk}
                    currentChunk={currentChunk}
                    nextChunk={nextChunk} />
            </DrillViewport>
        </>
    );
}

export default Step6;

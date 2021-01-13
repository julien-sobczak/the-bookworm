import React from 'react';

import InfoIcon from '@material-ui/icons/Info';

import Viewer from './Viewer';
import Window from '../../core/Window';

const previousChunk = {
    text: "Chunking",
    startingChunk: false,
    endingChunk: false,
};
const currentChunk = {
    text: "means reading",
    startingChunk: false,
    endingChunk: false,
};
const nextChunk = {
    text: "groups of words.",
    startingChunk: false,
    endingChunk: false,
};


function Instructions() {

    const viewer = <Viewer neighborChunksPosition={'vertical'}
        showPreviousChunk
        showNextChunk
        fontStyle={"bold"}
        previousChunk={previousChunk}
        currentChunk={currentChunk}
        nextChunk={nextChunk} />;

    return (
        <div>
            <h1>Chunk Drill</h1>
            <div className="Text">
                <p><InfoIcon className="Icon" /> Focus on the highlighted chunk, and read the chunks that appear, one chunk at a time. Make only one fixation per chunk.</p>
            </div>
            <Window content={viewer} />
        </div>
    );

}

export default Instructions;

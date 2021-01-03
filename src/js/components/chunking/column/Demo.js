import React from 'react';

import InfoIcon from '@material-ui/icons/Info';

import Viewer from './Viewer';
import Window from '../../toolbox/Window';

const chunks = [
    { text: "A", startingChunk: false, endingChunk: false, },
    { text: "text", startingChunk: false, endingChunk: false, },
    { text: "becoming", startingChunk: false, endingChunk: false, },
    { text: "larger as we", startingChunk: false, endingChunk: false, },
    { text: "continue the reading.", startingChunk: false, endingChunk: false, },
];

function Demo() {

    const viewer = <Viewer chunkPosition={2} columns={1} chunks={chunks} fontStyle={"bold"} />;

    return (
        <div>
            <h1>Column Drill</h1>
            <div className="Text">
                <p><InfoIcon className="Icon" /> Focus on each column successively, and read each chunk by doing a single fixation. Read the text line per line.</p>
            </div>
            <Window content={viewer} />
        </div>
    );

}

export default Demo;

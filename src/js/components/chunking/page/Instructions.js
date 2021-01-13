import React from 'react';

import InfoIcon from '@material-ui/icons/Info';

import Viewer from './Viewer';
import Window from '../../core/Window';

const page = {
    "number": 1,
    "blocks": [
        {
            tag: "p",
            content: "Speed reading is a collection of complementary techniques like skimming, chunking, pre-reading.",
            chunks: [
                "Speed reading", " ", "is a collection", " ", "of complementary", " ", "techniques like", " ", "skimming,", " ", "chunking,", " ", "pre-reading.",
            ],
        },
    ],
};

function Instructions() {

    const viewer = <Viewer paperSize={"Instructions"} chunkPosition={0} page={page} fontStyle={"bold"} />;

    return (
        <div>
            <h1>Page Drill</h1>
            <div className="Text">
                <p><InfoIcon className="Icon" /> Make one fixation for every highlighted chunk.</p>
            </div>
            <Window content={viewer} />
        </div>
    );

}

export default Instructions;


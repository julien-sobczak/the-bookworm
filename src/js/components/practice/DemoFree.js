import React from 'react';

import InfoIcon from '@material-ui/icons/Info';

import Viewer from './Viewer';
import Window from '../toolbox/Window';

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

function DemoFree() {

    const viewer = <Viewer paperSize={"Demo"} chunkPosition={0} page={page} fontStyle={"bold"} />;

    return (
        <div>
            <h1>Free Practice</h1>
            <div className="Text">
                <p><InfoIcon className="Icon" /> Read the text freely. Try to read as fast as possible without reducing comprehension.</p>
            </div>
            <Window content={viewer} showPanes={true} callouts={[ { text: "1", top: "50%", left: "8%", description: "Click on the left side to turn to the previous page." }, { text: "2", top: "50%", right: "10%", description: "Click on the right side to move to the next page." } ]} />
        </div>
    );

}

export default DemoFree;

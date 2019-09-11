import React from 'react';

import Viewer from './Viewer';
import * as helpers from '../../../functions/engine';

const generateChunks = (newState) => {
    const chunks = function(text) {
        // Only 5 lines on screen
        const linesMax = 5;

        // If it is only one word, duplicate the word on all lines
        if (!Array.isArray(text)) {
            const arr = new Array(linesMax);
            arr.fill(text);
            text = arr;
        }

        // Repeat the same column
        const texts = [];
        for (let l = 0; l < linesMax; l++) {
            for (let c = 0; c < newState.columns; c++) {
                texts.push(text[l]);
            }
        }

        // Convert to chunk format
        const results = [];
        for (let t = 0; t < texts.length; t++) {
            results.push({
                text: texts[t],
                startingChunk: false,
                endingChunk: false,
            });
        }
        return results;
    };

    switch (newState.chunkMode) {
        case "width":
            const length = helpers.SPANS.indexOf(newState.chunkWidth);
            const subtext = 'o'.repeat(length);
            return chunks(`l${subtext}ng`);
        case "dynamic":
            return chunks(["A", "text", "becoming", "larger as we", "progress on the column"]);
        default:
            throw new Error(`${newState.chunkMode} is not implemented.`);
    }
}

function Demo(props) {
    const chunks = generateChunks();
    return <Viewer {...props} chunks={chunks} />;
}

Demo.propTypes = {
    ...Viewer.propTypes,
}

Demo.defaultProps = {
    ...Viewer.defaultProps,
};

export default Demo;

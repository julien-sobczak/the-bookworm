import React from 'react';

import Viewer from './Viewer';
import * as helpers from '../../../functions/engine';

// Generate "basic" text according the various selected chunk options
const generateChunks = (props) => {
    const chunk = function(text) {
        if (props.linesPerChunk > 1) {
            text = Array.fill(text).join('<br/>');
        }
        return {
            text: text,
            startingChunk: false,
            endingChunk: false,
        };
    };

    if (props.chunkMode === "width") {
        const length = helpers.SPANS.indexOf(props.chunkWidth);
        const subtext = 'o'.repeat(length);
        return {
            previousChunk: chunk("A"),
            currentChunk: chunk(`l${subtext}ng`),
            nextChunk: chunk("chunk"),
        };
    } else if (props.chunkMode === "words") {
        const previousWords = ["a", "about", "after", "all", "also", "an", "and", "any", "as", "at"];
        const currentWords = ["than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "to"];
        const nextWords = ["we", "well", "what", "when", "which", "who", "whose", "why", "will", "would",];
        return {
            previousChunk: chunk(previousWords.slice(0, props.chunkWords).join(' ')),
            currentChunk: chunk(currentWords.slice(0, props.chunkWords).join(' ')),
            nextChunk: chunk(nextWords.slice(0, props.chunkWords).join(' ')),
        };
    } else if (props.chunkMode === "dynamic") {
        return {
            previousChunk: chunk("Tiny"),
            currentChunk: chunk("Medium"),
            nextChunk: chunk("Laaaaarge"),
        };
    }
    throw new Error(`${props.chunkMode} is not implemented.`);
};

function Demo(props) {

    const chunks = generateChunks(props);
    const previousChunk = chunks.previousChunk;
    const currentChunk = chunks.currentChunk;
    const nextChunk = chunks.nextChunk;

    return (
        <Viewer {...props}
            previousChunk={previousChunk}
            currentChunk={currentChunk}
            nextChunk={nextChunk} />
    );
}

Demo.propTypes = {
    ...Viewer.propTypes,
};

Demo.defaultProps = {
    ...Viewer.defaultProps,
};

export default Demo;

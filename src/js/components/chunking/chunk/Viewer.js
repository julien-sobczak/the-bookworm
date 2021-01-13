import React from 'react';
import PropTypes from 'prop-types';

import Chunker from '../Chunker';
import Styled from '../../core/Styled';

import * as string from '../../../functions/string';

const defaultViewerSettings = {
    ...Chunker.defaultProps,
    neighborChunksPosition: 'vertical',
    showPreviousChunk: false,
    showNextChunk: true,
    linesPerChunk: 1,
    wpm: 250,
};

function Viewer(props) {

    const classNames = ['NeighborPosition' + string.capitalize(props.neighborChunksPosition)];
    const previousChunkEmpty = !props.previousChunk || props.currentChunk.startingChunk;
    const nextChunkEmpty = !props.nextChunk || props.currentChunk.endingChunk;

    return (
        <div className={"ViewerChunk Centered " + classNames.join(' ')}>
            <Styled {...props} className="Chunks">
                {props.showPreviousChunk && previousChunkEmpty &&
                    <span className="Chunk PreviousChunk Opaque">&nbsp;</span>}
                {props.showPreviousChunk && !previousChunkEmpty &&
                    <span className="Chunk PreviousChunk" dangerouslySetInnerHTML={{ __html: props.previousChunk.text }}></span>}
                {props.neighborChunksPosition === 'vertical' && <br />}

                {props.currentChunk &&
                    <span className="Chunk CurrentChunk Selected" dangerouslySetInnerHTML={{ __html: props.currentChunk.text }}></span>}

                {props.neighborChunksPosition === 'vertical' && <br />}
                {props.showNextChunk && nextChunkEmpty &&
                    <span className="Chunk NextChunk Opaque">&nbsp;</span>}
                {props.showNextChunk && !nextChunkEmpty &&
                    <span className="Chunk NextChunk" dangerouslySetInnerHTML={{ __html: props.nextChunk.text }}></span>}
            </Styled>
        </div>
    );

}

// Values for property neighborChunksPosition.
const neighborChunksPositions = ["vertical", "horizontal"];

Viewer.propTypes = {
    ...Styled.propTypes,
    ...Chunker.propTypes,

    // WPM
    wpm: PropTypes.number,

    // Chunks
    previousChunk: PropTypes.object,
    currentChunk: PropTypes.object,
    nextChunk: PropTypes.object,

    // How many lines per chunk (in practice, pack several chunks into the same chunk)
    linesPerChunk: PropTypes.number,

    // Display the previous/next chunk(s) to the left/right of the current chunk (`horizontal`) or above/below the current chunk (`vertical`).
    neighborChunksPosition: PropTypes.oneOf(neighborChunksPositions),

    // Display the previous chunk
    showPreviousChunk: PropTypes.bool,

    // Display the next chunk
    showNextChunk: PropTypes.bool,
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...Chunker.defaultProps,

    // Text
    // Increase the font size as we are printed few words on the screen
    fontSize: '16pt',

    ...defaultViewerSettings,
};

export { Viewer as default, defaultViewerSettings };

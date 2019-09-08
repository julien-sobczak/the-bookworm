import React from 'react';
import PropTypes from 'prop-types';

import Styled from '../../toolbox/Styled';
import { capitalize } from '../../functions/string';

const DEFAULT_DRILL_SETTINGS = {
    // Chunk options
    neighborChunksPosition: 'vertical',
    showPreviousChunk: false,
    showNextChunk: true,

    // Increase the font size as we are printed few words on the screen
    fontSize: '16pt',
}

function Viewer(props) {

    const classNames = ['NeighborPosition'+capitalize(props.neighborChunksPosition)];
    const previousChunkEmpty = !props.previousChunk || props.currentChunk.startingChunk;
    const nextChunkEmpty = !props.nextChunk || props.currentChunk.endingChunk;

    return (
        <div className={"ViewerChunk Centered " + classNames.join(' ')}>
            <Styled {...props} className="Chunks">
                {props.showPreviousChunk && previousChunkEmpty &&
                    <span className="Chunk PreviousChunk Opaque">&nbsp;</span>}
                {props.showPreviousChunk && !previousChunkEmpty &&
                    <span className="Chunk PreviousChunk" dangerouslySetInnerHTML={{__html: props.previousChunk.text}}></span>}
                {props.neighborChunksPosition === 'vertical' && <br/>}

                {props.currentChunk &&
                    <span className="Chunk CurrentChunk Selected" dangerouslySetInnerHTML={{__html: props.currentChunk.text}}></span>}

                {props.neighborChunksPosition === 'vertical' && <br/>}
                {props.showNextChunk && nextChunkEmpty &&
                    <span className="Chunk NextChunk Opaque">&nbsp;</span>}
                {props.showNextChunk && !nextChunkEmpty &&
                    <span className="Chunk NextChunk" dangerouslySetInnerHTML={{__html: props.nextChunk.text}}></span>}
            </Styled>
        </div>
    );

}

Viewer.propTypes = {
    ...Styled.propTypes,

    // Display the previous/next chunk(s) to the left/right of the current chunk (`horizontal`) or above/below the current chunk (`vertical`).
    neighborChunksPosition: PropTypes.string,

    // Display the previous chunk
    showPreviousChunk: PropTypes.bool,

    // Display the next chunk
    showNextChunk: PropTypes.bool,
}

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...DEFAULT_DRILL_SETTINGS,
};

export { Viewer as default, DEFAULT_DRILL_SETTINGS };

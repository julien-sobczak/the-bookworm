import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

import Chunker from '../Chunker';
import Styled from '../../core/Styled';

import * as string from '../../../functions/string';

/**
 * Default properties.
 */
const defaultViewerSettings = {
    ...Chunker.defaultProps,
    neighborChunksPosition: 'vertical',
    showPreviousChunk: false,
    showNextChunk: true,
    linesPerChunk: 1,
    wpm: 250,
};

/**
 * Render the drill.
 *
 * @param {Object} props The component properties.
 */
function Viewer(props) {

    const classNames = ['NeighborPosition' + string.capitalize(props.neighborChunksPosition)];
    const previousChunkEmpty = !props.previousChunk || props.currentChunk.startingChunk;
    const nextChunkEmpty = !props.nextChunk || props.currentChunk.endingChunk;

    const Viewer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        --chunk-neighbor-margin: .25em;

        .Chunks {
            text-align: center;
        }

        .Chunk {
            display: inline-block;
            padding: 10px;
        }

        &.NeighborPositionVertical .Chunk {
            margin-top: var(--chunk-neighbor-margin);
            margin-bottom: var(--chunk-neighbor-margin);
        }
        &.NeighborPositionHorizontal .Chunk {
            display: inline-block;
            margin-left: var(--chunk-neighbor-margin);
            margin-bottom: var(--chunk-neighbor-margin);
        }
    `;

    return (
        <Viewer className={classnames(...classNames)}>
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
        </Viewer>
    );

}

// Values for property neighborChunksPosition.
const neighborChunksPositions = ["vertical", "horizontal"];

Viewer.propTypes = {
    // Inherit properties
    ...Styled.propTypes,
    ...Chunker.propTypes,

    /**
     * The target WPM determining the duration of a chunk on screen.
     */
    wpm: PropTypes.number,

    // Chunks

    /**
     * The chunk preceding the current chunk.
     */
    previousChunk: PropTypes.object,
    /**
     * The current chunk to read.
     */
    currentChunk: PropTypes.object,
    /**
     * The chunk following the current chunk.
     */
    nextChunk: PropTypes.object,

    /**
     * How many lines per chunk (in practice, we pack several chunks into the same chunk)
     */
    linesPerChunk: PropTypes.number,

    /**
     * Display the previous/next chunk(s) horizontally or vertically.
     */
    neighborChunksPosition: PropTypes.oneOf(neighborChunksPositions),
    /**
     * Display the previous chunk.
     */
    showPreviousChunk: PropTypes.bool,
    /**
     * Display the next chunk.
     */
    showNextChunk: PropTypes.bool,
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...Chunker.defaultProps,

    ...defaultViewerSettings,

    // Increase the font size as we are printed fewer words on the screen
    fontSize: '16pt',
};

export { Viewer as default, defaultViewerSettings };

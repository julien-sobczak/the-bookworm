import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Chunker from '../Chunker';
import Styled from '../../core/Styled';
import { SPANS } from '../../../functions/engine';

const defaultViewerSettings = {
    ...Chunker.defaultProps,
    chunks: [],
    chunkPosition: 0,
    columns: 2,
    columnWidth: '3.25in',
    linesMax: 0,
    wpm: 500,
};

function Viewer(props) {

    const chunks = props.chunks;

    const chunksHTML = [];
    chunks.forEach((c, index) => {
        chunksHTML.push(
            <div key={index}>
                <span
                    className={classnames("Chunk", { "Selected": index === props.chunkPosition })}
                    dangerouslySetInnerHTML={{__html: c.text}} />
            </div>
        );
    });

    const columnsStyle = {
        width: "100%",
        height: "100%",
        gridTemplateColumns: (props.columnWidth + ' ').repeat(props.columns),
    };

    return (
        <div className={"ViewerColumn Centered"}>
            <Styled {...props} className="Columns" style={columnsStyle}>
                {chunksHTML}
            </Styled>
        </div>
    );
}

Viewer.propTypes = {
    ...Styled.propTypes,
    ...Chunker.propTypes,

    // WPM
    wpm: PropTypes.number,

    // How many lines?
    linesMax: PropTypes.number,

    // The chunks to display
    chunks: PropTypes.arrayOf(PropTypes.object),

    // The chunk index to highlight
    chunkPosition: PropTypes.number,

    // How many columns to use to display the chunks
    columns: PropTypes.number,

    // The width of every column
    columnWidth: PropTypes.oneOf(SPANS),
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...Chunker.defaultProps,
    ...defaultViewerSettings,
};

export { Viewer as default, defaultViewerSettings };

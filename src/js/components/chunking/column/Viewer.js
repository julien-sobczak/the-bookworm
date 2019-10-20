import React from 'react';
import PropTypes from 'prop-types';

import Chunker from '../Chunker';
import Styled from '../../toolbox/Styled';

const defaultDrillSettings = {
    ...Chunker.defaultProps,
    chunks: [],
    chunkPosition: 0,
    columns: 2,
    columnWidth: '3.25in',
    linesMax: undefined,
    wpm: 500,
};

function Viewer(props) {

    const chunks = props.chunks;

    const chunksHTML = [];
    chunks.forEach((c, index) => {
        const additionalClasses = [];
        if (index === props.chunkPosition) {
            additionalClasses.push('Selected');
        }
        chunksHTML.push(<div key={index}><span className={"Chunk " + additionalClasses.join(' ')} dangerouslySetInnerHTML={{__html: c.text}} /></div>);
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
    columnWidth: PropTypes.string,
}

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...Chunker.defaultProps,
    ...defaultDrillSettings,
};

export { Viewer as default, defaultDrillSettings };

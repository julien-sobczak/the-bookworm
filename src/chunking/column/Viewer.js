import React from 'react';
import PropTypes from 'prop-types';

import Styled from '../../toolbox/Styled';

function Viewer(props) {
    const chunks = [];
    props.chunks.forEach((c, index) => {
        const additionalClasses = [];
        if (index === props.chunkPosition) {
            additionalClasses.push('Selected');
        }
        chunks.push(<div key={index}><span className={"Chunk " + additionalClasses.join(' ')} dangerouslySetInnerHTML={{__html: c.text}} /></div>);
    });

    const columnsStyle = {
        width: "100%",
        height: "100%",
        gridTemplateColumns: (props.columnWidth + ' ').repeat(props.columns),
    };

    return (
        <div className={"ViewerColumn Centered"}>
            <Styled {...props} className="Columns" style={columnsStyle}>
                {chunks}
            </Styled>
        </div>
    );
}

Viewer.propTypes = {
    ...Styled.propTypes,

    chunks: PropTypes.arrayOf(PropTypes.object),
    chunkPosition: PropTypes.number,
    columns: PropTypes.number,
    columnWidth: PropTypes.string,
}

Viewer.defaultProps = {
    ...Styled.defaultProps,

    chunks: [],
    chunkPosition: 0,

    columns: 2,
    columnWidth: '3.25in',

};

export default Viewer;

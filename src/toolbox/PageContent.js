import React from 'react';
import PropTypes from 'prop-types';

class PageContent extends React.Component {

    render() {
        return (
            <div>
                {this.props.page.blocks.map((block, indexBlock) => React.createElement(
                    block.tag,
                    {key: indexBlock, className: (block.continuation ? 'Continuation' : (block.continued ? 'Continued' : 'Entire')) },
                    block.chunks.map((chunk, indexChunk) => {
                        const selected = indexBlock === this.props.blockPosition && indexChunk === this.props.chunkPosition;
                        return <span className={(chunk.trim() !== '' ? 'Chunk' : 'Space') + (selected ? ' Selected' : '')}
                                    key={indexChunk}
                                    dangerouslySetInnerHTML={{__html: chunk}} />
                    })
                ))}
            </div>
        );
    }

}

PageContent.propTypes = {
    page: PropTypes.object,
    blockPosition: PropTypes.number,
    chunkPosition: PropTypes.number,
}

PageContent.defaultProps = {
    page: {
        blocks: [
            {
                tag: "h2",
                content: "Chapter 3",
                chunks: ["Chapter 3"],
            },
            {
                tag: "p",
                content: "TOM presented himself before Aunt Polly,",
                chunks: ["TOM presented himself", " ", "before Aunt Polly,"],
                continued: true,
                continuation: false,
            },
        ],
    },
    blockPosition: null,
    chunkPosition: null,
};

export default PageContent;

import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_PAGE = {
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
};

class PageContent extends React.Component {

    render() {
        return (
            <div>
                {this.props.page.blocks.map((block, indexBlock) => {
                    if (block.chunks) {
                        return React.createElement(
                            block.tag,
                            {key: indexBlock, className: (block.continuation ? 'Continuation' : (block.continued ? 'Continued' : 'Entire')) },
                            block.chunks.map((chunk, indexChunk) => {

                                const classNames = [];
                                if (indexBlock === this.props.blockPosition && indexChunk === this.props.chunkPosition) {
                                    classNames.push('Selected');
                                }
                                if (chunk.trim() !== '') {
                                    classNames.push('Chunk');
                                } else {
                                    classNames.push('Space');
                                }
                                if (indexBlock < this.props.blockPosition ||
                                    (indexBlock === this.props.blockPosition && indexChunk < this.props.chunkPosition)) {
                                    classNames.push('Before');
                                }
                                if (indexBlock > this.props.blockPosition ||
                                    (indexBlock === this.props.blockPosition && indexChunk > this.props.chunkPosition)) {
                                    classNames.push('After');
                                }

                                return <span className={classNames.join(' ')}
                                            key={indexChunk}
                                            dangerouslySetInnerHTML={{__html: chunk}} />;
                            }));
                    } else {
                        return React.createElement(
                            block.tag,
                            {
                                key: indexBlock, 
                                className: (block.continuation ? 'Continuation' : (block.continued ? 'Continued' : 'Entire')),
                                dangerouslySetInnerHTML: {__html: block.content}
                            });
                    }
                })}
            </div>
        );
    }

}
    
PageContent.propTypes = {
    page: PropTypes.object,
    blockPosition: PropTypes.number,
    chunkPosition: PropTypes.number,
};

PageContent.defaultProps = {
    page: DEFAULT_PAGE,
    blockPosition: null,
    chunkPosition: null,
};

export default PageContent;

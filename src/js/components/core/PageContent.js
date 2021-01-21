import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Static content for testing purposes
const defaultPage = {
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

/**
 * Element rendering a page of text.
 */
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

                                return <span className={classnames(...classNames)}
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
    /**
     * The page to render.
     */
    page: PropTypes.object,
    /**
     * The index of the current block where the current chunk belongs.
     */
    blockPosition: PropTypes.number,
    /**
     * The index of the chunk in the current block.
     */
    chunkPosition: PropTypes.number,
};

PageContent.defaultProps = {
    page: defaultPage,
    blockPosition: null,
    chunkPosition: null,
};

export default PageContent;

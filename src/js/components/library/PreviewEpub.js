import React from 'react';
import PropTypes from 'prop-types';

import { ScreenPreviewContent } from '../core/UI';
import ContentSelector from "./ContentSelector";

class PreviewEpub extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Chapter selection
            chapterIndex: undefined,
            chapter: undefined,
        };

        this.handleChapterSelected = this.handleChapterSelected.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }

    handleChapterSelected(event) {
        const chapterIndex = event.target.dataset.index;
        const chapter = this.props.epub.chapters[chapterIndex];
        this.setState({
            chapterIndex: parseInt(chapterIndex),
            blockStartIndex: 0,
            blockEndIndex: chapter.blocks.length  - 1,
            content: chapter,
        });
    }

    handleValidation(selection) {
        this.props.onSelect(selection);
    }

    render() {
        return (
            <ScreenPreviewContent>

                <div className="Toc">
                    <ul>
                        {this.props.epub.chapters.map((chapter, index) => {
                            return <li key={index} data-index={index} className={index === this.state.chapterIndex ? 'Selected' : ''} onClick={this.handleChapterSelected}>{chapter.title}</li>;
                        })}
                    </ul>
                </div>

                {this.state.content &&
                    <ContentSelector content={this.state.content} onSelect={this.handleValidation} />
                }

            </ScreenPreviewContent>
        );
    }
}

PreviewEpub.propTypes = {
    epub: PropTypes.object,
    onSelect: PropTypes.func,
};

PreviewEpub.defaultProps = {
    onSelect: function() {},
};

export default PreviewEpub;

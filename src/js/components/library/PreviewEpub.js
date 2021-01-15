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
        this.setState({
            chapterIndex: event.chapterIndex,
            blockStartIndex: 0,
            blockEndIndex: event.chapter.blocks.length  - 1,
            content: event.chapter,
        });
    }

    handleValidation(selection) {
        this.props.onSelect(selection);
    }

    render() {
        return (
            <ScreenPreviewContent>

                <Toc
                    chapters={this.props.epub.chapters}
                    selectedIndex={this.state.chapterIndex}
                    onSelect={this.handleChapterSelected} />

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

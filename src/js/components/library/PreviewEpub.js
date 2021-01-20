import React from 'react';
import PropTypes from 'prop-types';

import { PreviewContentScreen } from '../core/UI';
import ContentSelector from "./ContentSelector";

/**
 * Preview an Epub content to allow the user to filter chapters.
 */
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
            <PreviewContentScreen>

                <Toc
                    chapters={this.props.content.chapters}
                    selectedIndex={this.state.chapterIndex}
                    onSelect={this.handleChapterSelected} />

                {this.state.content &&
                    <ContentSelector content={this.state.content} onSelect={this.handleValidation} />
                }

            </PreviewContentScreen>
        );
    }
}

PreviewEpub.propTypes = {
    /**
     * The content in standard format to preview.
     */
    content: PropTypes.object,
    /**
     * Called when the user has finished filtered the content.
     * The callback received the new content filtered in the same format.
     */
    onSelect: PropTypes.func,
};

PreviewEpub.defaultProps = {
    onSelect: function() {},
};

export default PreviewEpub;

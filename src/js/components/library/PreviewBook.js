import React from 'react';
import PropTypes from 'prop-types';

import { ScreenPreviewContent } from '../core/UI';
import ContentSelector from "./ContentSelector";
import Loader from "../toolbox/Loader.js";

class PreviewBook extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Files will be loaded in these variables
            text: undefined,
            metadata: undefined,

            // Chapter selection
            chapterIndex: undefined,
            chapter: undefined,
        };

        this.handleChapterSelected = this.handleChapterSelected.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }

    handleChapterSelected(event) {
        const chapterIndex = event.chapterIndex;
        const chapter = event.chapter;
        const content = {
            type: 'book',
            title: this.props.entry.title,
            author: this.props.entry.author,
            slug: this.props.entry.slug,
            subtitle: chapter.title,
            text: [
                { tag: "h2", content: chapter.title },
            ]
        };
        this.setState({
            chapterIndex: chapterIndex,
            lineStartIndex: content.text[0].sourceLine,
            lineEndIndex: content.text[content.text.length - 1].sourceLine,
            content: content,
        });
    }

    handleValidation(selection) {
        this.props.onSelect(selection);
    }

    render() {
        return (
            <>
                {!this.state.text && !this.state.metadata && <Loader />}
                {this.state.text && this.state.metadata && <ScreenPreviewContent>
                    <div>
                        <Toc
                            chapters={this.state.metadata.chapters}
                            selectedIndex={this.state.chapterIndex}
                            onSelect={this.handleChapterSelected} />

                        {this.state.content &&
                            <ContentSelector content={this.state.content} onSelect={this.handleValidation} />
                        }

                    </div>
                </ScreenPreviewContent>}
            </>
        );
    }

    componentDidMount() {
        const contentUrl = `https://open-library-books.web.app/gutenberg/${this.props.entry.slug}.txt`;
        const metadataUrl = `https://open-library-books.web.app/gutenberg/${this.props.entry.slug}.json`;
        console.log(`Downloading ${contentUrl}...`);
        console.log(`Downloading ${metadataUrl}...`);
        fetch(contentUrl)
            .then(response => {
                return response.text();
            })
            .then(text => {
                this.setState({ text: text });
            });
        fetch(metadataUrl)
            .then((response) => {
                return response.json();
            })
            .then((metadata) => {
                this.setState({ metadata: metadata });
            });
    }
}

PreviewBook.propTypes = {
    entry: PropTypes.object,
    onSelect: PropTypes.func,
};

PreviewBook.defaultProps = {
    onSelect: function() {},
};

export default PreviewBook;

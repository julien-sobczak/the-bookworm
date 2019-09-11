import React from 'react';
import PropTypes from 'prop-types';

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

    static convertToHtml(lines) {
        const result = [];

        let currentBlock = undefined;
        for (let l = 0; l < lines.length; l++) {
            const line = lines[l];

            // New file = end of the previous block
            if (line.trim() === '') {
                if (currentBlock) {
                    result.push(currentBlock);
                    currentBlock = undefined;
                }
            }

            // Block continuation?
            if (!currentBlock) {
                currentBlock = { tag: "p", content: line, sourceLine: l, };
            } else {
                currentBlock.content += ' ' + line;
            }
        }
        // Do not forget to add the last block
        if (currentBlock) {
            result.push(currentBlock);
        }

        return result;
    }

    handleChapterSelected(event) {
        const chapterIndex = event.target.dataset.index;
        const chapter = this.state.metadata.chapters[chapterIndex];
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
        const lines = this.state.text.split('\r\n').slice(chapter.start, chapter.end);
        content.text.push(...PreviewBook.convertToHtml(lines));
        this.setState({
            chapterIndex: parseInt(chapterIndex),
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
            <div className="PreviewContent PreviewBook FullScreen Centered">

                {!this.state.text && !this.state.metadata &&
                    <Loader />
                }

                {this.state.text && this.state.metadata &&
                    <div>

                        <div className="Toc">
                            <ul>
                                {this.state.metadata.chapters && this.state.metadata.chapters.map((chapter, index) => {
                                    return <li key={index} data-index={index} className={index === this.state.chapterIndex ? 'Selected' : ''} onClick={this.handleChapterSelected}>{chapter.title}</li>
                                })}
                            </ul>
                        </div>

                        {this.state.content &&
                            <ContentSelector content={this.state.content} onSelect={this.handleValidation} />
                        }

                    </div>
                }
            </div>
        );
    }

    componentDidMount() {
        const contentUrl = `https://open-library-books.firebaseapp.com/gutenberg/${this.props.entry.slug}.txt`;
        const metadataUrl = `https://open-library-books.firebaseapp.com/gutenberg/${this.props.entry.slug}.json`;
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
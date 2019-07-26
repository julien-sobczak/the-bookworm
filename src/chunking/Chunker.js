import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import Tokenizer from './Tokenizer';

import Styled from '../toolbox/Styled';

/**
 * Concatenate a list of tokens to form a chunk.
 *
 * @param {Object[]} tokens The concatened tokens
 * @returns {string} The merged chunk
 */
function getChunkHTML(tokens) {
    return tokens.map(token => token.token).join('').trim();
}

/**
 * Measure the width of a given text.
 * This is not a React component to avoid rerender after each measurement.
 */
class Measurer {

    constructor({fontFamily, fontSize, fontStyle}) {
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.fontStyle = fontStyle;

        // Manage an element outside this component to append text word by word to find chunks.
        // This avoid having this component to re-render continuously.
        const chunkElementId = 'chunker';
        const chunkElement = React.createElement(
            Styled,
            {
                id: chunkElementId,
                fontFamily: this.fontFamily,
                fontSize: this.fontSize,
                fontStyle: this.fontStyle,
            }
        );
        const chunkHTML = ReactDOMServer.renderToStaticMarkup(chunkElement);
        document.getElementById('root-chunker').innerHTML = chunkHTML;
        this.chunkElement = document.getElementById(chunkElementId);
        this.chunkElement.style.display = "inline-block"; // We want to measure the width (display: block by default)
    }

    /**
     * Measure the effective width of a given text.
     * @param {string} text The text to measure
     * @returns {number} The effective width in pixels
     */
    measure(text) {
        this.chunkElement.innerHTML = text;
        let element = this.chunkElement;
        const computedStyle = getComputedStyle(element);

        let width = element.offsetWidth;   // width with padding
        width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);  // width without padding

        return width;
    }
}

/**
 * Chunking implemention splitting a text into chunks having a maximum width.
 */
class FixedWidthChunker {

    constructor(tokenizer, measurer, width, widthMax) {
        this.tokenizer = tokenizer;
        this.measurer = measurer;
        this.width = width;
        this.widthMax = widthMax;
    }

    chunkenize(text) {
        const chunks = [];

        text.forEach((block) => {
            const tokens = this.tokenizer.tokenize(block.content);
            let indexCurrent = 0;
            let indexStart = 0;
            let currentChunk = "";
            while (indexCurrent < tokens.length) {
                let currentToken = tokens[indexCurrent].token;
                currentChunk += currentToken;

                const chunkWidth = this.measurer.measure(currentChunk);
                if (chunkWidth > this.widthMax) {
                    const newChunk = getChunkHTML(tokens.slice(indexStart, indexCurrent));
                    indexStart = indexCurrent;
                    currentChunk = currentToken;
                    chunks.push({
                        text: newChunk,
                        tag: block.tag,
                        startingChunk: (indexStart === 0),
                    });
                }
                indexCurrent++;
            }

            // Do not forget the last chunk
            const lastChunk = getChunkHTML(tokens.slice(indexStart));
            chunks.push({
                text: lastChunk,
                tag: block.tag,
                startingChunk: (indexStart === 0),
                endingChunk: (indexCurrent === tokens.length),
            });

        });

        return chunks;
    }

}

/**
 * Chunking implementation splitting a text into a group of words.
 */
class WordsChunker {

    constructor(tokenizer, words) {
        this.tokenizer = tokenizer;
        this.words = words;
    }

    chunkenize(text) {
        const chunks = [];

        text.forEach((block) => {
            const tokens = this.tokenizer.tokenize(block.content);

            let i = 0;
            while (i < tokens.length) {
                let currentChunkWords = 0;
                let currentChunk = "";
                let indexStart = i;

                // Advance until the end of the chunk
                while (currentChunkWords < this.words) {
                    let currentToken = tokens[i].token;
                    currentChunk += currentToken;
                    if (currentToken.trim() !== '') {
                        currentChunkWords++;
                    }
                    i++;
                    if (i >= tokens.length) break;
                }

                chunks.push({
                    text: currentChunk,
                    tag: block.tag,
                    startingChunk: (indexStart === 0),
                    endingChunk: (i === tokens.length),
                });
            }
        });

        return chunks;
    }

}

/**
 * Split a text into chunks.
 *
 * Usage:
 *
 * ```
 * <Chunker content={content} onDone={onChunkerDone} />
 *
 * With:
 *
 * const content = {
 *   title: "The Adventures of Tom Sawyer",
 *   author: "Mark Twain",
 *   subtitle: "Chapter 3",
 *   text: [
 *     { tag: "h2", content: "Chapter 3" },
 *     { tag: "p", content: "TOM presented himself before Aunt Polly, ..." },
 *     { tag: "p", content: "“What, a'ready? How much have you done?”" },
 *     { tag: "p", content: "“It's all done, aunt.”" },
 *     { tag: "p", content: "“Tom, don't lie to me--I can't bear it.”" },
 *     { tag: "p", content: "“I ain't, aunt; it <i>is</i> all done.”" },
 *     { tag: "p", content: "Aunt Polly placed small trust in such evidence..." },
 *   ]
 * };
 *
 * const onChunkerDone = function(chunks) {
 *   // Where chunks = [
 *   //   { tag: "h2", text: "Chapter 3" },
 *   //   { tag: "p",  text: "TOM presented" },
 *   //   { tag: "p",  text: "himself before" },
 *   //   { tag: "p",  text: "Aunt Polly," },
 *   //   ...
 *   // ];
 * }
 * ```
 */
class Chunker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Chunks in progress
            chunks: [],
            // The current position inside `chunks`
            chunkPosition: 0,
        };

        this.rulerElement = React.createRef();
        this.changed = true;
    }

    cssChunkSize() {
        return 'Width' + this.props.chunkWidth.replace('.', '_');
    }

    render() {
        return (
            <div className="FullScreen Pager">
                <div className={"Ruler " + this.cssChunkSize()} ref={this.rulerElement}></div>
            </div>
        );
    }

    rulerWidths() {
        let rulerElement = this.rulerElement.current;
        let rulerWidth = rulerElement.clientWidth; // Convert the chunk size from inches to pixels
        let rulerWidthTolerance = (rulerWidth - rulerWidth * this.props.chunkAccuracy);
        let rulerWidthMax = Math.floor(rulerWidth + rulerWidthTolerance);
        return [rulerWidth, rulerWidthMax];
    }

    componentDidMount() {
        if (!this.changed) return;

        const [rulerWidth, rulerWidthMax] = this.rulerWidths();

        if (this.props.debug) {
            console.log(`Chunk measures ${this.props.chunkWidth} = ${rulerWidth}px (tolerance: ${rulerWidthMax}px)`);
        }

        const tokenizer = new Tokenizer();
        const measurer = new Measurer({
            fontFamily: this.props.fontFamily,
            fontSize: this.props.fontSize,
            fontStyle: this.props.fontStyle,
        });

        let chunker = undefined;
        if (this.props.chunkMode === 'width') {
            chunker = new FixedWidthChunker(tokenizer, measurer, rulerWidth, rulerWidthMax);
        } else if (this.props.chunkMode === 'words') {
            chunker = new WordsChunker(tokenizer, this.props.chunkWords);
        }

        const chunks = chunker.chunkenize(this.props.content.text);

        this.changed = false;

        if (this.props.onDone) {
            this.props.onDone(chunks);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.content !== this.props.content) {
            this.setState({
                // Chunks in progress
                chunks: [],
            })
            this.changed = true;
        }
    }
}

Chunker.propTypes = {
    ...Styled.propTypes,

    debug: PropTypes.bool,

    content: PropTypes.object,
    onDone: PropTypes.func,

    // Calculate chunks based on a specific maximum width or split the line in one or more stops
    // (Allowed values: 'width', 'words')
    chunkMode: PropTypes.string,

    // Options when chunkMode = "width"
    chunkWidth: PropTypes.string,
    chunkAccuracy: PropTypes.number,

    // Options when chunkMode = "words"
    chunkWords: PropTypes.number, // the number of words per chunk
}

Chunker.defaultProps = {
    ...Styled.defaultProps,

    debug: true,

    chunkMode: "width",
    chunkWidth: '3in',
    chunkAccuracy: 0.9,
    chunkWords: 1,
};

export default Chunker;

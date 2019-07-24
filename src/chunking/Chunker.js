import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import Tokenizer from './Tokenizer';

import Styled from '../toolbox/Styled';


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

        // Manage an element outside this component to append text word by word to find chunks.
        // This avoid having this component to re-render continuously.
        const chunkElementId = 'chunker';
        const chunkElement = React.createElement(
            Styled,
            {
                id: chunkElementId,
                fontFamily: this.props.fontFamily,
                fontSize: this.props.fontSize,
                fontStyle: this.props.fontStyle,
            }
        );
        const chunkHTML = ReactDOMServer.renderToStaticMarkup(chunkElement);
        document.getElementById('root-chunker').innerHTML = chunkHTML;
        this.chunkElement = document.getElementById(chunkElementId);
        this.chunkElement.style.display = "inline-block"; // We want to measure the width (display: block by default)
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

    chunkWidth() {
        let element = this.chunkElement;
        const computedStyle = getComputedStyle(element);

        let width = element.clientWidth;   // width with padding
        width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);  // width without padding

        return width;
    }

    rulerWidths() {
        let rulerElement = this.rulerElement.current;
        let rulerWidth = rulerElement.clientWidth; // Convert the chunk size from inches to pixels
        let rulerWidthTolerance = (rulerWidth - rulerWidth * this.props.chunkAccuracy);
        let rulerWidthMax = Math.floor(rulerWidth + rulerWidthTolerance);
        return [rulerWidth, rulerWidthMax];
    }

    static chunkenize(tokens) {
        return tokens.map(token => token.token).join('').trim();
    }

    componentDidMount() {
        if (!this.changed) return;

        const [rulerWidth, rulerWidthMax] = this.rulerWidths();

        if (this.props.debug) {
            console.log(`Chunk measures ${this.props.chunkWidth} = ${rulerWidth}px (tolerance: ${rulerWidthMax}px)`);
        }

        const chunks = [];
        const tokenizer = new Tokenizer();

        this.props.content.text.forEach((block) => {

            const tokens = tokenizer.tokenize(block.content);
            let indexCurrent = 0;
            let indexStart = 0;
            let currentChunk = "";
            while (indexCurrent < tokens.length) {
                let currentToken = tokens[indexCurrent].token;
                currentChunk += currentToken;
                this.chunkElement.innerHTML = currentChunk;
                const chunkWidth = this.chunkWidth();
                if (chunkWidth > rulerWidthMax) {
                    const newChunk = Chunker.chunkenize(tokens.slice(indexStart, indexCurrent));
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
            const lastChunk = Chunker.chunkenize(tokens.slice(indexStart));
            chunks.push({
                text: lastChunk,
                tag: block.tag,
                startingChunk: (indexStart === 0),
                endingChunk: (indexCurrent === tokens.length),
            });

        });

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

    chunkWidth: PropTypes.string,
    chunkAccuracy: PropTypes.number,
}

Chunker.defaultProps = {
    ...Styled.defaultProps,

    debug: false,

    chunkWidth: '3in',
    chunkAccuracy: 0.9,
};

export default Chunker;

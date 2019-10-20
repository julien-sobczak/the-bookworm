import React from 'react';
import PropTypes from 'prop-types';
import Tokenizer from './Tokenizer';

import Measurer from '../toolbox/Measurer';
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
 * Chunking implemention splitting a text into chunks having a maximum width.
 */
class FixedWidthChunker {

    constructor(tokenizer, width, accuracy) {
        const tolerance = (width - width * accuracy);
        this.tokenizer = tokenizer;
        this.width = width;
        this.widthMax = Math.floor(width + tolerance);
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

                const [chunkWidth,] = Measurer.measure(currentChunk);
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
 * Chunking implemention splitting a text into chunks having a varied width.
 */
class VariedWidthChunker {

    constructor(tokenizer, widthMin, widthMax, chunkTransition, chunkSteps=10, columns=1) {
        this.tokenizer = tokenizer;
        this.widthMin = widthMin;
        this.widthMax = widthMax;
        this.chunkTransition = chunkTransition;
        this.steps = chunkSteps;
        this.columns = columns;
    }

    widthSteps() {
        const increment = (this.widthMax - this.widthMin) / this.steps;

        const widthSteps = [];
        let currentWidthStep = this.widthMin;
        for (let i = 0; i < this.steps; i++) {
            widthSteps.push(currentWidthStep);
            currentWidthStep += increment;
        }
        widthSteps[widthSteps.length - 1] = this.widthMax;

        return widthSteps;
    }

    chunkenize(text) {
        const chunks = [];

        const widthSteps = this.widthSteps();
        let currentStep = 0;
        let currentColumn = 0;

        text.forEach((block) => {
            const tokens = this.tokenizer.tokenize(block.content);
            let indexCurrent = 0;
            let indexStart = 0;
            let currentChunk = "";

            while (indexCurrent < tokens.length) {
                let currentToken = tokens[indexCurrent].token;
                currentChunk += currentToken;

                const [chunkWidth,] = Measurer.measure(currentChunk);

                if (chunkWidth > widthSteps[currentStep]) {
                    const newChunk = getChunkHTML(tokens.slice(indexStart, indexCurrent));
                    indexStart = indexCurrent;
                    currentChunk = currentToken;

                    const chunkEmpty = newChunk.trim() === '';
                    if (!chunkEmpty) {
                        chunks.push({
                            text: newChunk,
                            tag: block.tag,
                            startingChunk: (indexStart === 0),
                        });

                        currentColumn++;

                        if (currentColumn === this.columns) {
                            currentColumn = 0;
                            currentStep++;
                            if (currentStep === this.steps) {
                                currentStep = 0;
                            }
                        }
                    }
                }
                indexCurrent++;
            }

            // Do not forget the last chunk
            const lastChunk = getChunkHTML(tokens.slice(indexStart));
            const chunkEmpty = lastChunk.trim() === '';
            if (chunkEmpty) return;

            chunks.push({
                text: lastChunk,
                tag: block.tag,
                startingChunk: (indexStart === 0),
                endingChunk: (indexCurrent === tokens.length),
            });

            currentColumn++;
            if (currentColumn === this.columns) {
                currentColumn = 0;
                currentStep++;
                if (currentStep === this.steps) {
                    currentStep = 0;
                }
            }

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
 *   blocks: [
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

        this.changed = true;

        this.onMeasurementsChange = this.onMeasurementsChange.bind(this);
    }

    render() {
        return (
            <div className="FullScreen Chunker">
                <Measurer fontFamily={this.props.fontFamily} fontSize={this.props.fontSize} fontStyle={this.props.fontStyle} onChange={this.onMeasurementsChange} />
            </div>
        );
    }

    onMeasurementsChange(measurements) {
        if (!this.changed) return;

        console.log('Measurer', measurements);

        const tokenizer = new Tokenizer();
        let chunker = undefined;
        if (this.props.chunkMode === 'width') {
            const widthInPixels = measurements[this.props.chunkWidth].width;
            chunker = new FixedWidthChunker(tokenizer, widthInPixels, this.props.chunkAccuracy);
        } else if (this.props.chunkMode === 'dynamic') {
            const widthMinInPixels = measurements[this.props.chunkWidthMin].width;
            const widthMaxInPixels = measurements[this.props.chunkWidthMax].width;
            chunker = new VariedWidthChunker(tokenizer, widthMinInPixels, widthMaxInPixels, this.props.chunkTransition, this.props.chunkSteps, this.props.columns);
        } else if (this.props.chunkMode === 'words') {
            chunker = new WordsChunker(tokenizer, this.props.chunkWords);
        }

        const chunks = chunker.chunkenize(this.props.content.blocks);

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
    // (Allowed values: 'width', 'words', 'dynamic')
    chunkMode: PropTypes.string,

    // Options when chunkMode = "width"
    chunkWidth: PropTypes.string,
    chunkAccuracy: PropTypes.number,

    // Options when chunkMode = "words"
    chunkWords: PropTypes.number, // the number of words per chunk

    // Options when chunkMode = "dynamic"
    chunkWidthMin: PropTypes.string,
    chunkWidthMax: PropTypes.string,
    chunkTransition: PropTypes.string, // `step`, `wave`
    chunkSteps: PropTypes.number,
}

Chunker.defaultProps = {
    ...Styled.defaultProps,

    debug: true,

    chunkMode: "width",
    chunkWidth: '3in',
    chunkAccuracy: 0.9,
    chunkWords: 1,

    chunkWidthMin: '0.25in',
    chunkWidthMax: '4in',
    chunkTransition: 'step',
    chunkSteps: 10,
};

export default Chunker;

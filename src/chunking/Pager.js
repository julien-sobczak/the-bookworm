import React from 'react';
import PropTypes from 'prop-types';
import Tokenizer from './Tokenizer';

import Paper from '../toolbox/Paper';


/**
 * Split a text into pages.
 *
 * Usage:
 *
 * ```
 * <Pager content={content} onDone={onPagerDone} />
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
 * const onPagerDone = function(pages) {
 *   // Where pages = [
 *   //     {
 *   //         "number": 1,
 *   //         "blocks": [
 *   //             { tag: "h2", content: "Chapter 3",
 *   //                          chunks: ["Chapter 3"] },
 *   //             { tag: "p", content: "TOM presented himself before Aunt Polly, ...",
 *   //                         chunks: ["TOM presented", " ", "himself before", " ", "Aunt Polly,", ...] },
 *   //             { tag: "p", content: "“What, a'ready? How much have you done?”",
 *   //                         chunks: ["“What, a'ready?", " ", "How much have you done?”"] },
 *   //         ]
 *   //     },
 *   //     {
 *   //         "number": 2,
 *   //         "blocks": [
 *   //             { tag: "p", continuation: true, content: "“It's all done, aunt.”", chunks: [...] },
 *   //             { tag: "p", content: "“Tom, don't lie to me--I can't bear it.”", chunks: [...] },
 *   //             { tag: "p", content: "“I ain't, aunt; it <i>is</i> all done.”", chunks: [...] },
 *   //             { tag: "p", content: "Aunt Polly placed small trust in such evidence.", chunks: [...] },
 *   //         ]
 *   //     },
 *   // ];
 * }
 * ```
 */
class Pager extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Pages in progress
            pages: [],
            // Current index in props.content.text
            position: 0,
        };

        this.paperElement = React.createRef();
        this.rulerElement = React.createRef();
        this.changed = true;
    }

    cssChunkSize() {
        return 'Width' + this.props.chunkWidth.replace('.', '_');
    }

    render() {
        const tokenizer = new Tokenizer();
        return (
            <div className="FullScreen Pager">
                <div className={"Ruler " + this.cssChunkSize()} ref={this.rulerElement}></div>
                <Paper ref={this.paperElement}
                       paperSize={this.props.paperSize}
                       fontFamily={this.props.fontFamily}
                       fontSize={this.props.fontSize}
                       fontStyle={this.props.fontStyle}
                       backgroundColor={this.props.backgroundColor}
                       color={this.props.color}>
                    {this.props.content.text.slice(this.state.position).map((block, index) => React.createElement(
                        block.tag,
                        {key: index},
                        tokenizer.tokenize(block.content).map((token, iToken) => {
                            return <span className={token.type} key={iToken} dangerouslySetInnerHTML={{__html: token.token}}></span>
                        })
                    ))}
                </Paper>
            </div>
        );
    }

    paperDimensions() {
        let paperElement = this.paperElement.current;
        const paperComputedStyle = getComputedStyle(paperElement);

        let paperHeight = paperElement.clientHeight; // height with padding
        let paperWidth = paperElement.clientWidth;   // width with padding

        paperHeight -= parseFloat(paperComputedStyle.paddingTop) + parseFloat(paperComputedStyle.paddingBottom); // height without padding
        paperWidth -= parseFloat(paperComputedStyle.paddingLeft) + parseFloat(paperComputedStyle.paddingRight);  // width without padding

        return [paperWidth, paperHeight];
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

        const [paperWidth, paperHeight] = this.paperDimensions();
        const [rulerWidth, rulerWidthMax] = this.rulerWidths();

        if (this.props.debug) {
            console.log(`Paper measures ${paperHeight} x ${paperWidth}`);
            console.log(`Chunk measures ${this.props.chunkWidth} = ${rulerWidth}px (tolerance: ${rulerWidthMax}px)`);
        }

        let pageOffsetTop = 0;

        let pages = [];
        let pageNumber = 1;
        let pageBlocks = [];

        let paperElement = this.paperElement.current;
        let blocksElements = [...paperElement.firstElementChild.childNodes];

        blocksElements.forEach(function(blockElement) {

            const tagName = blockElement.tagName.toLowerCase();

            /**
             * Return the concatenation of all children innerHTML property.
             * @param {HTMLElement[]} tokens The HTML elements
             * @returns {string} The text
             */
            const getLineHTML = function(tokens) {
                let lineHTML = "";
                tokens.forEach(function(tokenElement) {
                    const tokenHTML = tokenElement.innerHTML;
                    lineHTML += tokenHTML;
                });
                return lineHTML;
            }

            /**
             * Split the elements in lines.
             * @param {Array[HTMLElement]} tokens The HTML elements
             * @returns {Array[Array[HTMLElement]]} The same HTML elements groupes by line
             */
            const getTokensPerLine = function(tokens) {
                const lines = []
                let currentLine = [];
                let previousOffsetLeft = 0;

                tokens.forEach(function(tokenElement) {
                    if (tokenElement.offsetLeft < previousOffsetLeft) {
                        // New line
                        lines.push(currentLine);
                        currentLine = [];
                    }
                    currentLine.push(tokenElement);
                    previousOffsetLeft = tokenElement.offsetLeft;
                });

                // Do not forget the last line
                if (currentLine.length > 0) {
                    lines.push(currentLine);
                }

                return lines;
            }

            let tokenElements = [...blockElement.childNodes];

            // The relative position of the end of the line
            const offsetBottom = blockElement.offsetTop + blockElement.offsetHeight;

            // Compare this position to the fictious current page bottom
            let pageBottom = pageOffsetTop + paperHeight - 20; // Add a few pixels to be safe
            if (offsetBottom < pageBottom) {
                // The line is completely printed on the current page
                // Easy. Just add it.
                const lineHTML = getLineHTML(tokenElements);
                const linesTokens = getTokensPerLine(tokenElements);

                pageBlocks.push({ tag: tagName, content: lineHTML, lines: linesTokens });
            } else {
                // The line is spread among two or more different pages.
                // We need to split it.

                let newPageOffsetTop = -1;
                let splitNumber = 0;
                let continueSplit = true;

                do {
                    // Search the first word to go to the next page
                    let idxPageBreak = -1;
                    for (let i = 0; i < tokenElements.length; i++) {
                        const e = tokenElements[i];
                        if (e.offsetTop + e.offsetHeight > pageBottom) {
                            idxPageBreak = i;
                            newPageOffsetTop = e.offsetTop;
                            break;
                        }
                    }

                    const currentPageElements = (idxPageBreak === -1) ? tokenElements : tokenElements.slice(0, idxPageBreak);
                    const currentPageHTML = getLineHTML(currentPageElements);
                    const currentPageLines = getTokensPerLine(currentPageElements);

                    // Add the first half-line to the current page.
                    pageBlocks.push({ tag: tagName, continuation: (splitNumber > 0), content: currentPageHTML, lines: currentPageLines });

                    if (idxPageBreak === -1) {
                        // We add all words on the current page. We are ready to move on the next page.
                        continueSplit = false;
                    } else {
                        // We reach the bottom of the page and there is still content to process
                        tokenElements = tokenElements.slice(idxPageBreak);

                        // Add the page
                        pages.push({
                            number: pageNumber++,
                            blocks: pageBlocks,
                        });
                        pageBlocks = [];

                        // Reset counter for next page
                        idxPageBreak = -1;
                        splitNumber++;

                        // Adjust the new page position
                        pageOffsetTop = newPageOffsetTop - 10; // Start the new page at the first word on this page - a few pixels to be safe
                        pageBottom = pageOffsetTop + paperHeight - 30; // Add a few pixels to be safe
                    }
                } while (continueSplit);
            }
        });

        // Don't forget the last page
        if (pageBlocks.length > 0) {
            pages.push({
                number: pageNumber++,
                blocks: pageBlocks,
            });
        }

        pages.forEach(function(page) {
            page.blocks.forEach(function(block) {
                const blockChunks = [];
                block.lines.forEach(function(line) {
                    const lineChunks = [];
                    let currentChunkText = "";
                    let currentChunkOffsetLeft = 0;

                    line.forEach(function(token, idx) {
                        if (token.offsetLeft + token.clientWidth - currentChunkOffsetLeft > rulerWidthMax) {
                            // Too large. We have found a new chunk
                            if (currentChunkText !== "") {
                                lineChunks.push(currentChunkText);
                            }

                            currentChunkText = token.innerHTML;
                            currentChunkOffsetLeft = token.offsetLeft;
                        } else {
                            currentChunkText += token.innerHTML;
                        }

                        // Last token is part of the last chunk
                        if (idx === line.length - 1) {
                            // Last token reached
                            if (currentChunkText !== "") {
                                lineChunks.push(currentChunkText);
                            }
                        }
                    });

                    blockChunks.push(...lineChunks);
                });

                /**
                 * Trim chunks and insert blank spaces between chunks.
                 *
                 * Ex:
                 *   ["TOM presented ", "himself before ", "Aunt Polly", " who was sitting by"]
                 *   =>
                 *   ["TOM presented", " ", "himself before", " ", "Aunt Polly", " ", "who was sitting by"]
                 *
                 * @param {string[]} chunks The chunks to trim
                 * @returns {string[]} The trimmed chunks
                 */
                const trimChunks = function(chunks) {
                    const result = [];
                    blockChunks.forEach(function(chunk) {
                        if (chunk.startsWith(' ')) {
                            result.push(' ');
                        }
                        let addTrailingSpace = false;
                        if (chunk.endsWith(' ')) {
                            addTrailingSpace = true;
                        }
                        result.push(chunk.trim());
                        if (addTrailingSpace) {
                            result.push(' ');
                        }
                    });
                    return result;
                }

                block.chunks = trimChunks(blockChunks);
                delete block.lines;
            });
        });

        this.changed = false;

        if (this.props.onDone) {
            this.props.onDone(pages);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.content !== this.props.content) {
            this.setState({
                // Pages in progress
                pages: [],
                // Current index in props.content.text
                position: 0,
            })
            this.changed = true;
        }
    }

}

Pager.propTypes = {
    ...Paper.propTypes,

    debug: PropTypes.bool,

    content: PropTypes.object,
    onDone: PropTypes.func,

    chunkWidth: PropTypes.string,
    chunkAccuracy: PropTypes.number,
}

Pager.defaultProps = {
    ...Paper.defaultProps,

    debug: true,

    chunkWidth: '2in',
    chunkAccuracy: 0.9,
};

export default Pager;

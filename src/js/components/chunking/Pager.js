import React from 'react';
import PropTypes from 'prop-types';
import Tokenizer from './Tokenizer';

import Paper from '../toolbox/Paper';

// Check https://stackoverflow.com/questions/39673898/divide-array-into-k-contiguos-partitions-such-that-sum-of-maximum-partition-is-m
function partition(a, k) {

    if (k === 1) {
        return [a];
    }

    const n = a.length;
    let high = 0, low = 0, mid = 0;

    for (let i = 0; i < n; ++i) {
        high += a[i];
        low = Math.max(a[i], low);
    }

    while (low <= high) {
        mid = Math.floor((low + high) / 2);

        let part_sum = 0;
        let parts = 1;
        for (let i = 0; i < n; ++i) {
            if (part_sum + a[i] > mid) {
                part_sum = a[i];
                parts++;
            } else {
                part_sum += a[i];
            }
        }

        // if no. of parts in less than (or equal to) k then mid needs to (,or can) be more constrained by reducing upper limit
        if (parts <= k) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    const result = [[]];
    let part_sum = 0;
    let parts = 1;
    mid++; // Don't know why...
    for (let i = 0; i < n; ++i) {
        if (part_sum + a[i] > mid) {
            result.push([a[i]]);
            part_sum = a[i];
            parts++;
        } else {
            result[parts - 1].push(a[i]);
            part_sum += a[i];
        }
    }

    return result;
}


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
function trimChunks(chunks) {
    const result = [];
    chunks.forEach(function(chunk) {
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

/**
 * Split a line into chunks having a width no larger than a specified value.
 */
class LineWidthChunker {

    /**
     * Unique constructor.
     * @param {number} width The ideal chunk width
     * @param {number} accuracy The tolerance to apply when evaluating a chunk
     */
    constructor(width, widthMax) {
        this.chunkWidth = width;
        this.chunkWidthMax = widthMax;
    }

    /**
     * Process the tokens to extract the chunks.
     * @param {HTMLElement[]} tokens A list of HTML element (should all be on the same "line")
     * @return {string[]} The chunks.
     */
    chunkize(tokens) {
        const chunks = [];

        const lastToken = tokens[tokens.length - 1];
        const lineWidth = lastToken.offsetLeft + lastToken.offsetWidth;

        const k = Math.ceil(lineWidth / this.chunkWidthMax);
        const a = tokens.map((e) => e.offsetWidth);
        const chunkWidths = partition(a, k);

        let i = 0;
        chunkWidths.forEach(function(p) {
            let text = "";
            p.forEach(() => {
                text += tokens[i].innerHTML;
                i++;
            });
            chunks.push(text);
        });
        return trimChunks(chunks);
    }
}

/**
 * Split a line into a specific number of chunks.
 * Chunks width will be balanced.
 */
class LineStopsChunker {

    /**
     * Unique constructor
     * @param {number} stops The number of chunks per line
     * @param {number} paperWidth The maximum line width in pixels
     */
    constructor(stops, paperWidth) {
        this.stops = stops;
        this.paperWidth = paperWidth;
    }

    /**
     * Process the tokens to extract the chunks.
     * @param {HTMLElement[]} tokens A list of HTML element (should all be on the same "line")
     * @return {string[]} The chunks.
     */
    chunkize(tokens) {
        const columnWidth = this.paperWidth / this.stops; // ex: 600px / 3 => 200px
        const separators = [];
        for (let i = 0; i < this.stops; i++) {
            separators[i] = columnWidth * (i+1);
        }
        separators[this.stops - 1] = 10000; // Make sure last chunks on the line go to the last stops.
        // ex: separators = [200, 400, 600]; => first column stops at 200px, second column at 400px, etc.

        const chunks = [];
        let i = 0;
        let chunkText = "";
        let chunkOffsetRight = 0; // we are interested by the right border of each word
        tokens.forEach(function(token) {
            chunkOffsetRight += token.offsetWidth;
            if (
                // Chunk is completely included in the current interval
                chunkOffsetRight <= separators[i] ||
                // Chunk is larger than the current interval but most of the chunk is present in this interval
                (separators[i] - chunkOffsetRight) >= (chunkOffsetRight - separators[i])) {
                chunkText += token.innerHTML;
            } else {
                // Most of the chunk content is present in the next chunk
                chunks.push(chunkText);
                i++;
                chunkText = token.innerHTML;
            }
        });
        if (chunkText !== "") {
            chunks.push(chunkText);
        }
        return trimChunks(chunks);
    }
}

class LineWordsChunker {

    /**
     * Unique constructor
     * @param {number} words The number of words per chunk per line
     */
    constructor(words) {
        this.words = words;
    }

    /**
     * Process the tokens to extract the chunks.
     * @param {HTMLElement[]} tokens A list of HTML element (should all be on the same "line")
     * @return {string[]} The chunks.
     */
    chunkize(tokens) {
        const chunks = [];
        let i = 0;
        while (i < tokens.length) {
            let currentChunkWords = 0;
            let currentChunk = "";

            // Advance until the end of the chunk
            while (currentChunkWords < this.words) {
                let currentToken = tokens[i].innerHTML;
                currentChunk += currentToken;
                if (currentToken.trim() !== '') {
                    currentChunkWords++;
                }
                i++;
                if (i >= tokens.length) break;
            }

            chunks.push(currentChunk);
        }

        return trimChunks(chunks);
    }
}

class BlocksPager {

    constructor(paperWidth, paperHeight) {
        this.paperWidth = paperWidth;
        this.paperHeight = paperHeight;
    }

    /**
     * Return the concatenation of all children innerHTML property.
     * @param {HTMLElement[]} tokens The HTML elements
     * @returns {string} The text
     */
    static getLineHTML(tokens) {
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
    static getTokensPerLine(tokens) {
        const lines = [];
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

    paginate(blocksElements) {
        let pageOffsetTop = 0;

        let pages = [];
        let pageNumber = 1;
        let pageBlocks = [];

        blocksElements.forEach((blockElement, blockElementIndex) => {

            const tagName = blockElement.tagName.toLowerCase();
            let tokenElements = [...blockElement.childNodes];

            // The relative position of the end of the line
            const offsetBottom = blockElement.offsetTop + blockElement.offsetHeight;

            // Compare this position to the fictious current page bottom
            let pageBottom = pageOffsetTop + this.paperHeight - 20; // Add a few pixels to be safe
            if (offsetBottom < pageBottom) {
                // The line is completely printed on the current page
                // Easy. Just add it.
                const lineHTML = BlocksPager.getLineHTML(tokenElements);
                const linesTokens = BlocksPager.getTokensPerLine(tokenElements);

                pageBlocks.push({
                    tag: tagName,
                    content: lineHTML,
                    lines: linesTokens,
                    block: blockElementIndex,
                });
            } else {
                // The line is spread among two or more different pages.
                // We need to split it.
                let newPageOffsetTop = -1;
                let splitNumber = 0;
                let continueSplit = true;

                do {
                    // Search the first word to go to the next page
                    let indexWordPageBreak = -1;
                    for (let i = 0; i < tokenElements.length; i++) {
                        const e = tokenElements[i];
                        if (e.offsetTop + e.offsetHeight > pageBottom) {
                            indexWordPageBreak = i;
                            newPageOffsetTop = e.offsetTop;
                            break;
                        }
                    }

                    const currentPageElements = (indexWordPageBreak === -1) ? tokenElements : tokenElements.slice(0, indexWordPageBreak);
                    const currentPageHTML = BlocksPager.getLineHTML(currentPageElements);
                    const currentPageLines = BlocksPager.getTokensPerLine(currentPageElements);

                    // Add the first half-line to the current page.
                    if (currentPageHTML.length > 0) {
                        pageBlocks.push({
                            tag: tagName,
                            content: currentPageHTML,
                            lines: currentPageLines,
                            block: blockElementIndex,
                            continued: (indexWordPageBreak !== -1), // the line is not the end
                            continuation: (splitNumber > 0),        // the line is not the start
                        });
                        splitNumber++;
                    }

                    if (indexWordPageBreak === -1) {
                        // We add all words on the current page. We are ready to move on the next page.
                        continueSplit = false;
                    } else {
                        // We reach the bottom of the page and there is still content to process
                        tokenElements = tokenElements.slice(indexWordPageBreak);

                        // Add the page
                        pages.push({
                            number: pageNumber++,
                            blocks: pageBlocks,
                        });
                        pageBlocks = [];

                        // Reset counter for next page
                        indexWordPageBreak = -1;

                        // Adjust the new page position
                        pageOffsetTop = newPageOffsetTop - 10; // Start the new page at the first word on this page - a few pixels to be safe
                        pageBottom = pageOffsetTop + this.paperHeight - 40; // Add a few pixels to be safe
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

        return pages;
    }

}


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
 * const onPagerDone = function(pages) {
 *   // Where pages = [
 *   //     {
 *   //         "number": 1,
 *   //         "blocks": [
 *   //             { tag: "h2", content: "Chapter 3",
 *   //                          chunks: ["Chapter 3"],
 *   //                          block: 0 },
 *   //             { tag: "p", content: "TOM presented himself before Aunt Polly, ...",
 *   //                         chunks: ["TOM presented", " ", "himself before", " ", "Aunt Polly,", ...],
 *   //                         block: 1 },
 *   //             { tag: "p", content: "“What, a'ready? How much have you done?”",
 *   //                         chunks: ["“What, a'ready?", " ", "How much have you done?”"],
 *   //                         block: 2 },
 *   //         ]
 *   //     },
 *   //     {
 *   //         "number": 2,
 *   //         "blocks": [
 *   //             { tag: "p", continuation: true, content: "“It's all done, aunt.”", chunks: [...], block: 3 },
 *   //             { tag: "p", content: "“Tom, don't lie to me--I can't bear it.”", chunks: [...], block: 4 },
 *   //             { tag: "p", content: "“I ain't, aunt; it <i>is</i> all done.”", chunks: [...], block: 5 },
 *   //             { tag: "p", content: "Aunt Polly placed small trust in such evidence.", chunks: [...], block: 6 },
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
            // Current index in props.content.blocks
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
                    {this.props.content.blocks.slice(this.state.position).map((block, index) => React.createElement(
                        block.tag,
                        {key: index},
                        tokenizer.tokenize(block.content).map((token, iToken) => {
                            return <span className={token.type} key={iToken} dangerouslySetInnerHTML={{__html: token.token}}></span>;
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

    getPager() {
        const [paperWidth, paperHeight] = this.paperDimensions();
        return new BlocksPager(paperWidth, paperHeight);
    }

    getChunker() {
        if (this.props.chunkMode === 'width') {
            const [chunkIdealWidth, chunkMaxWidth] = this.rulerWidths();
            console.log(`Chunk measures ${this.props.chunkWidth}: ${chunkIdealWidth}px (${chunkMaxWidth} with tolerance)`);
            return new LineWidthChunker(chunkIdealWidth, chunkMaxWidth);
        } else if (this.props.chunkMode === 'stops') {
            const [paperWidth,] = this.paperDimensions();
            return new LineStopsChunker(this.props.chunkStops, paperWidth);
        } else if (this.props.chunkMode === 'words') {
            return new LineWordsChunker(this.props.chunkWords);
        }
    }

    componentDidMount() {
        if (!this.changed) return;

        if (this.props.debug) {
            const [paperWidth, paperHeight] = this.paperDimensions();
            console.log(`Paper measures ${paperHeight} x ${paperWidth}`);
        }

        const paperElement = this.paperElement.current;
        const blocksElements = [...paperElement.firstElementChild.childNodes];

        // Generate pages
        const pager = this.getPager();
        const pages = pager.paginate(blocksElements);

        // Add chunks
        if (this.props.chunkMode !== 'none') {
            const chunker = this.getChunker();
            pages.forEach(function(page) {
                page.blocks.forEach(function(block) {
                    block.chunks = block.lines.flatMap((tokens) => chunker.chunkize(tokens));
                    delete block.lines;
                });
            });
        }

        this.changed = false;

        if (this.props.onDone) {
            this.props.onDone(pages);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.content !== this.props.content) {
            this.setState({
                // Pages in progress
                pages: [],
                // Current index in props.content.blocks
                position: 0,
            });
            this.changed = true;
        }
    }

}

Pager.propTypes = {
    ...Paper.propTypes,

    debug: PropTypes.bool,

    content: PropTypes.object,
    onDone: PropTypes.func,

    // Calculate chunks based on a specific maximum width or split the line in one or more stops
    // (Allowed values: 'none', 'width', 'stops', 'words')
    chunkMode: PropTypes.string,
    // chunkMode `width` options
    chunkWidth: PropTypes.string,
    chunkAccuracy: PropTypes.number,
    // chunkMode `stops` options
    chunkStops: PropTypes.number,
    // chunkMode `words` options
    chunkWords: PropTypes.number,
};

Pager.defaultProps = {
    ...Paper.defaultProps,

    debug: false,

    chunkMode: 'width',

    // chunkMode `width` options
    chunkWidth: '2in',
    chunkAccuracy: 0.9,

    // chunkMode `stops` options
    chunkStops: 2,

    // chunkMode `words` options
    chunkWords: 1,

    // Sample content
    content: {
        title: "The Adventures of Tom Sawyer",
        author: "Mark Twain",
        subtitle: "Chapter 3",
        blocks: [
            { tag: "h2", content: "Chapter 3" },
            { tag: "p", content: "TOM presented himself before Aunt Polly, who was sitting by an open window in a pleasant rearward apartment, which was bedroom, breakfast-room, dining-room, and library, combined. The balmy summer air, the restful quiet, the odor of the flowers, and the drowsing murmur of the bees had had their effect, and she was nodding over her knitting--for she had no company but the cat, and it was asleep in her lap. Her spectacles were propped up on her gray head for safety. She had thought that of course Tom had deserted long ago, and she wondered at seeing him place himself in her power again in this intrepid way. He said: “Mayn't I go and play now, aunt?”" },
            { tag: "p", content: "“What, a'ready? How much have you done?”" },
        ]
    },
};

export { Pager as default, LineWidthChunker, LineStopsChunker, partition };

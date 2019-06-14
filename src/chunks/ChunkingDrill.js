import React from 'react';
import { Link } from "react-router-dom";


class BookParser {

    constructor(book) {
        this.book = book
        const startBook = this.book.text.indexOf('CHAPTER I')
        const endBook = this.book.text.indexOf('CONCLUSION')
        this.subtext = this.book.text.substring(startBook, endBook) // TODO immutable
        this.i = 0;
    }

    nextWord() {
        const j = this.subtext.indexOf(' ', this.i)
        const word = this.subtext.substring(this.i, j);
        this.i = j + 1;
        return word
    }
}

class ChunkingDrill extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wpm: this.props.wpm, // WPM to start with

            // The content to read
            content: undefined,

            // Extract chunks from raw text
            parser: undefined,

            // The chunks to display on screen
            previousChunk: undefined,
            currentChunk: undefined,
            nextsChunk: undefined,
        };

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.initReader = this.initReader.bind(this);
        this.advanceChunk = this.advanceChunk.bind(this);
    }

    render() {
        const styles = {
            "display": "grid",
            "height": "100vh",
            "placeItems": "center center",
        }
        return (
            <div className="drill ChunkingDrill" style={styles}>

                <Link to="/chunking/" className="closeBtn"><i className="material-icons">close</i></Link>

                <section className="GameControls">
                    <ul>
                        <li><button onClick={this.increaseWpm}><i className="material-icons">chevron_left</i></button></li>
                        <li><button onClick={this.reduceWpm}><i className="material-icons">chevron_right</i></button></li>
                    </ul>
                </section>

                {this.state.currentChunk &&
                    <section className="GameArea">
                        {this.state.previousChunk}
                        {this.state.currentChunk}
                        {this.state.nextChunk}
                    </section>}
            </div>
        );
    }

    increaseWpm() {
        this.setState(state => ({
            ...state,
            wpm: state.wpm + 20,
        }));
    }

    reduceWpm() {
        this.setState(state => ({
            ...state,
            wpm: state.wpm - 20,
        }));
    }

    componentDidMount() {
        fetch('/books/gutenberg-74-0.txt')
            .then(response => response.text())
            .then(data => this.setState(state =>  ({
                ...state,
                content: {
                    "type": "book",
                    "author": "Mark Twain",
                    "bookTitle": "The Adventures of Tom Sawyer",
                    "text": data,
                }
            }))).then(this.initReader);
    }

    advanceChunk() {
        if (!this.state.parser) return
        const word = this.state.parser.nextWord()
        this.setState(state => ({
            ...state,
            currentChunk: word,
        }));
    }

    initReader() {

        let parser = undefined;

        if (this.state.content.type === 'book') {
            parser = new BookParser(this.state.content);
            this.setState(state =>  ({
                ...state,
                parser: parser,
            }));
        }

        const delay = 1000;
        let start = new Date().getTime()
        let handle = undefined;
        let loop = () => {
            handle = window.requestAnimationFrame(loop);
            const current = new Date().getTime()
            const delta = current - start
            if (delta >= delay) {
              this.advanceChunk();
              start = new Date().getTime();
            }
        }
        handle = window.requestAnimationFrame(loop);

        this.setState(state =>  ({
            ...state,
            handle: handle,
        }));
    }

    componentWillUnmount() {
        // Housekeeping
        clearInterval(this.state.handle);
    }

}

ChunkingDrill.defaultProps = {
    wpm: 100,
};

export default ChunkingDrill;

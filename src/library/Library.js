import React, { useState } from 'react';
import PropTypes from 'prop-types';

import BookPreview from './BookPreview';
import WebsitePreview from './WebsitePreview';
import TextPreview from './TextPreview';

import MainButton from "../toolbox/MainButton";
import Loader from "../toolbox/Loader";


class LibraryBooks extends React.Component {

    CATALOG_URL = "https://open-library-books.firebaseapp.com/catalog.json";

    constructor(props) {
        super(props);

        this.state = {
            slug: undefined,
            catalog: [],
        };

        this.handleBookSelected = this.handleBookSelected.bind(this);
    }

    handleBookSelected(event) {
        this.setState({
            slug: event.target.dataset.slug,
        });
    }

    render() {
        return (
            <div className="LibraryBooks Centered">
                {this.state.catalog.length === 0 && <Loader />}

                {!this.state.slug &&
                    <>
                        <h3>Choose a book</h3>
                        {/* Add filters by language, by kind, search box */}
                        <div className="Bookshelf">
                            <ul>
                                {this.state.catalog.map((book, index) => {
                                    return (
                                        <li key={index}>
                                            <button data-slug={book.slug} onClick={this.handleBookSelected}>
                                                {book.title}, by {book.author}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="Buttons">
                            <MainButton text="Back" colorText="white" colorBackground="#111" onClick={() => this.props.onCancel()} />
                        </div>
                    </>
                }

                {this.state.slug &&
                    <BookPreview slug={this.state.slug} onSelect={(selection) => this.props.onSelect(selection) } />
                }

            </div>
        );
    }

    componentDidMount() {
        console.log(`Downloading ${this.CATALOG_URL}...`);
        fetch(this.CATALOG_URL)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({ catalog: data });
            });
    }
}


function LibraryWebsite({ onSelect, onCancel }) {

    const [url, setUrl] = useState(undefined);
    const [ready, setReady] = useState(false);

    return (
        <div className="LibraryWebsite Centered">
            {ready && <WebsitePreview url={url} onSelect={(selection) => onSelect(selection) } />}

            {!ready &&
                <>
                    <h3>Copy your URL</h3>
                    <input type="text" name="url" onChange={(e) => setUrl(e.target.value)} />
                    <div className="Buttons">
                        <MainButton text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                        <MainButton text="Read" colorText="white" colorBackground="#111" onClick={() => setReady(true)} />
                    </div>
                </>
            }
        </div>
    );
}

function LibraryClipboard({ onSelect, onCancel }) {

    const [text, setText] = useState("");
    const [ready, setReady] = useState(false);

    return (
        <div className="LibraryClipboard Centered">
            {ready && <TextPreview text={text} onSelect={(selection) => onSelect(selection) } />}

            {!ready &&
                <>
                    <h3>Copy/Paste your text</h3>
                    <textarea name="clipboard" value={text} onChange={(e) => setText(e.target.value)}>
                    </textarea>
                    <div className="Buttons">
                        <MainButton text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                        <MainButton text="Read" colorText="white" colorBackground="#111" onClick={() => setReady(true)} />
                    </div>
                </>
            }
        </div>
    );
}

class Library extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            category: undefined,
        };

        this.handleBookSelection = this.handleBookSelection.bind(this);
        this.handleWebsiteSelection = this.handleWebsiteSelection.bind(this);
        this.handleClipboardSelection = this.handleClipboardSelection.bind(this);

        this.handleCancel = this.handleCancel.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }

    handleBookSelection(event) {
        this.setState(state => ({
            ...state,
            category: "book",
        }));
    }

    handleWebsiteSelection(event) {
        this.setState(state => ({
            ...state,
            category: "website",
        }));
    }

    handleClipboardSelection(event) {
        this.setState(state => ({
            ...state,
            category: "clipboard",
        }));
    }

    handleCancel(event) {
        this.setState(state => ({
            ...state,
            category: undefined,
        }));
    }

    handleSelection(selection) {
        console.log('Selection', selection);
        this.props.onSelect(selection)
    }

    render() {
        return (
            <div className="Library FullScreen Centered">

                {!this.state.category &&
                    <div className="LibraryWelcome Centered">
                        <h3>What you want to read?</h3>

                        {this.state.readings &&
                            <div>
                                <h4>Continue the reading</h4>
                                <ul className="Readings">
                                    <li>The Adventures of Tom Sawyer, by Mark Twain (85%)</li>
                                </ul>
                            </div>
                        }

                        <section className="LibraryCategories">
                            <div className="LibraryCategory">
                                <MainButton text="A book" colorText="white" colorBackground="#111" onClick={this.handleBookSelection} />
                            </div>

                            {/*
                              * Disabled because it requires to find a real solution to execute CORS requests
                            <div className="LibraryCategory">
                                <MainButton text="A website" colorText="white" colorBackground="#111" onClick={this.handleWebsiteSelection} />
                            </div>
                            */}
                            <div className="LibraryCategory">
                                <MainButton text="A Copy-Paste text" colorText="white" colorBackground="#111" onClick={this.handleClipboardSelection} />
                            </div>
                        </section>
                    </div>
                }

                {this.state.category === "book" &&
                    <LibraryBooks onSelect={this.handleSelection} onCancel={this.handleCancel} />
                }

                {this.state.category === "website" &&
                    <LibraryWebsite onSelect={this.handleSelection} onCancel={this.handleCancel} />
                }

                {this.state.category === "clipboard" &&
                    <LibraryClipboard onSelect={this.handleSelection} onCancel={this.handleCancel} />
                }

            </div>
        );
    }
}

Library.propTypes = {
    onSelect: PropTypes.func,
};

Library.defaultProps = {
    onSelect: function() {},
};

export default Library;
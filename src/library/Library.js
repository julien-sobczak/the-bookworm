import React from 'react';
import PropTypes from 'prop-types';

import LibraryBooks from './LibraryBooks';
import LibraryWebsite from './LibraryWebsite';
import LibraryClipboard from './LibraryClipboard';

import MainButton from "../toolbox/MainButton";

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
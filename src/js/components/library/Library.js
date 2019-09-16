import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import LibraryBooks from './LibraryBooks';
import LibraryWebsite from './LibraryWebsite';
import LibraryClipboard from './LibraryClipboard';
import LibraryUpload from './LibraryUpload';

import Button from "../toolbox/Button";
import ButtonUpload from "./ButtonUpload";

const mapStateToProps = state => {
    return { readings: state.readings };
};

class Library extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            category: undefined,
        };

        this.handleBookSelection = this.handleBookSelection.bind(this);
        this.handleWebsiteSelection = this.handleWebsiteSelection.bind(this);
        this.handleClipboardSelection = this.handleClipboardSelection.bind(this);
        this.handleUploadSelection = this.handleUploadSelection.bind(this);

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

    handleUploadSelection(event) {
        this.setState(state => ({
            ...state,
            category: "upload",
            file: event.file,
            filetype: event.filetype,
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

                <button className="ButtonClose" onClick={() => this.props.onClose()}><i className="material-icons">close</i></button>

                {!this.state.category &&
                    <div className="LibraryWelcome Centered">
                        <h3>What you want to read?</h3>

                        {this.props.readings &&
                            <>
                                <h4>Continue the reading</h4>
                                <div className="Readings">
                                    {this.props.readings.map((reading, index) => {
                                        return (
                                            <div key={index} className="Clickable" onClick={this.handleBookSelected}>
                                                <span className="BookTitle">
                                                    {reading.title}
                                                </span>
                                                <span className="BookAuthor">
                                                    {reading.author}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }

                        <section className="LibraryCategories">
                            <div className="LibraryCategory">
                                <Button text="A book" colorText="white" colorBackground="#111" onClick={this.handleBookSelection} />
                            </div>

                            {/*
                              * Disabled because it requires to find a real solution to execute CORS requests
                            <div className="LibraryCategory">
                                <Button text="A website" colorText="white" colorBackground="#111" onClick={this.handleWebsiteSelection} />
                            </div>
                            */}

                            <div className="LibraryCategory">
                                <Button text="A Copy-Paste text" colorText="white" colorBackground="#111" onClick={this.handleClipboardSelection} />
                            </div>

                            <div className="LibraryCategory">
                                <ButtonUpload text="An Upload" colorText="white" colorBackground="#111" onClick={this.handleUploadSelection} />
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

                {this.state.category === "upload" &&
                    <LibraryUpload file={this.state.file} filetype={this.state.filetype} onSelect={this.handleSelection} onCancel={this.handleCancel} />
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

export default connect(mapStateToProps)(Library);
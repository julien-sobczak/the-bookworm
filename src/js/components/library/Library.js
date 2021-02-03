import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import LibraryBooks from './LibraryBooks';
import LibraryWebsite from './LibraryWebsite';
import LibraryClipboard from './LibraryClipboard';

import { LibraryScreen } from './UI';
import ReadingsList from './ReadingsList';
import LargeButton from "../toolbox/LargeButton";
import LargeButtonUpload from "./LargeButtonUpload";

import { updateReading } from '../../store/actions';

import LargeButtonGroup from '../toolbox/LargeButtonGroup';

/**
 * Library is the main component for the Library menu item.
 *
 * It prints the latest readings as save in the local storage.
 * It also allows the user to select a new book, a new free text,
 * or even a whole new book in ePub format.
 */
class Library extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            category: undefined,
        };

        this.handleBookSelect = this.handleBookSelect.bind(this);
        this.handleWebsiteSelect = this.handleWebsiteSelect.bind(this);
        this.handleClipboardSelect = this.handleClipboardSelect.bind(this);

        this.handleCancel = this.handleCancel.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleReadingSwitch = this.handleReadingSwitch.bind(this);
    }

    handleBookSelect() {
        this.setState({
            category: "book",
        });
    }

    handleWebsiteSelect() {
        this.setState({
            category: "website",
        });
    }

    handleClipboardSelect() {
        this.setState({
            category: "clipboard",
        });
    }

    handleReadingSwitch(reading) {
        this.props.updateReading(reading);
    }

    handleCancel() {
        this.setState(state => ({
            ...state,
            category: undefined,
        }));
    }

    handleSelect(selection) {
        this.props.onSelect(selection);
    }

    render() {
        return (
            <>
                {!this.state.category && <LibraryScreen className="LibraryWelcome" onClose={this.props.onClose}>
                    <h3>What you want to read?</h3>

                    {this.props.readings && <ReadingsList readings={this.props.readings} onSwitch={this.handleReadingSwitch} />}

                    <LargeButtonGroup>
                        <LargeButton text="A book" colorText="white" colorBackground="#111" onClick={this.handleBookSelect} />
                        <LargeButton text="A Copy-Paste text" colorText="white" colorBackground="#111" onClick={this.handleClipboardSelect} />
                        <LargeButtonUpload text="An Upload" colorText="white" colorBackground="#111" onClick={this.handleSelect} />
                        {/*
                          * Disabled because it requires to find a real solution to execute CORS requests
                          * Ex: https://github.com/Rob--W/cors-anywhere
                          * <LargeButton text="A website" colorText="white" colorBackground="#111" onClick={this.handleWebsiteSelect} />
                          */}
                    </LargeButtonGroup>
                </LibraryScreen>}

                {this.state.category === "book" &&
                    <LibraryBooks onSelect={this.handleSelect} onCancel={this.handleCancel} />
                }

                {this.state.category === "website" &&
                    <LibraryWebsite onSelect={this.handleSelect} onCancel={this.handleCancel} />
                }

                {this.state.category === "clipboard" &&
                    <LibraryClipboard onSelect={this.handleSelect} onCancel={this.handleCancel} />
                }
            </>
        );
    }
}

Library.propTypes = {
    // Redux state

    /**
     * The list of readings in progress.
     */
    readings: PropTypes.array.isRequired,
    /**
     * The action to update the progress of an existing reading.
     */
    updateReading: PropTypes.func.isRequired,

    // Callbacks

    /**
     * Called when the user has selected a content to read.
     *
     * @return {function} A callback accepting the content as first argument.
     */
    onSelect: PropTypes.func,
    /**
     * Called when the user exits the library without selected a new content.
     */
    onClose: PropTypes.func,
};

Library.defaultProps = {
    onSelect: function() {},
    onClose: function() {},
};

const mapStateToProps = state => {
    return {
        readings: state.readings,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateReading: reading => dispatch(updateReading(reading)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Library);

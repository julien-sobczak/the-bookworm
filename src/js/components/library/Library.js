import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import LibraryBooks from './LibraryBooks';
import LibraryWebsite from './LibraryWebsite';
import LibraryClipboard from './LibraryClipboard';

import { LibraryScreen } from './UI';
import { StyledTable } from '../core/UI';
import Progress from '../toolbox/Progress';
import LargeButton from "../toolbox/LargeButton";
import ButtonUpload from "./LargeButtonUpload";

import Button from '@material-ui/core/Button';

import { updateReading } from '../../store/actions';

import * as string from '../../functions/string';
import LargeButtonGroup from '../toolbox/LargeButtonGroup';

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
        this.handleReadingSelected = this.handleReadingSelected.bind(this);
    }

    handleBookSelection() {
        this.setState(state => ({
            ...state,
            category: "book",
        }));
    }

    handleWebsiteSelection() {
        this.setState(state => ({
            ...state,
            category: "website",
        }));
    }

    handleClipboardSelection() {
        this.setState(state => ({
            ...state,
            category: "clipboard",
        }));
    }

    handleReadingSelected(event) {
        const reading = this.props.readings[event.target.dataset.index];
        this.props.updateReading(reading);
    }

    handleCancel() {
        this.setState(state => ({
            ...state,
            category: undefined,
        }));
    }

    handleSelection(selection) {
        this.props.onSelect(selection);
    }

    render() {
        return (
            <>
                {!this.state.category && <LibraryScreen className="LibraryWelcome" onClose={this.props.onClose}>
                    <h3>What you want to read?</h3>

                    {this.props.readings &&
                        <>
                            <div>
                                <StyledTable>
                                    <tbody>
                                        {this.props.readings.map((reading, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td><em>{reading.description.title}</em></td>
                                                    <td><small>{reading.description.author}</small></td>
                                                    <td><small>{string.humanReadableDate(reading.lastDate)}</small></td>
                                                    <td><Progress value={reading.position.progress} showText /></td>
                                                    <td><Button variant="contained" disableElevation onClick={this.handleReadingSelected} data-index={index} className="Clickable">Read</Button></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </StyledTable>
                            </div>
                        </>
                    }

                    <LargeButtonGroup>
                        <LargeButton text="A book" colorText="white" colorBackground="#111" onClick={this.handleBookSelection} />
                        <LargeButton text="A Copy-Paste text" colorText="white" colorBackground="#111" onClick={this.handleClipboardSelection} />
                        <ButtonUpload text="An Upload" colorText="white" colorBackground="#111" onClick={this.handleSelection} />
                        {/*
                            * Disabled because it requires to find a real solution to execute CORS requests
                            * Ex: https://github.com/Rob--W/cors-anywhere
                            <LargeButton text="A website" colorText="white" colorBackground="#111" onClick={this.handleWebsiteSelection} />
                        */}
                    </LargeButtonGroup>
                </LibraryScreen>}

                {this.state.category === "book" &&
                    <LibraryBooks onSelect={this.handleSelection} onCancel={this.handleCancel} />
                }

                {this.state.category === "website" &&
                    <LibraryWebsite onSelect={this.handleSelection} onCancel={this.handleCancel} />
                }

                {this.state.category === "clipboard" &&
                    <LibraryClipboard onSelect={this.handleSelection} onCancel={this.handleCancel} />
                }
            </>
        );
    }
}

Library.propTypes = {
    // Redux state
    readings: PropTypes.array.isRequired,
    updateReading: PropTypes.func.isRequired,
    // Callbacks
    onSelect: PropTypes.func,
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

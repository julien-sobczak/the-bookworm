import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import LibraryBooks from './LibraryBooks';
import LibraryWebsite from './LibraryWebsite';
import LibraryClipboard from './LibraryClipboard';

import Progress from '../toolbox/Progress';
import Button from "../toolbox/Button";
import ButtonUpload from "./ButtonUpload";

import ReactButton from '@material/react-button';
import '@material/react-button/dist/button.css';

import { updateReading } from '../../store/actions';
import { humanReadableDate } from '../../functions/string';


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

    handleReadingSelected(event) {
        const reading = this.props.readings[event.target.dataset.index];
        this.props.updateReading(reading);
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
                                <div className="Readings">
                                    <table className="Styled">
                                        <tbody>
                                            {this.props.readings.map((reading, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td><em>{reading.description.title}</em></td>
                                                        <td><small>{reading.description.author}</small></td>
                                                        <td><small>{humanReadableDate(reading.lastDate)}</small></td>
                                                        <td><Progress value={reading.position.progress} showText={true} /></td>
                                                        <td><ReactButton onClick={this.handleReadingSelected} data-index={index} className="Clickable">Read</ReactButton></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        }

                        <section className="LibraryCategories">
                            <div className="LibraryCategory">
                                <Button text="A book" colorText="white" colorBackground="#111" onClick={this.handleBookSelection} />
                            </div>

                            {/*
                              * Disabled because it requires to find a real solution to execute CORS requests
                              * Ex: https://github.com/Rob--W/cors-anywhere
                            <div className="LibraryCategory">
                                <Button text="A website" colorText="white" colorBackground="#111" onClick={this.handleWebsiteSelection} />
                            </div>
                            */}

                            <div className="LibraryCategory">
                                <Button text="A Copy-Paste text" colorText="white" colorBackground="#111" onClick={this.handleClipboardSelection} />
                            </div>

                            <div className="LibraryCategory">
                                <ButtonUpload text="An Upload" colorText="white" colorBackground="#111" onClick={this.handleSelection} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Library);
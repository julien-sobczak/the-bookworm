import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import HelpIcon from '@material-ui/icons/HelpOutlined';
import HomeIcon from '@material-ui/icons/Home';
import ExportIcon from '@material-ui/icons/Archive';
import ImportIcon from '@material-ui/icons/Unarchive';

import { ContentContext } from "../../../content-context";
import { restoreBackup, registerBackup } from '../../store/actions';

import * as information from '../../functions/information';
import * as storage from '../../functions/storage';
import * as string from '../../functions/string';

import BarWpm from "../toolbox/BarWpm";
import ErrorSnackbar from "../toolbox/ErrorSnackbar";

const messageToday = information.getMessageOfTheDay();

function Profile(props) {

    const Container = styled.div`
    `;

    const maxFileSizeInMb = 11;
    const maxFileSizeInBytes = 1024 * 1024 * maxFileSizeInMb;

    const inputRef = useRef(null);

    const [errorMessage, setErrorMessage] = useState("");

    const backupFilename = () => {
        const today = new Date();
        const yyyy = today.getUTCFullYear();
        const MM = ("" + today.getUTCMonth()).padStart(2, '0');
        const dd = ("" + today.getUTCDate()).padStart(2, '0');
        const hh = ("" + today.getUTCHours()).padStart(2, '0');
        const mm = ("" + today.getUTCMinutes()).padStart(2, '0');
        return `backup-${yyyy}${MM}${dd}-${hh}${mm}.json`;
    };

    const createBackup = () => {
        const element = document.createElement("a");
        const backup = storage.createBackup(props.reduxState);
        const file = new Blob([JSON.stringify(backup)], {type: 'application/json'});
        element.href = URL.createObjectURL(file);
        element.download = backupFilename();
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();

        props.registerBackup({
            date: backup.date,
        });
    };

    const handleBackupSelected = () => {
        const file = inputRef.current.files[0];

        if (file) return;

        // Protection against invalid files
        if (file.type !== "application/json") { // Should not happen as enforce by input[file] component
            setErrorMessage("Sorry. Only JSON files are supported.");
            return;
        }
        if (file.size > maxFileSizeInBytes) {
            setErrorMessage('Sorry. Your backup file seems too large.');
            return;
        }

        // Read the file content
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const backup = JSON.parse(event.target.result);
            const state = storage.restoreBackup(backup);
            props.restoreBackup(state);
        };
        fileReader.readAsText(file);
    };

    const goToProjectHomePage = () => {
        document.location = "https://julien-sobczak.github.io/the-bookworm/"; // TODO put in env
    };

    const readAtLeastOneContent = (props.stats.books + props.stats.pastes + props.stats.epubs) > 0;
    const startUsingAppToday = new Date().toDateString() === new Date(props.startDate).toDateString();
    const newUser = !readAtLeastOneContent && startUsingAppToday;

    return (
        <>
            <ErrorSnackbar message={errorMessage} onClose={() => setErrorMessage("")} />
            <Container className="Profile">
                <div className="ProfileHi Centered">
                    <span>Hi,</span>
                    <Tooltip title="Homepage"><Button onClick={goToProjectHomePage}><HomeIcon size="large" /></Button></Tooltip>
                    <Tooltip title="Read the tutorial"><Button component={Link} to="/tutorial"><HelpIcon size="large" />&nbsp;Tutorial</Button></Tooltip>
                </div>
                <div className="ProfileStats Centered">
                    {!newUser && <p>
                        <span>You have read <em>{props.stats.books} book(s)</em>, <em>{props.stats.pastes} custom text(s)</em>, <em>{props.stats.epubs} ePub(s)</em> in <em>{string.humanReadableLongDuration(props.stats.readingTime)}</em>.</span>
                    </p>}
                    {newUser && <p>
                        <span><em>Welcome!</em></span><br/>
                        <span>The Bookworm is a web application to practice speed reading techniques like peripheral vision and chunking.</span><br/>
                        <Link to="/tutorial">Try the tutorial.</Link>
                    </p>}
                </div>
                <div className="ProfileWpm">
                    <BarWpm wpm={props.stats.wpm} />
                </div>
                <div className={"ProfileMessage Profile" + string.capitalize(messageToday.type) + " Centered"}>
                    <p>
                        <q><span className="LargeQuote">&ldquo;</span>{messageToday.text}</q>
                        {messageToday.author && <span>– {messageToday.author}</span>}
                    </p>
                </div>
                <div className="ProfileCurrentReading Centered">
                    <ContentContext.Consumer>
                        {({content, }) => (
                            <>
                                {!content.type && <span>No reading in progress.</span>}
                                {content.type && <span>You are reading <em>{content.description.title}</em> by <em>{content.description.author}</em> </span>}
                            </>
                        )}
                    </ContentContext.Consumer>
                </div>
                <div className="ProfileBackup Centered">
                    <p>
                        {props.lastBackup && <span>Last backup {string.humanReadableDate(props.lastBackup)}</span>}
                        {!props.lastBackup && <span>No previous backup</span>}
                    </p>
                    <p>
                        <Tooltip title="Export"><Button onClick={createBackup}><ExportIcon /></Button></Tooltip>
                        <Tooltip title="Import"><Button onClick={() => inputRef.current.click()}><ImportIcon /></Button></Tooltip>
                        <input type="file" ref={inputRef} onChange={handleBackupSelected} style={{ display: "none" }} accept="application/json" />
                    </p>
                </div>
            </Container>
        </>
    );
}

Profile.propTypes = {
    // Redux State
    reduxState: PropTypes.object.isRequired,
    readings: PropTypes.array.isRequired,
    stats: PropTypes.object.isRequired,
    lastBackup: PropTypes.string, // See Date.toDateString()
    startDate: PropTypes.string.isRequired, // See Date.toDateString()
    registerBackup: PropTypes.func.isRequired,
    restoreBackup: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        reduxState: state,
        readings: state.readings,
        stats: state.stats,
        lastBackup: state.lastBackup,
        startDate: state.startDate,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        registerBackup: backupMetadata => dispatch(registerBackup(backupMetadata)),
        restoreBackup: backup => dispatch(restoreBackup(backup)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

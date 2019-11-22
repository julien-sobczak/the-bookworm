import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { ContentContext } from "../../../content-context";
import { restoreBackup, registerBackup } from '../../store/actions';

import * as information from '../../functions/information';
import * as storage from '../../functions/storage';
import * as string from '../../functions/string';

import PanelError from "../toolbox/PanelError";
import BarWpm from "../toolbox/BarWpm";

const messageToday = information.getMessageOfTheDay();

function Profile(props) {

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

    const handleBackupSelected = (event) => {
        const file = inputRef.current.files[0];

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

    const goToHomePage = (event) => {
        document.location.pathname = "/";
    };

    const readAtLeastOneContent = (props.stats.books + props.stats.pastes + props.stats.epubs) > 0;
    const startUsingAppToday = new Date().toDateString() === new Date(props.startDate).toDateString();
    const newUser = !readAtLeastOneContent && startUsingAppToday;

    return (
        <>
            {errorMessage.length > 0 && <PanelError message={errorMessage} onClear={() => setErrorMessage("")}/>}
            <div className="Profile">
                <div className="ProfileHi Centered">
                    <span>Hi,</span>
                    <button onClick={goToHomePage} title="Home Page"><i className="material-icons md-36">home</i></button>
                </div>
                <div className="ProfileStats Centered">
                    {!newUser && <p>
                        <span>You have read <em>{props.stats.books} book(s)</em>, <em>{props.stats.pastes} custom text(s)</em>, <em>{props.stats.epubs} ePub(s)</em> in <em>{string.humanReadableLongDuration(props.stats.readingTime)}</em>.</span>
                    </p>}
                    {newUser && <p>
                        <span><em>Welcome!</em></span><br/>
                        <span>The Bookworm is an online application to practice speed reading techniques like peripheral vision and chunking.</span><br/>
                        <Link to="/chunking/tutorial">Try the tutorial.</Link>
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
                        {({content, update, toggle}) => (
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
                        <button onClick={createBackup} title="Export"><i className="material-icons md-36">archive</i></button>
                        <button onClick={() => inputRef.current.click()} title="Import"><i className="material-icons md-36">unarchive</i></button>
                        <input type="file" ref={inputRef} onChange={handleBackupSelected} style={{display: "none"}} accept="application/json" />
                    </p>
                </div>
            </div>
        </>
    );
}

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
import React, { useRef, useState } from "react";
import { connect } from "react-redux";

import { ContentContext } from "../../../content-context";
import { restoreBackup, registerBackup } from '../../store/actions';

import * as string from '../../functions/string';

import PanelError from "../toolbox/PanelError";

function Welcome(props) { 

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
        return `backup-${yyyy}${MM}${dd}-${hh}${mm}.json`
    }

    const createBackup = () => {
        const element = document.createElement("a");
        const backup = {
            state: props.reduxState,
        };
        const file = new Blob([JSON.stringify(backup)], {type: 'application/json'});
        element.href = URL.createObjectURL(file);
        element.download = backupFilename();
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();

        props.registerBackup({
            date: new Date(),
        })
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
            // TODO copy reading content in localStorage
            //props.restoreBackup(backup.state);
            console.log('Restored backup', backup.state);
        };
        fileReader.readAsText(file);
    };


    return (
        <div className="Welcome">
            
            {errorMessage.length > 0 && <PanelError message={errorMessage} onClear={() => setErrorMessage("")}/>}
            
            <h3>Welcome</h3>

            <ul>
                <li>{props.stats.books} books, {props.stats.pastes} texts, {props.stats.epubs} ePubs in {string.humanReadableDuration(props.stats.readingTime)}</li>
                <li>You are currently reading at {props.stats.wpm} WPM</li>
            </ul>

            <ContentContext.Consumer>
                {({content, update, toggle}) => (
                    <>
                        {!content.type && <span>No reading in progress.</span>}
                        {content.type && <span>You are reading <em>{content.description.title}</em> by <em>{content.description.author}</em></span>}
                    </>
                )}
            </ContentContext.Consumer>

            <div>
                {props.lastBackup && <span>Last backup {string.humanReadableDate(props.lastBackup)}</span>}
                {!props.lastBackup && <span>No previous backup</span>}
                <button onClick={createBackup}><i className="material-icons">archive</i></button>
                <button onClick={() => inputRef.current.click()}><i className="material-icons">unarchive</i></button>
                <input type="file" ref={inputRef} onChange={handleBackupSelected} style={{display: "none"}} accept="application/json" />
            </div>

        </div>
    );
}

const mapStateToProps = state => {
    return {
        reduxState: state,
        readings: state.readings,
        stats: state.stats,
        lastBackup: state.lastBackup, 
    };
};

const mapDispatchToProps = dispatch => {
    return {
        registerBackup: backupMetadata => dispatch(registerBackup(backupMetadata)),
        restoreBackup: backup => dispatch(restoreBackup(backup)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
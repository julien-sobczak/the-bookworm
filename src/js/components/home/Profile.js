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

function Quote({ text, author }) {
    const QuotationMark = () => {
        const Mark = styled.span`
            font-size: 3em;
        `;
        return <Mark>&ldquo;</Mark>;
    };
    const Quotation = styled.q`
        display: block;
        margin: 0.25cm;
    `;
    return (
        <p>
            <Quotation><QuotationMark />{text}</Quotation>
            {author && <span>– {author}</span>}
        </p>
    );
}
Quote.propTypes = {
    text: PropTypes.string.isRequired,
    author: PropTypes.string,
};

function Profile(props) {

    const Container = styled.div`
        width: 100%;
        height: 100%;
        min-height: 90vh;
        padding: var(--wide-margin);
        display: grid;
        grid-template-columns: auto auto auto 3.5cm;
        grid-template-rows: auto auto auto;
        grid-template-areas:
            "hi stats stats wpm"
            "quote quote quote wpm"
            "reading reading backup wpm";
        grid-column-gap: calc(var(--wide-margin) / 2);
        grid-row-gap: calc(var(--wide-margin) / 2);

        --default-padding: 2em;

        @media only screen and (orientation: portrait) {
            grid-template-columns: 6cm auto 3.5cm;
            grid-template-rows: auto auto auto auto;
            grid-template-areas:
                "hi backup wpm"
                "stats stats wpm"
                "quote quote wpm"
                "reading reading wpm";
            padding-bottom: calc(var(--menu-size) + var(--wide-margin));
        }


        /* General */

        button {
            color: white;
            min-width: auto;
        }

        em {
            display: inline;
            font-weight: 700;
            font-size: 1.2em;
        }
        p {
            margin: 0.3cm 0;
            line-height: 2em;
            text-align: center;
        }

        a {
            color: white !important;
            background-color: black;
            padding: 0.2em;
            text-decoration: none;
        }

        /* Cells */

        /* Center content in every cell */
        > * {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    `;

    const Hi = styled.div`
        grid-area: hi;
        background-color: rgba(0, 0, 0, 1);
        color: white;
        font-size: 2em;
        font-weight: 900;
        padding: var(--default-padding);
    `;

    const Stats = styled.div`
        grid-area: stats;
        background: repeating-linear-gradient(
            -45deg,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0) 10px,
            rgba(0, 0, 0, 0.3) 10px,
            rgba(0, 0, 0, 0.3) 20px
        );
        color: white;
        font-size: 1.5em;
        padding: var(--default-padding);

        span {
            background-color: var(--theme-color);
            padding: 0.2em;
        }
    `;

    const Wpm = styled.div`
        grid-area: wpm;
        position: relative;
        margin-left: 0.5cm;
    `;

    const Message = styled.div`
        grid-area: quote;
        border: 0.2cm solid black;
        background-color: rgba(0, 0, 0, 0);
        position: relative;
        text-align: center;
        font-weight: 700;
        font-family: 'Roboto Slab', cursive;
        font-size: 1.5em;

        &::after {
            position: absolute;
            top: -0.3cm;
            left: calc(50% - 3cm);
            width: 6cm;
            background-color: var(--theme-color);
            z-index: 2;
            padding: 0 0.5cm;
            font-family: 'Fredoka One', cursive;
            font-size: 0.5cm;
            text-align: center;
            content: ${messageToday.type === 'quote' ? 'Quote of the day' : 'Tip of the day'};
        }
    `;

    const CurrentReading = styled.div`
        grid-area: reading;
        background-color: rgba(0, 0, 0, 0.2);
        color: white;
        font-size: 1.4em;
        padding: var(--default-padding);
    `;

    const Backup = styled.div`
        grid-area: backup;
        background-color: rgba(0, 0, 0, 1);
        color: white;
        padding: var(--default-padding);
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
            <Container>
                <Hi>
                    <span>Hi,</span>
                    <Tooltip title="Homepage"><Button onClick={goToProjectHomePage}><HomeIcon size="large" /></Button></Tooltip>
                    <Tooltip title="Read the tutorial"><Button component={Link} to="/tutorial"><HelpIcon size="large" />&nbsp;Tutorial</Button></Tooltip>
                </Hi>
                <Stats>
                    {!newUser && <p>
                        <span>You have read <em>{props.stats.books} book(s)</em>, <em>{props.stats.pastes} custom text(s)</em>, <em>{props.stats.epubs} ePub(s)</em> in <em>{string.humanReadableLongDuration(props.stats.readingTime)}</em>.</span>
                    </p>}
                    {newUser && <p>
                        <span><em>Welcome!</em></span><br/>
                        <span>The Bookworm is a web application to practice speed reading techniques like peripheral vision and chunking.</span><br/>
                        <Link to="/tutorial">Try the tutorial.</Link>
                    </p>}
                </Stats>
                <Wpm>
                    <BarWpm wpm={props.stats.wpm} />
                </Wpm>
                <Message>
                    <Quote text={messageToday.text} author={messageToday.author} />
                </Message>
                <CurrentReading>
                    <ContentContext.Consumer>
                        {({content, }) => (
                            <>
                                {!content.type && <span>No reading in progress.</span>}
                                {content.type && <span>You are reading <em>{content.description.title}</em> by <em>{content.description.author}</em> </span>}
                            </>
                        )}
                    </ContentContext.Consumer>
                </CurrentReading>
                <Backup>
                    <p>
                        {props.lastBackup && <span>Last backup {string.humanReadableDate(props.lastBackup)}</span>}
                        {!props.lastBackup && <span>No previous backup</span>}
                    </p>
                    <p>
                        <Tooltip title="Export"><Button onClick={createBackup}><ExportIcon /></Button></Tooltip>
                        <Tooltip title="Import"><Button onClick={() => inputRef.current.click()}><ImportIcon /></Button></Tooltip>
                        <input type="file" ref={inputRef} onChange={handleBackupSelected} style={{ display: "none" }} accept="application/json" />
                    </p>
                </Backup>
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

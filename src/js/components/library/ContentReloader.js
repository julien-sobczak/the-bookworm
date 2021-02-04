import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ErrorSnackbar from "../toolbox/ErrorSnackbar";
import Loader from "../toolbox/Loader.js";
import Screen from "../core/Screen.js";
import LargeButtonGroup from '../toolbox/LargeButtonGroup.js';
import LargeButton from "../toolbox/LargeButton.js";
import LargeButtonUpload from "./LargeButtonUpload";
import Text from "../toolbox/Text.js";

import * as storage from '../../functions/storage';
import * as library from '../../functions/library';

import { ContentContext } from "../../../content-context";

function ContentReloader({ readings, children }) {

    const { content, update, discard } = useContext(ContentContext);

    const [ loading, setLoading ] = useState(false);
    const [ loaded, setLoaded ] = useState(readings.length === 0 || library.valid(content));
    const [ uploadRequired, setUploadRequired ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const Message = styled.p`
        font-weight: bold;
        line-height: 3em;
        text-align: center;

        em {
            font-style: italic;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 0.5em;
            padding: 0.5em;
            color: white;
        }
    `;

    console.log('render');

    useEffect(() => {
        let ignore = false;

        if (loading || loaded) return;
        if (!loading && readings.length > 0 && !library.valid(content)) {
            // Try to reload
            const currentReading = readings[0];
            if (ignore) return;

            setLoading(true);

            storage.reloadContent(currentReading).then(content => {
                console.log('Content is now', content);
                if (ignore) return;
                setLoading(false);
                setLoaded(true);
                update(content);
            }).catch(e => {
                console.log('Error when reloading content', e);
                if (!ignore) setUploadRequired(true);
            });
        }

        return () => { ignore = true; };
    });

    const handleUpload = (content) => {
        const currentReading = readings[0];
        if (content.size != currentReading.size ||
            JSON.stringify(content.description) !== JSON.stringify(currentReading.description)) {
            setErrorMessage("The file does not match.");
            return;
        }
        update(content);
        setUploadRequired(false);
        setLoaded(true);
    };

    const handleDiscard = () => {
        discard();
    };

    return (
        <>
            {/* Report problem with the uploaded file. */}
            <ErrorSnackbar message={errorMessage} onClose={() => setErrorMessage("")} />
            {/* Display a loader during the file upload. */}
            {!loaded && loading && <Loader />}
            {/* Ask user to upload the content again. */}
            {uploadRequired && <Screen colored centered>
                <Message><Text size="large">Your current reading<br/><em>{readings[0].description.title}</em><br/>cannot be found locally.</Text></Message>
                <LargeButtonGroup>
                    <LargeButtonUpload text="Upload" colorText="white" colorBackground="#111" onClick={handleUpload} />
                    <LargeButton text="Discard" colorText="white" colorBackground="#111" onClick={handleDiscard} />
                </LargeButtonGroup>
            </Screen>}
            {/* Display the children if the content is ready */}
            {loaded && <>{children}</>}
        </>
    );
}

ContentReloader.propTypes = {
    readings: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.node,
};

export default ContentReloader;

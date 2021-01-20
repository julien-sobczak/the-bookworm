import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PreviewWebsite from './PreviewWebsite';

import { LibraryScreen } from "./UI";
import LargeButton from "../toolbox/LargeButton";
import LargeButtonGroup from "../toolbox/LargeButtonGroup";

/**
 * Component to select a website to read.
 *
 * Note: This component is currently not supported as most websites blocks
 * Ajax requests coming from cross origins.
 *
 * @param {Object} props The component properties.
 */
function LibraryWebsite({ onSelect, onCancel }) {

    const [url, setUrl] = useState(undefined);
    const [ready, setReady] = useState(false);

    // Large input to enter the URL.
    const Input = styled.input`
        width: 50vw;
        height: 3em;
        border: 1em solid rgba(0, 0, 0, 0.1);
        background-clip: padding-box;
        padding: 1em;
    `;

    return (
        <>
            {ready && <PreviewWebsite url={url} onSelect={(selection) => onSelect(selection) } />}
            {!ready &&<LibraryScreen>
                <h3>Copy your URL</h3>
                <Input type="text" name="url" onChange={(e) => setUrl(e.target.value)} />
                <LargeButtonGroup>
                    <LargeButton text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                    <LargeButton text="Read" colorText="white" colorBackground="#111" onClick={() => setReady(true)} />
                </LargeButtonGroup>
            </LibraryScreen>}
        </>
    );
}

LibraryWebsite.propTypes = {
    /**
     * Called when the user has validated the content to read.
     * The callback received the content in the standard format as the first argument.
     */
    onSelect: PropTypes.func.isRequired,
    /**
     * Called when the user exits the screen without entering a URL.
     */
    onCancel: PropTypes.func.isRequired,
};

export default LibraryWebsite;

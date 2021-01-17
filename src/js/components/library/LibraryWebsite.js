import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PreviewWebsite from './PreviewWebsite';

import { LibraryScreen } from "./UI";
import LargeButton from "../toolbox/LargeButton";
import LargeButtonGroup from "../toolbox/LargeButtonGroup";

function LibraryWebsite({ onSelect, onCancel }) {

    const [url, setUrl] = useState(undefined);
    const [ready, setReady] = useState(false);

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
            {!ready &&<LibraryScreen className="LibraryWebsite">
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
    onSelect: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default LibraryWebsite;

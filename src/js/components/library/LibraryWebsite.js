import React, { useState } from 'react';
import PropTypes from 'prop-types';

import PreviewWebsite from './PreviewWebsite';

import { ScreenLibrary } from "../core/UI";
import LargeButton from "../toolbox/LargeButton";
import LargeButtonGroup from "../toolbox/LargeButtonGroup";

function LibraryWebsite({ onSelect, onCancel }) {

    const [url, setUrl] = useState(undefined);
    const [ready, setReady] = useState(false);

    return (
        <>
            {ready && <PreviewWebsite url={url} onSelect={(selection) => onSelect(selection) } />}
            {!ready &&<ScreenLibrary className="LibraryWebsite">
                <h3>Copy your URL</h3>
                <input type="text" name="url" onChange={(e) => setUrl(e.target.value)} />
                <LargeButtonGroup>
                    <LargeButton text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                    <LargeButton text="Read" colorText="white" colorBackground="#111" onClick={() => setReady(true)} />
                </LargeButtonGroup>
            </ScreenLibrary>}
        </>
    );
}

LibraryWebsite.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default LibraryWebsite;

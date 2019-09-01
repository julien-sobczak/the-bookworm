import React, { useState } from 'react';

import WebsitePreview from './WebsitePreview';

import MainButton from "../toolbox/MainButton";

function LibraryWebsite({ onSelect, onCancel }) {

    const [url, setUrl] = useState(undefined);
    const [ready, setReady] = useState(false);

    return (
        <div className="LibraryWebsite Centered">
            {ready && <WebsitePreview url={url} onSelect={(selection) => onSelect(selection) } />}

            {!ready &&
                <>
                    <h3>Copy your URL</h3>
                    <input type="text" name="url" onChange={(e) => setUrl(e.target.value)} />
                    <div className="Buttons">
                        <MainButton text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                        <MainButton text="Read" colorText="white" colorBackground="#111" onClick={() => setReady(true)} />
                    </div>
                </>
            }
        </div>
    );
}

export default LibraryWebsite;
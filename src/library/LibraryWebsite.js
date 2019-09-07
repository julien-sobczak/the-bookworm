import React, { useState } from 'react';

import PreviewWebsite from './PreviewWebsite';

import Button from "../toolbox/Button";

function LibraryWebsite({ onSelect, onCancel }) {

    const [url, setUrl] = useState(undefined);
    const [ready, setReady] = useState(false);

    return (
        <div className="LibraryWebsite Centered">
            {ready && <PreviewWebsite url={url} onSelect={(selection) => onSelect(selection) } />}

            {!ready &&
                <>
                    <h3>Copy your URL</h3>
                    <input type="text" name="url" onChange={(e) => setUrl(e.target.value)} />
                    <div className="Buttons">
                        <Button text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                        <Button text="Read" colorText="white" colorBackground="#111" onClick={() => setReady(true)} />
                    </div>
                </>
            }
        </div>
    );
}

export default LibraryWebsite;
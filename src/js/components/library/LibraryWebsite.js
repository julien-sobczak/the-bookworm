import React, { useState } from 'react';
import PropTypes from 'prop-types';

import PreviewWebsite from './PreviewWebsite';

import LargeButton from "../toolbox/LargeButton";

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
                        <LargeButton text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                        <LargeButton text="Read" colorText="white" colorBackground="#111" onClick={() => setReady(true)} />
                    </div>
                </>
            }
        </div>
    );
}

LibraryWebsite.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default LibraryWebsite;

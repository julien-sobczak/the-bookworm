import React, { useState } from 'react';

import TextPreview from './TextPreview';

import MainButton from "../toolbox/MainButton";


function LibraryClipboard({ onSelect, onCancel }) {

    const [text, setText] = useState("");
    const [ready, setReady] = useState(false);

    return (
        <div className="LibraryClipboard Centered">
            {ready && <TextPreview text={text} onSelect={(selection) => onSelect(selection) } />}

            {!ready &&
                <>
                    <h3>Copy/Paste your text</h3>
                    <textarea name="clipboard" value={text} onChange={(e) => setText(e.target.value)}>
                    </textarea>
                    <div className="Buttons">
                        <MainButton text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                        <MainButton text="Read" colorText="white" colorBackground="#111" onClick={() => setReady(true)} />
                    </div>
                </>
            }
        </div>
    );
}

export default LibraryClipboard;
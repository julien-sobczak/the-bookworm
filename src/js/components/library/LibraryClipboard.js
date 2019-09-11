import React, { useState } from 'react';

import PreviewText from './PreviewText';

import Button from "../toolbox/Button";


function LibraryClipboard({ onSelect, onCancel }) {

    const [text, setText] = useState("");
    const [ready, setReady] = useState(false);

    return (
        <div className="LibraryClipboard Centered">
            {ready && <PreviewText text={text} onSelect={(selection) => onSelect(selection) } />}

            {!ready &&
                <>
                    <h3>Copy/Paste your text</h3>
                    <textarea name="clipboard" value={text} onChange={(e) => setText(e.target.value)}>
                    </textarea>
                    <div className="Buttons">
                        <Button text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                        <Button text="Read" colorText="white" colorBackground="#111" onClick={() => setReady(true)} />
                    </div>
                </>
            }
        </div>
    );
}

export default LibraryClipboard;
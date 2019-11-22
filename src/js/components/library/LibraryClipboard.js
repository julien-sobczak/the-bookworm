import React, { useState } from 'react';

import * as string from '../../functions/string';
import * as library from '../../functions/library';

import Button from "../toolbox/Button";

function LibraryClipboard({ onSelect, onCancel }) {

    const [text, setText] = useState("");

    const onValidate = () => {
        const id = string.uid();
        onSelect({
            id: `content-paste-${id}`,
            type: "paste",
            description: {
                title: `Paste ${id}`,
                author: "Unknown",
            },
            content: library.parsePaste(text),
            reloadable: false,
            saveOnLocalStorage: true,
        });
    };

    // TODO add field title and author and toggle button to save on localStorage
    return (
        <div className="LibraryClipboard Centered">
            <h3>Copy/Paste your text</h3>
            <textarea name="clipboard" value={text} onChange={(e) => setText(e.target.value)}>
            </textarea>
            <div className="Buttons">
                <Button text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                <Button text="Read" colorText="white" colorBackground="#111" onClick={() => onValidate()} />
            </div>
        </div>
    );
}

export default LibraryClipboard;
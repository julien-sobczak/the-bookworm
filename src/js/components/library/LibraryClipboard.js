import React, { useState } from 'react';
import PropTypes from 'prop-types';

import * as string from '../../functions/string';
import * as library from '../../functions/library';

import { ScreenLibrary } from "../core/UI";
import LargeButton from "../toolbox/LargeButton";
import LargeButtonGroup from "../toolbox/LargeButtonGroup";

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
        <ScreenLibrary className="LibraryClipboard" scrollbar>
            <h3>Copy/Paste your text</h3>
            <textarea name="clipboard" value={text} onChange={(e) => setText(e.target.value)}>
            </textarea>
            <LargeButtonGroup>
                <LargeButton text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                <LargeButton text="Read" colorText="white" colorBackground="#111" onClick={() => onValidate()} />
            </LargeButtonGroup>
        </ScreenLibrary>
    );
}

LibraryClipboard.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default LibraryClipboard;

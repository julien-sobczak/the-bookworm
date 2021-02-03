import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as string from '../../functions/string';
import * as library from '../../functions/library';

import { LibraryScreen } from "./UI";
import LargeButton from "../toolbox/LargeButton";
import LargeButtonGroup from "../toolbox/LargeButtonGroup";

/**
 * Component to paste a free text to read.
 *
 * @param {Object} props The component properties.
 */
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
            size: 0,
            saveOnLocalStorage: true,
        });
    };

    const Textarea = styled.textarea`
        width: 50vw;
        height: 50vh;
        border: 1em solid rgba(0, 0, 0, 0.1);
        background-clip: padding-box;
        padding: 1em;
    `;

    // TODO add field title and author and toggle button to save on localStorage
    return (
        <LibraryScreen className="LibraryClipboard" scrollbar>
            <h3>Copy/Paste your text</h3>
            <Textarea name="clipboard" value={text} onChange={(e) => setText(e.target.value)} />
            <LargeButtonGroup>
                <LargeButton text="Back" colorText="white" colorBackground="#111" onClick={() => onCancel()} />
                <LargeButton text="Read" colorText="white" colorBackground="#111" onClick={() => onValidate()} />
            </LargeButtonGroup>
        </LibraryScreen>
    );
}

LibraryClipboard.propTypes = {
    // Callbacks

    /**
     * Called when the user has validated the content he pasted.
     * The callback received the content in the standard format as the first argument.
     */
    onSelect: PropTypes.func.isRequired,
    /**
     * Called when the user exits the screen without any content pasted.
     */
    onCancel: PropTypes.func.isRequired,
};

export default LibraryClipboard;

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Loader from "../toolbox/Loader.js";
import LargeButton from "../toolbox/LargeButton";
import ErrorSnackbar from "../toolbox/ErrorSnackbar";

import { readEpub } from './EpubReader';

/**
 * Same design as LargeButton but uses an hidden file input
 * to allow the user to upload a file.
 *
 * @param {props} The component properties.
 */
function LargeButtonUpload({ text, colorText, colorBackground, onClick }) {

    // Maximum file size allowed in MB. Epub books rarely exceed a few MB.
    const maxFileSizeInMb = 5;
    // Maximum file size allowed in bytes.
    const maxFileSizeInBytes = 1024 * 1024 * maxFileSizeInMb;

    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileSelected = () => {
        const file = inputRef.current.files[0];

        // Protection against invalid files
        if (file.type !== "application/epub+zip") { // Should not happen as enforce by input[file] component
            setErrorMessage("Only ePub files are supported.");
            return;
        }
        if (file.size > maxFileSizeInBytes) {
            setErrorMessage(`Only files smaller than ${maxFileSizeInMb} Mb are supported.`);
            return;
        }

        setLoading(true);
        readEpub(file).then(content => {
            setLoading(false);
            onClick(content);
        }).catch(err => {
            setLoading(false);
            setErrorMessage(err);
            console.error(`Unable to parse file ${file.name} as ePub`, err);
        });
    };
    return (
        <>
            {/* Use a snackbar to report problem with the uploaded file. */}
            <ErrorSnackbar message={errorMessage} onClose={() => setErrorMessage("")} />
            {/* Hide the real HTML input that is used to upload the file in order to display a LargeButton instead. */}
            <input type="file" ref={inputRef} onChange={handleFileSelected} style={{display: "none"}} accept="application/epub+zip" />
            {/* The visible button that triggers the above input file when clicked. */}
            <LargeButton text={text} colorText={colorText} colorBackground={colorBackground} onClick={() => inputRef.current.click()} />
            {/* Display a loader during the file upload. */}
            {loading && <Loader />}
        </>
    );
}

LargeButtonUpload.propTypes = {
    /**
     * The text of the button.
     */
    text: PropTypes.string.isRequired,
    /**
     * The CSS valid color value for the text.
     */
    colorText: PropTypes.string,
    /**
     * The CSS valid color value for the button background.
     */
    colorBackground: PropTypes.string,
    /**
     * Called when the file has finished been uploaded.
     * The function received the parsed content of the book.
     */
    onClick: PropTypes.func.isRequired,
};

LargeButtonUpload.defaultProps = {
    colorText: 'black',
    colorBackground: 'white',
};

export default LargeButtonUpload;

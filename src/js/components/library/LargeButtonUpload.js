import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Loader from "../toolbox/Loader.js";
import LargeButton from "../toolbox/LargeButton";
import PanelError from "../toolbox/PanelError";

import { readEpub } from './EpubReader';

const LargeButtonUpload = ({ text, colorText, colorBackground, onClick }) => {

    const maxFileSizeInMb = 5;
    const maxFileSizeInBytes = 1024 * 1024 * maxFileSizeInMb;

    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileSelected = () => {
        const file = inputRef.current.files[0];

        // Protection against invalid files
        if (file.type !== "application/epub+zip") { // Should not happen as enforce by input[file] component
            setErrorMessage("Sorry. Only ePub files are supported.");
            return;
        }
        if (file.size > maxFileSizeInBytes) {
            setErrorMessage(`Sorry. Only files smaller than ${maxFileSizeInMb} Mo are supported.`);
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
            {errorMessage.length > 0 && <PanelError message={errorMessage} onClear={() => setErrorMessage("")}/>}
            <input type="file" ref={inputRef} onChange={handleFileSelected} style={{display: "none"}} accept="application/epub+zip" />
            <LargeButton text={text} colorText={colorText} colorBackground={colorBackground} onClick={() => inputRef.current.click()} />
            {loading && <Loader />}
        </>
    );
};

LargeButtonUpload.propTypes = {
    text: PropTypes.string.isRequired, // Free value
    colorText: PropTypes.string,       // CSS valid color value
    colorBackground: PropTypes.string, // CSS valid color value
    onClick: PropTypes.func.isRequired,
};

LargeButtonUpload.defaultProps = {
    colorText: 'black',
    colorBackground: 'white',
};


export default LargeButtonUpload;

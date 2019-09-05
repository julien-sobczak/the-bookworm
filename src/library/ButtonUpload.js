import React, { useRef, useState } from 'react';

import Loader from "../toolbox/Loader.js";
import MainButton from "../toolbox/MainButton";

import { readEpub } from './EpubReader';

const ButtonUpload = ({text, colorText, colorBackground, onClick}) => {

    const inputRef = useRef(null)
    const [loading, setLoading] = useState(false)

    const handleFileSelected = () => {
        const file = inputRef.current.files[0];
        setLoading(true);
        readEpub(file).then(epub => {
            onClick({
                file: epub,
                filetype: 'application/epub+zip'
            });
        }).catch(err => console.log(err)); // FIXME
    }
    return (
        <>
            <input type="file" ref={inputRef} onChange={handleFileSelected} style={{display: "none"}} accept="application/epub+zip" />
            <MainButton text={text} colorText={colorText} colorBackground={colorBackground} onClick={() => inputRef.current.click()} />
            {loading && <Loader />}
        </>
    );
}

export default ButtonUpload;
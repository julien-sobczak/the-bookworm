import React from "react";
import { Link } from "react-router-dom";

import MainButton from "../toolbox/MainButton.js";

function Entry({ name, slug, children }) {
    return (
        <div className="Entry">
            <div className="Preview">
                {children}
            </div>
            <div className="Actions">
                <Link to={slug}>
                    <MainButton text={name} colorText="white" colorBackground="#111" />
                </Link>
            </div>
        </div>
    );
}

function ViewerBook(props) {
    return (
        <div className="Viewer">
            <div className="PageOutline">
                <span className="WordOutline" style={{width: "3em"}}></span><span className="WordOutline" style={{width: "4em"}}></span><span className="WordOutline" style={{width: "2em"}}></span><br/>
                <span className="WordOutline" style={{width: "3em"}}></span><span className="WordOutline" style={{width: "2em"}}></span><span className="WordOutline" style={{width: "4em"}}></span><br/>
                <span className="WordOutline" style={{width: "2em"}}></span><span className="WordOutline" style={{width: "5em"}}></span><span className="WordOutline" style={{width: "2em"}}></span><br/>
                <span className="WordOutline" style={{width: "3em"}}></span><span className="WordOutline" style={{width: "2em"}}></span><span className="WordOutline" style={{width: "4em"}}></span><br/>
                <span className="WordOutline" style={{width: "3em"}}></span><span className="WordOutline" style={{width: "4em"}}></span><span className="WordOutline" style={{width: "2em"}}></span><br/>
                <span className="WordOutline" style={{width: "3em"}}></span><span className="WordOutline" style={{width: "3em"}}></span><span className="WordOutline" style={{width: "2em"}}></span><br/>
            </div>
        </div>
    );
}

function Catalog({match}) {

    return (
        <div className="Catalog">

            <Entry name="Book Viewer" slug="book-viewer" match={match}>
                <ViewerBook />
            </Entry>

        </div>
    );
}

export default Catalog;
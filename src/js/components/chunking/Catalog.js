import React from "react";
import { Link } from "react-router-dom";

import PanelReading from "./PanelReading.js";
import Button from "../toolbox/Button.js";

function DrawingPage(props) {
    return (
        <div className="Drawing Centered">
            <div className="PageOutline">
                <span className="ElementOutline" style={{width: "3em"}}></span><span className="ElementOutline" style={{width: "4em"}}></span><span className="ElementOutline" style={{width: "2em"}}></span><br/>
                <span className="ElementOutline" style={{width: "2em"}}></span><span className="ElementOutline ElementOutlineSelected" style={{width: "5em"}}></span><span className="ElementOutline" style={{width: "2em"}}></span><br/>
                <span className="ElementOutline" style={{width: "3em"}}></span><span className="ElementOutline" style={{width: "2em"}}></span><span className="ElementOutline" style={{width: "4em"}}></span><br/>
                <span className="ElementOutline" style={{width: "3em"}}></span><span className="ElementOutline" style={{width: "3em"}}></span><span className="ElementOutline" style={{width: "2em"}}></span><br/>
            </div>
        </div>
    );
}

function DrawingChunk(props) {
    return (
        <div className="Drawing Centered">
            <span className="ElementOutline ElementOutlineSelected" style={{width: "5em"}}></span>
        </div>
    );
}

function DrawingColumn(props) {
    return (
        <div className="Drawing Centered">
            <div>
                <div className="ColumnOutline">
                    <span className="ElementOutline" style={{width: "3em"}}></span><br/>
                    <span className="ElementOutline" style={{width: "2em"}}></span><br/>
                    <span className="ElementOutline" style={{width: "4em"}}></span><br/>
                </div>
                <div className="ColumnOutline">
                    <span className="ElementOutline" style={{width: "3em"}}></span><br/>
                    <span className="ElementOutline ElementOutlineSelected" style={{width: "4em"}}></span><br/>
                    <span className="ElementOutline" style={{width: "2em"}}></span><br/>
                </div>
                <div className="ColumnOutline">
                    <span className="ElementOutline" style={{width: "1em"}}></span><br/>
                    <span className="ElementOutline" style={{width: "4em"}}></span><br/>
                    <span className="ElementOutline" style={{width: "2em"}}></span><br/>
                </div>
            </div>
        </div>
    );
}

function Entry({ name, slug, children }) {
    return (
        <div className="Entry">
            <div className="Preview">
                {children}
            </div>
            <div className="Actions">
                <Link to={slug}>
                    <Button text={name} colorText="white" colorBackground="#111" />
                </Link>
            </div>
        </div>
    );
}

function Catalog({match}) {

    return (
        <div className="Catalog">

            <PanelReading />

            <Entry name="Page Reader" slug="drill-page" match={match}>
                <DrawingPage />
            </Entry>

            <Entry name="Chunk Reader" slug="drill-chunk" match={match}>
                <DrawingChunk />
            </Entry>

            <Entry name="Column Reader" slug="drill-column" match={match}>
                <DrawingColumn />
            </Entry>

        </div>
    );
}

export default Catalog;
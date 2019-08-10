import React from "react";
import { Link } from "react-router-dom";

import MainButton from "../toolbox/MainButton.js";

function ViewerPage(props) {
    return (
        <div className="Viewer">
            <div className="PageOutline">
                <span className="ChunkOutline" style={{width: "3em"}}></span><span className="ChunkOutline" style={{width: "4em"}}></span><span className="ChunkOutline" style={{width: "2em"}}></span><br/>
                <span className="ChunkOutline" style={{width: "2em"}}></span><span className="ChunkOutline ChunkOutlineSelected" style={{width: "5em"}}></span><span className="ChunkOutline" style={{width: "2em"}}></span><br/>
                <span className="ChunkOutline" style={{width: "3em"}}></span><span className="ChunkOutline" style={{width: "2em"}}></span><span className="ChunkOutline" style={{width: "4em"}}></span><br/>
                <span className="ChunkOutline" style={{width: "3em"}}></span><span className="ChunkOutline" style={{width: "3em"}}></span><span className="ChunkOutline" style={{width: "2em"}}></span><br/>
            </div>
        </div>
    );
}

function ViewerChunk(props) {
    return (
        <div className="Viewer">
            <span className="ChunkOutline ChunkOutlineSelected" style={{width: "5em"}}></span>
        </div>
    );
}

function ViewerColumn(props) {
    return (
        <div className="Viewer">
            <div>
                <div className="ColumnOutline">
                    <span className="ChunkOutline" style={{width: "3em"}}></span><br/>
                    <span className="ChunkOutline" style={{width: "2em"}}></span><br/>
                    <span className="ChunkOutline" style={{width: "4em"}}></span><br/>
                </div>
                <div className="ColumnOutline">
                    <span className="ChunkOutline" style={{width: "3em"}}></span><br/>
                    <span className="ChunkOutline ChunkOutlineSelected" style={{width: "4em"}}></span><br/>
                    <span className="ChunkOutline" style={{width: "2em"}}></span><br/>
                </div>
                <div className="ColumnOutline">
                    <span className="ChunkOutline" style={{width: "1em"}}></span><br/>
                    <span className="ChunkOutline" style={{width: "4em"}}></span><br/>
                    <span className="ChunkOutline" style={{width: "2em"}}></span><br/>
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
                    <MainButton text={name} colorText="white" colorBackground="#111" />
                </Link>
            </div>
        </div>
    );
}

function Catalog({match}) {

    return (
        <div className="Catalog">

            <Entry name="Page Reader" slug="drill-page" match={match}>
                <ViewerPage />
            </Entry>

            <Entry name="Chunk Reader" slug="drill-chunk" match={match}>
                <ViewerChunk />
            </Entry>

            <Entry name="Column Reader" slug="drill-column" match={match}>
                <ViewerColumn />
            </Entry>

        </div>
    );
}

export default Catalog;
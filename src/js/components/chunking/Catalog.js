import React from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import PanelReading from "../library/PanelReading.js";
import Button from "../toolbox/Button.js";
import { ContentContext } from "../../../content-context";

function DrawingPage() {
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

function DrawingChunk() {
    return (
        <div className="Drawing Centered">
            <span className="ElementOutline ElementOutlineSelected" style={{width: "5em"}}></span>
        </div>
    );
}

function DrawingColumn() {
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

function Entry({ name, children, slug }) {
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

Entry.propTypes = {
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    children: PropTypes.element,
};

function Catalog({match}) {

    return (
        <div className="Catalog">

            <ContentContext.Consumer>
                {({content, update, toggle}) => (
                    <PanelReading content={content} onSelect={update} onToggle={toggle} />
                )}
            </ContentContext.Consumer>

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

Catalog.propTypes = {
    match: PropTypes.string.isRequired,
};

export default Catalog;
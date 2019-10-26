import React from "react";
import { Link } from "react-router-dom";

import PanelReading from "../library/PanelReading.js";
import Button from "../toolbox/Button.js";

import { ContentContext } from "../../../content-context";

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

function DrawingFree(props) {
    return (
        <div className="Drawing">
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

function DrawingPacer(props) {
    return (
        <div className="Drawing">
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

function DrawingStopWatch(props) {
    return (
        <div className="Drawing">
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

            <ContentContext.Consumer>
                {({content, update, toggle}) => (
                    <PanelReading content={content} onSelect={update} onToggle={toggle} />
                )}
            </ContentContext.Consumer>

            <Entry name="Free Reading" slug="free" match={match}>
                <DrawingFree />
            </Entry>

            <Entry name="Run the Pacer" slug="pacer" match={match}>
                <DrawingPacer />
            </Entry>

            <Entry name="One-minute" slug="stopwatch" match={match}>
                <DrawingStopWatch />
            </Entry>

        </div>
    );
}

export default Catalog;
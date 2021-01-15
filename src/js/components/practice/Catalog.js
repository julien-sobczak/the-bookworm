import React from "react";
import PropTypes from 'prop-types';

import { Entry, Drawing, PageOutline, WordOutline } from '../core/CatalogUI';
import PanelReading from "../library/PanelReading.js";

import { ContentContext } from "../../../content-context";

function DrawingFree() {
    return (
        <Drawing>
            <PageOutline>
                <WordOutline width="3em" /><WordOutline width="4em" /><WordOutline width="2em" /><br/>
                <WordOutline width="3em" /><WordOutline width="2em" /><WordOutline width="4em" /><br/>
                <WordOutline width="2em" /><WordOutline width="5em" /><WordOutline width="2em" /><br/>
                <WordOutline width="3em" /><WordOutline width="2em" /><WordOutline width="4em" /><br/>
                <WordOutline width="3em" /><WordOutline width="4em" /><WordOutline width="2em" /><br/>
                <WordOutline width="3em" /><WordOutline width="3em" /><WordOutline width="2em" /><br/>
            </PageOutline>
        </Drawing>
    );
}

function DrawingPacer() {
    return (
        <Drawing>
            <PageOutline>
                <WordOutline width="3em" /><WordOutline width="4em" /><WordOutline width="2em" /><br/>
                <WordOutline width="3em" /><WordOutline width="2em" /><WordOutline width="4em" /><br/>
                <WordOutline width="2em" selected /><WordOutline width="5em" /><WordOutline width="2em" /><br/>
                <WordOutline width="3em" /><WordOutline width="2em" /><WordOutline width="4em" /><br/>
                <WordOutline width="3em" /><WordOutline width="4em" /><WordOutline width="2em" selected /><br/>
                <WordOutline width="3em" /><WordOutline width="3em" /><WordOutline width="2em" /><br/>
            </PageOutline>
        </Drawing>
    );
}

function DrawingStopWatch() {
    return (
        <Drawing>
            <PageOutline>
                <WordOutline width="3em" /><WordOutline width="4em" /><WordOutline width="2em" /><br/>
                <WordOutline width="3em" /><WordOutline width="2em" /><WordOutline width="4em" /><br/>
                <WordOutline width="2em" /><WordOutline width="5em" /><WordOutline width="2em" /><br/>
                <WordOutline width="3em" /><WordOutline width="2em" /><WordOutline width="4em" fade /><br/>
                <WordOutline width="3em" fade /><WordOutline width="4em" fade /><WordOutline width="2em" fade /><br/>
                <WordOutline width="3em" fade /><WordOutline width="3em" fade /><WordOutline width="2em" fade /><br/>
            </PageOutline>
        </Drawing>
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

Catalog.propTypes = {
    match: PropTypes.object.isRequired,
};

export default Catalog;

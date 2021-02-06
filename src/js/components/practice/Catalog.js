import React from "react";
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { EntryGroup, Entry, Drawing, PageOutline, WordOutline } from '../core/CatalogUI';
import PanelReading from "../library/PanelReading.js";
import ContentReloader from "../library/ContentReloader.js";
import Text from '../toolbox/Text';

import { ContentContext } from "../../../content-context";

/**
 * Catalog illustration for the drill "Free Reading".
 */
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

/**
 * Catalog illustration for the drill "Run the Pacer".
 */
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

/**
 * Catalog illustration for the drill "One-Minute".
 */
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

/**
 * Catalog for the menu "Practice.
 *
 * @param {Object} props The component properties.
 */
function Catalog({ match }) {
    const readings = useSelector(state => state.readings);
    const Notice = styled.div`
        position: absolute;
        top: 5rem;
        right: 5rem;
    `;
    return (
        <ContentReloader>
            <ContentContext.Consumer>
                {({ contentLoaded, content, update, toggle}) => (
                    <EntryGroup>

                        <PanelReading readings={readings} content={content} onSelect={update} onToggle={toggle} />
                        {!contentLoaded && <Notice><Text manuscript arrow arrowDirection="top" arrowPosition="right" arrowVariant="primary">Select a text to read first!</Text></Notice>}

                        <Entry name="Free Reading" slug="free" match={match} disabled={!contentLoaded}>
                            <DrawingFree />
                        </Entry>

                        <Entry name="Run the Pacer" slug="pacer" match={match} disabled={!contentLoaded}>
                            <DrawingPacer />
                        </Entry>

                        <Entry name="One-minute" slug="stopwatch" match={match} disabled={!contentLoaded}>
                            <DrawingStopWatch />
                        </Entry>

                    </EntryGroup>
                )}
            </ContentContext.Consumer>
        </ContentReloader>
    );
}

Catalog.propTypes = {
    /**
     * The Router match used for routing.
     */
    match: PropTypes.object.isRequired,
};

export default Catalog;

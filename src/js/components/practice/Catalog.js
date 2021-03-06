import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as library from '../../functions/library';

import { EntryGroup, Entry, Drawing, PageOutline, WordOutline } from '../core/CatalogUI';
import PanelReading from "../library/PanelReading.js";
import Text from '../toolbox/Text';

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
    const Notice = styled.div`
        position: absolute;
        top: 5rem;
        right: 5rem;
    `;
    return (
        <ContentContext.Consumer>
            {({content, update, toggle}) => (
                <EntryGroup>

                    <PanelReading content={content} onSelect={update} onToggle={toggle} />
                    {!library.valid(content) && <Notice><Text manuscript arrow arrowDirection="top" arrowPosition="right" arrowVariant="primary">Select a text to read first!</Text></Notice>}

                    <Entry name="Free Reading" slug="free" match={match} disabled={!library.valid(content)}>
                        <DrawingFree />
                    </Entry>

                    <Entry name="Run the Pacer" slug="pacer" match={match} disabled={!library.valid(content)}>
                        <DrawingPacer />
                    </Entry>

                    <Entry name="One-minute" slug="stopwatch" match={match} disabled={!library.valid(content)}>
                        <DrawingStopWatch />
                    </Entry>

                </EntryGroup>
            )}
        </ContentContext.Consumer>
    );
}

Catalog.propTypes = {
    match: PropTypes.object.isRequired,
};

export default Catalog;

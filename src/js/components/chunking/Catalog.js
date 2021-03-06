import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as library from '../../functions/library';

import { EntryGroup, Entry, Drawing, PageOutline, ColumnOutline, ElementOutline } from "../core/CatalogUI";
import PanelReading from "../library/PanelReading.js";
import Text from '../toolbox/Text';

import { ContentContext } from "../../../content-context";

function DrawingPage() {
    return (
        <Drawing>
            <PageOutline>
                <ElementOutline width="3em" /><ElementOutline width="4em" /><ElementOutline width="2em" /><br/>
                <ElementOutline width="2em" /><ElementOutline selected width="5em" /><ElementOutline with="2em" /><br/>
                <ElementOutline width="3em" /><ElementOutline width="2em" /><ElementOutline width="4em" /><br/>
                <ElementOutline width="3em" /><ElementOutline width="3em" /><ElementOutline width="2em" /><br/>
            </PageOutline>
        </Drawing>
    );
}

function DrawingChunk() {
    return (
        <Drawing>
            <ElementOutline selected width="5em" />
        </Drawing>
    );
}

function DrawingColumn() {
    return (
        <Drawing>
            <div>
                <ColumnOutline>
                    <ElementOutline width="3em" /><br/>
                    <ElementOutline width="2em" /><br/>
                    <ElementOutline width="4em" /><br/>
                </ColumnOutline>
                <ColumnOutline>
                    <ElementOutline width="3em" /><br/>
                    <ElementOutline selected width="4em" /><br/>
                    <ElementOutline width="2em" /><br/>
                </ColumnOutline>
                <ColumnOutline>
                    <ElementOutline width="1em" /><br/>
                    <ElementOutline width="4em" /><br/>
                    <ElementOutline width="2em" /><br/>
                </ColumnOutline>
            </div>
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

                    <Entry name="Page Reader" slug="drill-page" match={match} disabled={!library.valid(content)}>
                        <DrawingPage />
                    </Entry>

                    <Entry name="Chunk Reader" slug="drill-chunk" match={match} disabled={!library.valid(content)}>
                        <DrawingChunk />
                    </Entry>

                    <Entry name="Column Reader" slug="drill-column" match={match} disabled={!library.valid(content)}>
                        <DrawingColumn />
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

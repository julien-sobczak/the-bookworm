import React from "react";
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as library from '../../functions/library';

import { EntryGroup, Entry, Drawing, PageOutline, ColumnOutline, ElementOutline } from "../core/CatalogUI";
import PanelReading from "../library/PanelReading.js";
import ContentReloader from "../library/ContentReloader.js";
import Text from '../toolbox/Text';

import { ContentContext } from "../../../content-context";

/**
 * Catalog illustration for the drill page.
 */
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

/**
 * Catalog illustration for the drill chunk.
 */
function DrawingChunk() {
    return (
        <Drawing>
            <ElementOutline selected width="5em" />
        </Drawing>
    );
}

/**
 * Catalog illustration for the drill column.
 */
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

/**
 * Catalog for the menu "Chunking".
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
                {({ content, update, toggle }) => (
                    <EntryGroup>
                        <PanelReading readings={readings} content={content} onSelect={update} onToggle={toggle} />
                        {readings.length === 0 && <Notice><Text manuscript arrow arrowDirection="top" arrowPosition="right" arrowVariant="primary">Select a text to read first!</Text></Notice>}

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

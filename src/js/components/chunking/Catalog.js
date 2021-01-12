import React from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import styled from 'styled-components';

import PanelReading from "../library/PanelReading.js";
import LargeButton from "../toolbox/LargeButton.js";
import Text from '../toolbox/Text';
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

function Entry({ name, disabled, children, slug }) {
    return (
        <div className="Entry">
            <div className="Preview">
                {children}
            </div>
            <div className="Actions">
                <Link to={slug}>
                    <LargeButton disabled={disabled} text={name} colorText="white" colorBackground="#111" />
                </Link>
            </div>
        </div>
    );
}

Entry.propTypes = {
    name: PropTypes.string.isRequired, // Free value
    slug: PropTypes.string.isRequired, // Free value
    disabled: PropTypes.bool.isRequired,
    children: PropTypes.any,
};

function Catalog({match}) {
    const Notice = styled.div`
        position: absolute;
        top: 5rem;
        right: 5rem;
    `;
    return (
        <ContentContext.Consumer>
            {({content, update, toggle}) => (
                <div className="Catalog">
                    <PanelReading content={content} onSelect={update} onToggle={toggle} />
                    {content.id == undefined && <Notice><Text manuscript arrow arrowDirection="top" arrowPosition="right" arrowVariant="primary">Select a text to read first!</Text></Notice>}
                    <Entry name="Page Reader" slug="drill-page" match={match} disabled={content.id == undefined}>
                        <DrawingPage />
                    </Entry>

                    <Entry name="Chunk Reader" slug="drill-chunk" match={match} disabled={content.id == undefined}>
                        <DrawingChunk />
                    </Entry>

                    <Entry name="Column Reader" slug="drill-column" match={match} disabled={content.id == undefined}>
                        <DrawingColumn />
                    </Entry>
                </div>
            )}
        </ContentContext.Consumer>
    );
}

Catalog.propTypes = {
    match: PropTypes.object.isRequired,
};

export default Catalog;

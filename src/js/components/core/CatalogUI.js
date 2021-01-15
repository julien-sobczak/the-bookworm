import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import styled from 'styled-components';

import LargeButton from '../toolbox/LargeButton';

/* Drill Illustrations Components used in catalogs. */

/* Outer container */

export const Drawing = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

/* Inner containers */

export const PageOutline = styled.div`
    text-align: left;
`;

export const DrillOutline = styled.div`
    text-align: center;
`;

export const ColumnOutline = styled.div`
    display: inline-block;
    text-align: center;
    margin-right: 0.6em;
    margin-left: 0.6em;
`;

export const GridOutline = styled.div`
    text-align: center;
`;

/* Leaf elements */

export const ElementOutline = ({ width, selected }) => {
    const Leaf = styled.span`
        display: inline-block;
        height: 1.5em;
        border-radius: 50px;
        margin: 0.2em;
        width: ${width};
        background: ${selected ? 'black !important' : 'rgba(255, 255, 255, 0.6)'};
    `;
    return <Leaf />;
};
ElementOutline.propTypes = {
    width: PropTypes.string,
    selected: PropTypes.bool,
};
ElementOutline.defaultProps = {
    width: "1rem",
    selected: false,
};

export const WordOutline = ({ width, selected, fade }) => {
    const Leaf = styled.span`
        display: inline-block;
        height: 0.6em;
        margin: 0.2em;
        width: ${width};
        background: ${selected ? 'black' : 'rgba(200, 200, 200, 0.9)'};
        opacity: ${fade ? '0.6' : '1'};
    `;
    return <Leaf />;
};
WordOutline.propTypes = {
    width: PropTypes.string,
    selected: PropTypes.bool,
    fade: PropTypes.bool,
};
WordOutline.defaultProps = {
    width: "1rem",
    selected: false,
    fade: false,
};

export const LetterOutline = ({ selected, style }) => {
    const Leaf = styled.span`
        height: 2em;
        width: 2em;
        display: inline-block;
        border-radius: 50px;
        margin: 0.2em;
        background: ${selected ? 'black !important' : 'rgba(255, 255, 255, 0.6)'};
    `;
    return <Leaf style={style} />;
};
LetterOutline.propTypes = {
    selected: PropTypes.bool,
    style: PropTypes.object,
};
LetterOutline.defaultProps = {
    selected: false,
    style: {},
};

export const CellOutline = ({ selected }) => {
    const Leaf = styled.span`
        display: inline-block;
        width: 2.5em;
        height: 2.5em;
        margin: 0.3em;
        background: ${selected ? 'black !important' : 'rgba(255, 255, 255, 0.6)'};
    `;
    return <Leaf />;
};
CellOutline.propTypes = {
    selected: PropTypes.bool,
};
CellOutline.defaultProps = {
    selected: false,
};


export function Entry({ name, disabled, children, slug }) {

    const Container = styled.div`
        width: var(--catalog-preview-width);
        height: calc(var(--catalog-preview-height) + 100px);
        position: relative;
        margin: 2em;
        pointer-events: none;

        &:hover .Preview {
            opacity: 1;
        }
        &:hover {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 2em;
        }

        --catalog-preview-width: 275px;
        --catalog-preview-height: 175px;
    `;

    const Preview = styled.div`
        width: var(--catalog-preview-width);
        height: var(--catalog-preview-height);
        transform-origin: 0% 0%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0.5;
    `;
    const Action = styled.div`
        position: absolute;
        bottom: 0;
        height: 100px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
    `;

    return (
        <Container>
            <Preview>
                {children}
            </Preview>
            <Action>
                <Link to={slug}>
                    <LargeButton disabled={disabled} text={name} colorText="white" colorBackground="#111" />
                </Link>
            </Action>
        </Container>
    );
}
Entry.propTypes = {
    name: PropTypes.string.isRequired, // Free value
    slug: PropTypes.string.isRequired, // Free value
    disabled: PropTypes.bool,
    children: PropTypes.any,
};
Entry.defaultProps = {
    disabled: false,
};

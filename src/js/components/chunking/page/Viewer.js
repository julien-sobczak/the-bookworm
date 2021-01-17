import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

import Pager from '../Pager';
import Paper from '../../core/Paper';
import PageContent from '../../core/PageContent';
import Styled from '../../core/Styled';

import * as string from '../../../functions/string';

const defaultViewerSettings = {
    ...Pager.defaultProps,
    blockPosition: 0,
    chunkPosition: 0,
    disableVisualRegression: false,
    disableVisualProgression: false,
    disableVisualProblemStyle: "fade", // Can be `transparent`, `fade`, or `blur`
    wpm: 250,
    pageTurningDuration: 300,
};

function Viewer(props) {

    const classNames = [];
    if (props.disableVisualRegression) {
        classNames.push('DisableVisualRegression');
    }
    if (props.disableVisualProgression) {
        classNames.push('DisableVisualProgression');
    }
    classNames.push('DisableVisualProblemStyle' + string.capitalize(props.disableVisualProblemStyle));

    const Viewer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        height: 100%;
        --drill-fade-color: #eee;

        &.DisableVisualRegression.DisableVisualProblemStyleTransparent .Chunk.Before { opacity: 0; }
        &.DisableVisualRegression.DisableVisualProblemStyleFade        .Chunk.Before { color: var(--drill-fade-color); background-color: var(--drill-fade-color); }
        &.DisableVisualRegression.DisableVisualProblemStyleBlur        .Chunk.Before { filter: blur(0.1em); opacity: 0.5; }

        &.DisableVisualProgression.DisableVisualProblemStyleTransparent .Chunk.After { opacity: 0; }
        &.DisableVisualProgression.DisableVisualProblemStyleFade        .Chunk.After { color: var(--drill-fade-color); background-color: var(--drill-fade-color); }
        &.DisableVisualProgression.DisableVisualProblemStyleBlur        .Chunk.After { filter: blur(0.1em); opacity: 0.5; }
    `;

    return (
        <Viewer className={classnames(...classNames)}>
            <Paper {...props}>
                <PageContent
                    page={props.page}
                    blockPosition={props.blockPosition}
                    chunkPosition={props.chunkPosition} />
            </Paper>
        </Viewer>
    );

}

Viewer.propTypes = {
    ...Styled.propTypes,
    ...Pager.propTypes,

    // The page content to display
    page: PropTypes.object,

    // The block index containing the chunk to highlight
    blockPosition: PropTypes.number,

    // The chunk index inside the block to highlight
    chunkPosition: PropTypes.number,

    // Hide/Show the text in front of the current chunk
    disableVisualRegression: PropTypes.bool,

    // Hide/Show the text behind the current chunk
    disableVisualProgression: PropTypes.bool,

    // How the hidden text controlled by `disableVisualRegression`
    // and `disableVisualProgression` should be displayed
    disableVisualProblemStyle: PropTypes.oneOf(["transparent", "fade", "blur"]),

    // WPM
    wpm: PropTypes.number,

    // Pause between two pages
    pageTurningDuration: PropTypes.number, // ms
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...Pager.defaultProps,
    ...defaultViewerSettings,
};

export { Viewer as default, defaultViewerSettings };

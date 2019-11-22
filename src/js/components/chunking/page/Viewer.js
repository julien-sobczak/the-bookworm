import React from 'react';
import PropTypes from 'prop-types';

import Pager from '../Pager';
import Paper from '../../toolbox/Paper';
import PageContent from '../../toolbox/PageContent';
import Styled from '../../toolbox/Styled';

import * as string from '../../../functions/string';

const defaultDrillSettings = {
    ...Pager.defaultProps,
    blockPosition: 0,
    chunkPosition: 0,
    disableVisualRegression: false,
    disableVisualProgression: false,
    disableVisualProblemStyle: "fade", // Can be `transparent`, `fade`, or `blur`
    wpm: 4000,
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

    return (
        <div className={"ViewerPage Centered " + classNames.join(' ')}>
             <Paper {...props}>
                <PageContent
                    page={props.page}
                    blockPosition={props.blockPosition}
                    chunkPosition={props.chunkPosition} />
            </Paper>
        </div>
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
    disableVisualProblemStyle: PropTypes.string,

    // WPM
    wpm: PropTypes.number,

    // Pause between two pages
    pageTurningDuration: PropTypes.number, // ms
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...Pager.defaultProps,
    ...defaultDrillSettings,
};

export { Viewer as default, defaultDrillSettings };

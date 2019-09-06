import React from 'react';
import PropTypes from 'prop-types';

import { capitalize } from '../../functions/string';
import Paper from '../../toolbox/Paper';
import PageContent from '../../toolbox/PageContent';
import Styled from '../../toolbox/Styled';

function Viewer(props) {

    const classNames = [];
    if (props.disableVisualRegression) {
        classNames.push('DisableVisualRegression');
    }
    if (props.disableVisualProgression) {
        classNames.push('DisableVisualProgression');
    }
    classNames.push('DisableVisualProblemStyle' + capitalize(props.disableVisualProblemStyle));

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

    page: PropTypes.object,
    blockPosition: PropTypes.number,
    chunkPosition: PropTypes.number,

    // Hide/Show the text in front of the current chunk
    disableVisualRegression: PropTypes.bool,
    // Hide/Show the text behind the current chunk
    disableVisualProgression: PropTypes.bool,
    // How the hidden text controlled by `disableVisualRegression`
    // and `disableVisualProgression` should be displayed
    disableVisualProblemStyle: PropTypes.string,
}

Viewer.defaultProps = {
    ...Styled.defaultProps,

    blockPosition: 0,
    chunkPosition: 0,

    disableVisualRegression: false,
    disableVisualProgression: false,
    disableVisualProblemStyle: "fade", // Can be `transparent`, `fade`, or `blur`
};

export default Viewer;

import React from 'react';
import PropTypes from 'prop-types';

import Paper from '../toolbox/Paper';
import PageContent from '../toolbox/PageContent';
import Styled from '../toolbox/Styled';

const defaultViewerSettings = {
    pageTurningDuration: 300,

    // Disable timer by default
    timer: 0,

    // Disable pacer by default
    pacerWpm: 0,
};

function Viewer(props) {
    return (
        <div className="ViewerPage Centered">
            <Paper {...props}>
                <PageContent
                    page={props.page} />
            </Paper>
        </div>
    );

}

Viewer.propTypes = {
    ...Styled.propTypes,

    // The page content to display
    page: PropTypes.object,

    // Pause between two pages
    pageTurningDuration: PropTypes.number, // ms

    // Enable a timer (stop the reading after the time ends)
    timer: PropTypes.number,

    // Enable a pacer
    pacerWpm: PropTypes.number,
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...defaultViewerSettings,
};

export { Viewer as default, defaultViewerSettings };

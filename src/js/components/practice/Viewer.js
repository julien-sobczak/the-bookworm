import React from 'react';
import PropTypes from 'prop-types';

import Paper from '../core/Paper';
import PageContent from '../core/PageContent';
import Styled from '../core/Styled';

/**
 * Default properties.
 */
const defaultViewerSettings = {
    pageTurningDuration: 300,

    // Disable timer by default
    timer: 0,

    // Disable pacer by default
    pacerWpm: 0,
};

/**
 * Render the drill.
 *
 * @param {Object} props The component properties.
 */
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
    // Inherit properties
    ...Styled.propTypes,

    /**
     * The page content to display.
     */
    page: PropTypes.object,
    /**
     * Pause duration between two pages in ms.
     */
    pageTurningDuration: PropTypes.number,
    /**
     * Enable a timer (stop the reading when the time is up).
     */
    timer: PropTypes.number,
    /**
     * Enable a pacer reading at the specified WPM.
     */
    pacerWpm: PropTypes.number,
};
Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...defaultViewerSettings,
};

export { Viewer as default, defaultViewerSettings };

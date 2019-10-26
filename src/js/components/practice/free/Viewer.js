import React from 'react';
import PropTypes from 'prop-types';

import Paper from '../../toolbox/Paper';
import PageContent from '../../toolbox/PageContent';
import Styled from '../../toolbox/Styled';

const defaultDrillSettings = {
    pageTurningDuration: 300,
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
}

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...defaultDrillSettings,
};

export { Viewer as default, defaultDrillSettings };

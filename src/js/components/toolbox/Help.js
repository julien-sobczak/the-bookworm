import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';

/**
 * Help icon with tooltip message.
 *
 * @param {Object} props The component properties.
 */
function Help({ title }) {

    return (
        <Tooltip title={title} placement="right">
            <HelpIcon />
        </Tooltip>
    );
}

Help.propTypes = {
    /**
     * The title to show on hover or click.
     */
    title: PropTypes.string.isRequired,
};

export default Help;

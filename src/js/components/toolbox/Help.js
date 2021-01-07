import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';

function Help({ title }) {

    return (
        <Tooltip title={title} placement="right">
            <HelpIcon />
        </Tooltip>
    );
}

Help.propTypes = {
    title: PropTypes.string.isRequired,
};

export default Help;

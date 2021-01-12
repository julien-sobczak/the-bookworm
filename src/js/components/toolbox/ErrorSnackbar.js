import React from 'react';
import PropTypes from 'prop-types';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

function ErrorSnackbar({ message, onClose }) {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={message.length > 0}
            autoHideDuration={6000}
            onClose={onClose}
            message={message}
            action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            } />
    );
}

ErrorSnackbar.propTypes = {
    message: PropTypes.string,
    onClose: PropTypes.func,
};

ErrorSnackbar.defaultProps = {
    message: undefined,
    onClose: () => {},
};

export default ErrorSnackbar;

import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '@material-ui/icons/Close';

function PanelError({ message, onClear }) {

    const showError = message && message.trim().length > 0;
    return (
        <>
            {showError && <div data-testid="panel" className="PanelError Clickable" onClick={onClear}>
                {message}
                <button><CloseIcon /></button>
            </div>}
        </>
    );
}

PanelError.propTypes = {
    message: PropTypes.string,
    onClear: PropTypes.func,
};

PanelError.defaultProps = {
    message: undefined,
    onClear: () => {},
};

export default PanelError;

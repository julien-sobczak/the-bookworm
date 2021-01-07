import React from 'react';
import PropTypes from 'prop-types';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';

function Help({ title }) {

    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <ClickAwayListener onClickAway={handleTooltipClose}>
                <div>
                    <Tooltip
                        PopperProps={{
                            disablePortal: true,
                        }}
                        onClose={handleTooltipClose}
                        open={open}
                        disableFocusListener
                        title={title}
                    >
                        <Button onClick={handleTooltipOpen}><HelpIcon /></Button>
                    </Tooltip>
                </div>
            </ClickAwayListener>
        </>
    );
}

Help.propTypes = {
    title: PropTypes.string.isRequired,
};

export default Help;

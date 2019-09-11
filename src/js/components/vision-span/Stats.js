import React from 'react';
import PropTypes from 'prop-types';

function Stats({ stats }) {

    return (
        <div className="FullScreen Results Centered">
            Congratulations
        </div>
    );
}

Stats.propTypes = {
    stats: PropTypes.object,
};

Stats.defaultProps = {
    stats: undefined,
};

export default Stats;
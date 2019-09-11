import React from 'react';

import Engine from './Engine';
import Viewer from './Viewer';

function Demo(props) {
    const drill = new Engine(props.lines).getDrill();
    return <Viewer {...props} drill={drill} />;
}

Demo.propTypes = {
    ...Viewer.propTypes,
};

Demo.defaultProps = {
    ...Viewer.defaultProps,
};

export default Demo;

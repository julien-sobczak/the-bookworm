import React from 'react';

import Engine from './Engine';
import Viewer from './Viewer';

function Demo(props) {
    const drill = new Engine(props.lines, props.columns, props.multiple ? 2 : 1).getDrill();
    return <Viewer {...props} drill={drill} />;
}

Demo.propTypes = {
    ...Viewer.propTypes,
};

Demo.defaultProps = {
    ...Viewer.defaultProps,
};

export default Demo;

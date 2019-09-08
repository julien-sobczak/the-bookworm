import React from 'react';

import Engine from './Engine';
import Viewer from './Viewer';

function Demo(props) {

    let drill = new Engine().getDrill();

    return (
        <Viewer {...props} drill={drill} />
    );
}

Demo.propTypes = {
    ...Viewer.propTypes,
};

Demo.defaultProps = {
    ...Viewer.defaultProps,
};

 export default Demo;

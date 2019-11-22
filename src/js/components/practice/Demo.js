import React from 'react';

import Viewer from './Viewer';

const generatePage = (props) => {
    return {
        "number": 1,
        "blocks": [
            { tag: "p", content: "Psychologists and educational specialists working on visual acuity used a tachistoscope to conclude that, with training, an average person could identify minute images flashed on the screen for only one five-hundredth of a second (2 ms). Though the images used were of airplanes, the results had implications for reading.",
                        chunks: ["Psychologists and educational", " ", "specialists working on", " ", "visual acuity used", "a tachistoscope to conclude that, with training, an average person could identify minute images flashed on the screen for only one five-hundredth of a second (2 ms). Though the images used were of airplanes, the results had implications for reading."] },
        ],
    };
};

function Demo(props) {
    const page = generatePage(props);
    return <Viewer {...props} page={page} />;
}

Demo.propTypes = {
    ...Viewer.propTypes,
};

Demo.defaultProps = {
    ...Viewer.defaultProps,
};

export default Demo;

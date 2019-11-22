import React from 'react';
import PropTypes from 'prop-types';

import Styled from '../../toolbox/Styled';

const defaultDrillSettings = {
    span: "1in",
    autoLevel: true,
};

function Viewer(props) {

    let drill = props.drill;

    // https://www.youtube.com/watch?v=aHaFwnqH5CU
    // Angle in radians = Angle in degrees x PI / 180.
    const angleDegree = 45;
    const angleRadian = angleDegree * Math.PI / 180;
    // x = radius * cosinus angle
    // y = radius * sinus angle
    const x = parseFloat(props.span) * Math.cos(angleRadian);
    const y = parseFloat(props.span) * Math.sin(angleRadian);
    return (
        <Styled className="Viewer ViewerCircle" {...props}>
            {drill &&
                <div style={{height: "100%"}}>
                    <span className={"Cell " + (drill.center.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `50%` }}>
                        {drill.center.label}
                    </span>
                    <span className={"Cell " + (drill.top.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `calc(50% - ${props.span})` }}>
                        {drill.top.label}
                    </span>
                    <span className={"Cell " + (drill.topRight.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${x}in)`, top: `calc(50% - ${y}in)` }}>
                        {drill.topRight.label}
                    </span>
                    <span className={"Cell " + (drill.right.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${props.span})`, top: `50%` }}>
                        {drill.right.label}
                    </span>
                    <span className={"Cell " + (drill.bottomRight.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${x}in)`, top: `calc(50% + ${y}in)` }}>
                        {drill.bottomRight.label}
                    </span>
                    <span className={"Cell " + (drill.bottom.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `calc(50% + ${props.span})` }}>
                        {drill.bottom.label}
                    </span>
                    <span className={"Cell " + (drill.bottomLeft.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${x}in)`, top: `calc(50% + ${y}in)` }}>
                        {drill.bottomLeft.label}
                    </span>
                    <span className={"Cell " + (drill.left.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${props.span})`, top: `50%` }}>
                        {drill.left.label}
                    </span>
                    <span className={"Cell " + (drill.topLeft.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${x}in)`, top: `calc(50% - ${y}in)` }}>
                        {drill.topLeft.label}
                    </span>
                </div>
            }
        </Styled>
    );
}

Viewer.propTypes = {
    ...Styled.propTypes,

    // Space with the center
    span: PropTypes.string,

    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,

    // Drill to display
    drill: PropTypes.object,
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...defaultDrillSettings,
};

export { Viewer as default, defaultDrillSettings };

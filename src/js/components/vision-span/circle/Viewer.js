import React from 'react';
import PropTypes from 'prop-types';

import Styled from '../../toolbox/Styled';
import { SPANS } from '../../../functions/engine';

const defaultViewerSettings = {
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
                    <span data-testid="LetterCenter" className={"Cell " + (drill.center.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `50%` }}>
                        {drill.center.label}
                    </span>
                    <span data-testid="LetterTop" className={"Cell " + (drill.top.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `calc(50% - ${props.span})` }}>
                        {drill.top.label}
                    </span>
                    <span data-testid="LetterTopRight" className={"Cell " + (drill.topRight.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${x}in)`, top: `calc(50% - ${y}in)` }}>
                        {drill.topRight.label}
                    </span>
                    <span data-testid="LetterRight" className={"Cell " + (drill.right.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${props.span})`, top: `50%` }}>
                        {drill.right.label}
                    </span>
                    <span data-testid="LetterBottomRight" className={"Cell " + (drill.bottomRight.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${x}in)`, top: `calc(50% + ${y}in)` }}>
                        {drill.bottomRight.label}
                    </span>
                    <span data-testid="LetterBottom" className={"Cell " + (drill.bottom.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `calc(50% + ${props.span})` }}>
                        {drill.bottom.label}
                    </span>
                    <span data-testid="LetterBottomLeft" className={"Cell " + (drill.bottomLeft.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${x}in)`, top: `calc(50% + ${y}in)` }}>
                        {drill.bottomLeft.label}
                    </span>
                    <span data-testid="LetterLeft" className={"Cell " + (drill.left.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${props.span})`, top: `50%` }}>
                        {drill.left.label}
                    </span>
                    <span data-testid="LetterTopLeft" className={"Cell " + (drill.topLeft.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${x}in)`, top: `calc(50% - ${y}in)` }}>
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
    span: PropTypes.oneOf(SPANS),

    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,

    // Drill to display
    drill: PropTypes.object,
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...defaultViewerSettings,
};

export { Viewer as default, defaultViewerSettings };

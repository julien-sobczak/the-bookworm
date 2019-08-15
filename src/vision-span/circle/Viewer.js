import React from 'react';
import Styled from '../../toolbox/Styled';

function Viewer(props) {
    // https://www.youtube.com/watch?v=aHaFwnqH5CU
    // Angle in radians = Angle in degrees x PI / 180.
    const angleDegree = 45;
    const angleRadian = angleDegree * Math.PI / 180;
    // x = radius * cosinus angle
    // y = radius * sinus angle
    const x = parseFloat(props.span) * Math.cos(angleRadian);
    const y = parseFloat(props.span) * Math.sin(angleRadian);
    return (
        <Styled className="Viewer VisionSpanCircleViewer" {...props}>
            {props.drill &&
                <div style={{height: "100%"}}>
                    <span className={"Cell " + (props.drill.center.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `50%` }}>
                        {props.drill.center.label}
                    </span>
                    <span className={"Cell " + (props.drill.top.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `calc(50% - ${props.span})` }}>
                        {props.drill.top.label}
                    </span>
                    <span className={"Cell " + (props.drill.topRight.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${x}in)`, top: `calc(50% - ${y}in)` }}>
                        {props.drill.topRight.label}
                    </span>
                    <span className={"Cell " + (props.drill.right.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${props.span})`, top: `50%` }}>
                        {props.drill.right.label}
                    </span>
                    <span className={"Cell " + (props.drill.bottomRight.valid === true ? 'valid' : '')} style={{ left: `calc(50% + ${x}in)`, top: `calc(50% + ${y}in)` }}>
                        {props.drill.bottomRight.label}
                    </span>
                    <span className={"Cell " + (props.drill.bottom.valid === true ? 'valid' : '')} style={{ left: `50%`, top: `calc(50% + ${props.span})` }}>
                        {props.drill.bottom.label}
                    </span>
                    <span className={"Cell " + (props.drill.bottomLeft.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${x}in)`, top: `calc(50% + ${y}in)` }}>
                        {props.drill.bottomLeft.label}
                    </span>
                    <span className={"Cell " + (props.drill.left.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${props.span})`, top: `50%` }}>
                        {props.drill.left.label}
                    </span>
                    <span className={"Cell " + (props.drill.topLeft.valid === true ? 'valid' : '')} style={{ left: `calc(50% - ${x}in)`, top: `calc(50% - ${y}in)` }}>
                        {props.drill.topLeft.label}
                    </span>
                </div>
            }
        </Styled>
    );
}

export default Viewer;

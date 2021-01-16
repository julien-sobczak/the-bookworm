import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Cell } from '../UI';
import Styled from '../../core/Styled';
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

    const Viewer = styled.div`
        position: relative;
        width: 100%;
        height: 100%;

        .Cell {
            position: absolute;
            width: 1em;
            height: 1em;
        }
    `;

    return (
        <Styled {...props}>
            <Viewer>
                {drill && <div style={{ height: "100%" }}>
                    <Cell data-testid="LetterCenter" valid={drill.center.valid} style={{ left: `50%`, top: `50%` }}>
                        {drill.center.label}
                    </Cell>
                    <Cell data-testid="LetterTop" valid={drill.top.valid} style={{ left: `50%`, top: `calc(50% - ${props.span})` }}>
                        {drill.top.label}
                    </Cell>
                    <Cell data-testid="LetterTopRight" valid={drill.topRight.valid} style={{ left: `calc(50% + ${x}in)`, top: `calc(50% - ${y}in)` }}>
                        {drill.topRight.label}
                    </Cell>
                    <Cell data-testid="LetterRight" valid={drill.right.valid} style={{ left: `calc(50% + ${props.span})`, top: `50%` }}>
                        {drill.right.label}
                    </Cell>
                    <Cell data-testid="LetterBottomRight" valid={drill.bottomRight.valid} style={{ left: `calc(50% + ${x}in)`, top: `calc(50% + ${y}in)` }}>
                        {drill.bottomRight.label}
                    </Cell>
                    <Cell data-testid="LetterBottom" valid={drill.bottom.valid} style={{ left: `50%`, top: `calc(50% + ${props.span})` }}>
                        {drill.bottom.label}
                    </Cell>
                    <Cell data-testid="LetterBottomLeft" valid={drill.bottomLeft.valid} style={{ left: `calc(50% - ${x}in)`, top: `calc(50% + ${y}in)` }}>
                        {drill.bottomLeft.label}
                    </Cell>
                    <Cell data-testid="LetterLeft" valid={drill.left.valid} style={{ left: `calc(50% - ${props.span})`, top: `50%` }}>
                        {drill.left.label}
                    </Cell>
                    <Cell data-testid="LetterTopLeft" valid={drill.topLeft.valid} style={{ left: `calc(50% - ${x}in)`, top: `calc(50% - ${y}in)` }}>
                        {drill.topLeft.label}
                    </Cell>
                </div>}
            </Viewer>
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

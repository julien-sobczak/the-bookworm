import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Text from '../toolbox/Text';

import CircleEngine from '../vision-span/circle/Engine';
import CircleViewer from '../vision-span/circle/Viewer';

function Step5() {

    // List of spans that fit in a tutorial screen
    const spans = ["0.5in", "0.75in", "1in"];

    const [span, setSpan] = useState("0.5in");

    useEffect(() => {
        const interval = setInterval(() => {
            const index = spans.indexOf(span);
            let newSpan = undefined;
            if (index === spans.length - 1) { // cycle over spans
                newSpan = spans[0];
            } else {
                newSpan = spans[index+1];
            }
            setSpan(newSpan);
        }, 1000);
        return () => clearInterval(interval);
    });

    const drill = new CircleEngine().getDrill();
    const viewer = <CircleViewer span={span} drill={drill} />;

    const DrillViewport = styled.div`
        position: relative;
        height: 15rem;
    `;

    return (
        <>
            <h2>Peripheral Vision</h2>

            <p><strong>Peripheral vision, or indirect vision, occurs outside the point of fixation</strong>, i.e. away from the center of gaze. The objective of the drills is to train your eyes to grasp more text and thus diminish the number of required fixations.</p>

            <DrillViewport>
                {viewer}
            </DrillViewport>

            <p className="alignCenter">
                <Text manuscript arrow arrowDirection="top" arrowPosition="left">Peripheral vision is essential to the next technique: chunking.</Text>
            </p>
        </>
    );
}

export default Step5;

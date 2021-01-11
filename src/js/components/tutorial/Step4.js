import React from 'react';

import { Manuscript } from '../toolbox/Text';

function Step4() {
    return (
        <>
            <h2>The Drills</h2>

            <p><em>The Bookworm</em> integrates <strong>10 drills</strong>. These drills are divided into <strong>3 categories</strong>:</p>

            <ul>
                <li><strong>Peripheral vision</strong>: Expand your vision by trying to read letters on screen, arranged in multiple shapes: line, circle, pyramid or the famous Schulte table.</li>
                <li><strong>Chunking</strong>: Read books or custom texts, chunk by chunk, trying to catch up with the pacer. Content can be presented in pages, as chunks, and spreaded in several columns.</li>
                <li><strong>Practice</strong>: Same as chunking but reading speed is not controller by the pacer. A great way to test your progression.</li>
            </ul>

            <p className="alignCenter">
                <Manuscript arrow={true} arrowDirection="top" arrowPosition="left">All drills are entirely configurable.</Manuscript>
            </p>

            <p>All drills come with ready-to-use presets to help you get started, but expose all settings so that <strong>you can create your own drills</strong>.</p>
        </>
    );
}

export default Step4;

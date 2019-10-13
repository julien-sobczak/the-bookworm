import React from 'react';

import GameFactory from '../../toolbox/GameFactory';
import { defaultDrillProps } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';

const Game = (props) => {

    const examples = [
        {
            name: "Minimalist",
            settings: { linesPerChunk: 1, showPreviousChunk: false, showNextChunk: false, },
        },
        {
            name: "Vertical",
            difficulty: 0,
            settings: { linesPerChunk: 1, neighborChunksPosition: 'vertical', showPreviousChunk: true, showNextChunk: true },
        },
        {
            name: "Horizontal",
            difficulty: 0,
            settings: { linesPerChunk: 1, neighborChunksPosition: 'horizontal', showPreviousChunk: true, showNextChunk: true },
        },
        {
            name: "See the past",
            difficulty: 0,
            settings: { linesPerChunk: 1, neighborChunksPosition: 'vertical', showPreviousChunk: true, showNextChunk: false },
        },
        {
            name: "See the future",
            difficulty: 0,
            settings: { linesPerChunk: 1, neighborChunksPosition: 'vertical', showPreviousChunk: false, showNextChunk: true },
        },
        {
            name: "Multiline",
            difficulty: 1,
            settings: { linesPerChunk: 3, showPreviousChunk: false, showNextChunk: false },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillChunk"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            countdownDuration={2000}
            drillSettings={defaultDrillProps}
            predefinedDrills={examples} />
    );
};

export default Game;
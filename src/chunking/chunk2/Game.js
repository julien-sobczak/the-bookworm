import React from 'react';

import ParentGame from '../../vision-span/Game';
import { DEFAULT_DRILL_SETTINGS } from './Viewer';
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
        <ParentGame
            {...props}
            name="drillChunk"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            drillSettings={DEFAULT_DRILL_SETTINGS}
            shutdownDuration={3000}
            predefinedDrills={examples} />
    );
};

export default Game;
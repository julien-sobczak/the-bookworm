import React from 'react';

import GameFactory from '../../toolbox/GameFactory';
import { defaultDrillSettings } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';

const Game = (props) => {

    const examples = [
        {
            name: "Minimal",
            difficulty: 0,
            options: { disableVisualRegression: true, disableVisualProgression: true, disableVisualProblemStyle: 'transparent' },
        },
        {
            name: "Focused",
            difficulty: 0,
            options: { disableVisualRegression: true, disableVisualProgression: true, disableVisualProblemStyle: 'blur' },
        },
        {
            name: "See the past",
            difficulty: 0,
            options: { disableVisualRegression: false, disableVisualProgression: true, disableVisualProblemStyle: 'transparent' },
        },
        {
            name: "See the future",
            difficulty: 0,
            options: { disableVisualRegression: true, disableVisualProgression: false, disableVisualProblemStyle: 'transparent' },
        },
        {
            name: "Word by word",
            difficulty: 1,
            options: { chunkMode: "words", chunkWords: 1 },
        },
        {
            name: "2-Stops Method",
            difficulty: 1,
            options: { chunkMode: "stops", chunkStops: 2 },
        },
        {
            name: "3-Stops Method",
            difficulty: 1,
            options: { chunkMode: "stops", chunkStops: 3 },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillPage"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            countdownDuration={2000}
            drillSettings={defaultDrillSettings}
            predefinedDrills={examples} />
    );
};

export default Game;
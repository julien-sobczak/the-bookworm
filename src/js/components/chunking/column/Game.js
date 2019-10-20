import React from 'react';

import GameFactory from '../../toolbox/GameFactory';
import { defaultDrillSettings } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';
import Stats from '../Stats';

const Game = (props) => {

    const examples = [
        {
            name: "2-columns narrow",
            difficulty: 0,
            options: { columns: 2, chunkMode: "width", chunkWidth: "1.25in", columnWidth: "1.5in" },
        },
        {
            name: "3-columns narrow",
            difficulty: 0,
            options: { columns: 3, chunkMode: "width", chunkWidth: "1.25in", columnWidth: "1.5in" },
        },
        {
            name: "2-columns wide",
            difficulty: 1,
            options: { columns: 2, chunkMode: "width", chunkWidth: "1.75in", columnWidth: "2in" },
        },
        {
            name: "3-columns wide",
            difficulty: 1,
            options: { columns: 3, chunkMode: "width", chunkWidth: "1.75in", columnWidth: "2in" },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillColumn"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            stats={<Stats />}
            contentAware={true}
            countdownDuration={2000}
            drillSettings={defaultDrillSettings}
            predefinedDrills={examples} />
    );
};

export default Game;
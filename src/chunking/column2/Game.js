import React from 'react';

import ParentGame from '../../vision-span/Game';
import { DEFAULT_DRILL_SETTINGS } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';

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
        <ParentGame
            {...props}
            name="drillColumn"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            shutdownDuration={3000}
            drillSettings={DEFAULT_DRILL_SETTINGS}
            predefinedDrills={examples} />
    );
};

export default Game;
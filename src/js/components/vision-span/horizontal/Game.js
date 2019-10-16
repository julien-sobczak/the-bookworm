import React from 'react';

import GameFactory from '../../toolbox/GameFactory';
import History from './History';
import { defaultDrillSettings } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';
import Stats from '../Stats';

const Game = (props) => {

    const examples = [
        {
            name: "Drill A",
            difficulty: 0,
            settings: { multiple: true, lines: 1, columns: 3, spans: ["1.25in", "1.25in"] },
        },
        {
            name: "Drill B",
            difficulty: 0,
            settings: { multiple: true, lines: 1, columns: 5, spans: ["1.25in", "0", "0", "1.25in"] },
        },
        {
            name: "Drill C",
            difficulty: 1,
            settings: { multiple: true, lines: 1, columns: 5, spans: ["0.75in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "Drill D",
            difficulty: 1,
            settings: { multiple: true, lines: 1, columns: 7, spans: ["0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in"] },
        },
        {
            name: "Drill E",
            difficulty: 2,
            settings: { multiple: true, lines: 1, columns: 9, spans: ["0.75in", "0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "Drill F",
            difficulty: 0,
            settings: { multiple: true, lines: 2, columns: 3, spans: ["1in", "1in"] },
        },
        {
            name: "Drill G",
            difficulty: 1,
            settings: { multiple: true, lines: 3, columns: 7, spans: ["0.5in", "0.5in", "0in", "0in", "0.5in", "0.5in"] },
        },
        {
            name: "Drill H",
            difficulty: 1,
            settings: { multiple: true, lines: 3, columns: 5, spans: ["0.75in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "Drill I",
            difficulty: 1,
            settings: { multiple: false, lines: 5, columns: 7, spans: ["0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in"] },
        },
        {
            name: "Drill J",
            difficulty: 2,
            settings: { multiple: true, lines: 3, columns: 7, spans: ["0.75in", "0.75in", "0.75in", "0.75in", "0.75in", "0.75in"] },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillHorizontal"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            history={<History />}
            stats={<Stats />}
            drillSettings={defaultDrillSettings}
            predefinedDrills={examples} />
    );
};

export default Game;
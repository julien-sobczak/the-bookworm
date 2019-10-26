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
            name: "A",
            difficulty: 0,
            settings: { span: "1.25in" },
        },
        {
            name: "B",
            difficulty: 0,
            settings: { span: "1.75in" },
        },
        {
            name: "C",
            difficulty: 1,
            settings: { span: "2.25in" },
        },
        {
            name: "D",
            difficulty: 1,
            settings: { span: "2.75in" },
        },
        {
            name: "E",
            difficulty: 1,
            settings: { span: "3.25in" },
        },
        {
            name: "F",
            difficulty: 2,
            settings: { span: "3.75in" },
        },
        {
            name: "G",
            difficulty: 2,
            settings: { span: "4.25in" },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillCircle"
            category="vision-span"
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
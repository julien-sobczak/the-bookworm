import React from 'react';

import GameFactory from '../../toolbox/GameFactory';
import History from './History';
import { DEFAULT_DRILL_SETTINGS } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';


const Game = (props) => {

    const examples = [
        {
            name: "A",
            difficulty: 0,
            settings: { span: "0.75in" },
        },
        {
            name: "B",
            difficulty: 0,
            settings: { span: "1in" },
        },
        {
            name: "C",
            difficulty: 0,
            settings: { span: "1.25in" },
        },
        {
            name: "D",
            difficulty: 1,
            settings: { span: "1.5in" },
        },
        {
            name: "E",
            difficulty: 1,
            settings: { span: "1.75in" },
        },
        {
            name: "F",
            difficulty: 1,
            settings: { span: "2in" },
        },
        {
            name: "G",
            difficulty: 2,
            settings: { span: "2.25in" },
        },
        {
            name: "H",
            difficulty: 2,
            settings: { span: "2.5in" },
        },
        {
            name: "I",
            difficulty: 2,
            settings: { span: "2.75in" },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillPyramid"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            history={<History />}
            drillSettings={DEFAULT_DRILL_SETTINGS}
            predefinedDrills={examples} />
    );
};

export default Game;
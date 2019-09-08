import React from 'react';

import Game from '../Game';
import History from './History';
import { DEFAULT_DRILL_SETTINGS } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';


const ParentGame = (props) => {

    const examples = [
        {
            name: "A",
            difficulty: 0,
            settings: { size: 3, span: "0.75in" },
        },
        {
            name: "B",
            difficulty: 1,
            settings: { size: 3, span: "1in" },
        },
        {
            name: "C",
            difficulty: 2,
            settings: { size: 3, span: "1.5in" },
        },
        {
            name: "D",
            difficulty: 1,
            settings: { size: 5, span: "0.50in" },
        },
        {
            name: "E",
            difficulty: 2,
            settings: { size: 5, span: "1in" },
        },
        {
            name: "F",
            difficulty: 2,
            settings: { size: 5, span: "1.25in" },
        },
        {
            name: "G",
            difficulty: 1,
            settings: { size: 7, span: "0.50in" },
        },
        {
            name: "H",
            difficulty: 2,
            settings: { size: 7, span: "0.75in" },
        },
        {
            name: "I",
            difficulty: 2,
            settings: { size: 7, span: "1in" },
        },
        {
            name: "J",
            difficulty: 2,
            settings: { size: 9, span: "0.75in" },
        },
    ];

    return (
        <ParentGame
            {...props}
            name="drillSchulte"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            history={<History />}
            drillSettings={DEFAULT_DRILL_SETTINGS}
            predefinedDrills={examples} />
    );
};

export default Game;
import React from 'react';

import GameFactory from '../../toolbox/GameFactory';
import History from './History';
import { defaultViewerSettings } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';
import Stats from '../Stats';

const defaultDrillSettings = {
    ...defaultViewerSettings,
};

const Game = (props) => {

    const presets = [
        {
            name: "A",
            settings: { size: 3, span: "0.75in" },
        },
        {
            name: "B",
            settings: { size: 3, span: "1in" },
        },
        {
            name: "C",
            settings: { size: 3, span: "1.5in" },
        },
        {
            name: "D",
            settings: { size: 5, span: "0.50in" },
        },
        {
            name: "E",
            settings: { size: 5, span: "1in" },
        },
        {
            name: "F",
            settings: { size: 5, span: "1.25in" },
        },
        {
            name: "G",
            settings: { size: 7, span: "0.50in" },
        },
        {
            name: "H",
            settings: { size: 7, span: "0.75in" },
        },
        {
            name: "I",
            settings: { size: 7, span: "1in" },
        },
        {
            name: "J",
            settings: { size: 9, span: "0.75in" },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillSchulte"
            category="vision-span"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            history={<History />}
            stats={<Stats />}
            drillSettings={defaultDrillSettings}
            drillPresets={presets} />
    );
};

export { Game as default, defaultDrillSettings };

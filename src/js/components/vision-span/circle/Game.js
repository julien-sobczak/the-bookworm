import React from 'react';

import GameFactory from '../../core/GameFactory';
import { defaultViewerSettings } from './Viewer';
import Instructions from './Instructions';
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
            settings: { span: "1.25in" },
        },
        {
            name: "B",
            settings: { span: "1.75in" },
        },
        {
            name: "C",
            settings: { span: "2.25in" },
        },
        {
            name: "D",
            settings: { span: "2.75in" },
        },
        {
            name: "E",
            settings: { span: "3.25in" },
        },
        {
            name: "F",
            settings: { span: "3.75in" },
        },
        {
            name: "G",
            settings: { span: "4.25in" },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillCircle"
            category="vision-span"
            drill={<Drill />}
            instructions={<Instructions />}
            form={<Form />}
            stats={<Stats />}
            drillSettings={defaultDrillSettings}
            drillPresets={presets} />
    );
};

export { Game as default, defaultDrillSettings };

import React from 'react';

import GameFactory from '../../toolbox/GameFactory';
import History from './History';
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
            settings: { multiple: true, lines: 1, columns: 3, spans: ["1.25in", "1.25in"] },
        },
        {
            name: "B",
            settings: { multiple: true, lines: 1, columns: 5, spans: ["1.25in", "0", "0", "1.25in"] },
        },
        {
            name: "C",
            settings: { multiple: true, lines: 1, columns: 5, spans: ["0.75in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "D",
            settings: { multiple: true, lines: 1, columns: 7, spans: ["0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in"] },
        },
        {
            name: "E",
            settings: { multiple: true, lines: 1, columns: 9, spans: ["0.75in", "0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "F",
            settings: { multiple: true, lines: 2, columns: 3, spans: ["1in", "1in"] },
        },
        {
            name: "G",
            settings: { multiple: true, lines: 3, columns: 7, spans: ["0.5in", "0.5in", "0in", "0in", "0.5in", "0.5in"] },
        },
        {
            name: "H",
            settings: { multiple: true, lines: 3, columns: 5, spans: ["0.75in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "I",
            settings: { multiple: false, lines: 5, columns: 7, spans: ["0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in"] },
        },
        {
            name: "J",
            settings: { multiple: true, lines: 3, columns: 7, spans: ["0.75in", "0.75in", "0.75in", "0.75in", "0.75in", "0.75in"] },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillHorizontal"
            category="vision-span"
            drill={<Drill />}
            instructions={<Instructions />}
            form={<Form />}
            history={<History />}
            stats={<Stats />}
            drillSettings={defaultDrillSettings}
            drillPresets={presets} />
    );
};

export { Game as default, defaultDrillSettings };

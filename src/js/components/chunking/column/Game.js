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
            name: "2-columns narrow",
            options: { columns: 2, chunkMode: "width", chunkWidth: "1.25in", columnWidth: "1.5in" },
        },
        {
            name: "3-columns narrow",
            options: { columns: 3, chunkMode: "width", chunkWidth: "1.25in", columnWidth: "1.5in" },
        },
        {
            name: "2-columns wide",
            options: { columns: 2, chunkMode: "width", chunkWidth: "1.75in", columnWidth: "2in" },
        },
        {
            name: "3-columns wide",
            options: { columns: 3, chunkMode: "width", chunkWidth: "1.75in", columnWidth: "2in" },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillColumn"
            category="chunking"
            drill={<Drill />}
            instructions={<Instructions />}
            form={<Form />}
            stats={<Stats />}
            contentAware
            countdownDuration={2000}
            drillSettings={defaultDrillSettings}
            drillPresets={presets} />
    );
};

export { Game as default, defaultDrillSettings };

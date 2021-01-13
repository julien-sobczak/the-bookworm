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
            name: "Minimalist",
            settings: { linesPerChunk: 1, showPreviousChunk: false, showNextChunk: false, },
        },
        {
            name: "Vertical",
            settings: { linesPerChunk: 1, neighborChunksPosition: 'vertical', showPreviousChunk: true, showNextChunk: true },
        },
        {
            name: "Horizontal",
            settings: { linesPerChunk: 1, neighborChunksPosition: 'horizontal', showPreviousChunk: true, showNextChunk: true },
        },
        {
            name: "See the past",
            settings: { linesPerChunk: 1, neighborChunksPosition: 'vertical', showPreviousChunk: true, showNextChunk: false },
        },
        {
            name: "See the future",
            settings: { linesPerChunk: 1, neighborChunksPosition: 'vertical', showPreviousChunk: false, showNextChunk: true },
        },
        {
            name: "Multiline",
            settings: { linesPerChunk: 3, showPreviousChunk: false, showNextChunk: false },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillChunk"
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

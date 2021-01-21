import React from 'react';

import GameFactory from '../../core/GameFactory';
import { defaultViewerSettings } from './Viewer';
import Instructions from './Instructions';
import Form from './Form';
import Drill from './Drill';
import Stats from '../Stats';

/**
 * Default drill settings.
 */
const defaultDrillSettings = {
    ...defaultViewerSettings,
};

/**
 * Default drill presets.
 */
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

/**
 * Root component for the drill. Include all steps of the drill (configuration, session, stats).
 *
 * @param {Object} props The component properties.
 */
function Game(props) {
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
}

Game.propTypes = {
    // Inherit properties
    ...Drill.propTypes,
};
Game.defaultProps = {
    ...defaultDrillSettings,
};

export { Game as default, defaultDrillSettings };

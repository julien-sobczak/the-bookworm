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
        name: "Minimal",
        options: { disableVisualRegression: true, disableVisualProgression: true, disableVisualProblemStyle: 'transparent' },
    },
    {
        name: "Focused",
        options: { disableVisualRegression: true, disableVisualProgression: true, disableVisualProblemStyle: 'blur' },
    },
    {
        name: "See the past",
        options: { disableVisualRegression: false, disableVisualProgression: true, disableVisualProblemStyle: 'transparent' },
    },
    {
        name: "See the future",
        options: { disableVisualRegression: true, disableVisualProgression: false, disableVisualProblemStyle: 'transparent' },
    },
    {
        name: "Word by word",
        options: { chunkMode: "words", chunkWords: 1 },
    },
    {
        name: "2-Stops Method",
        options: { chunkMode: "stops", chunkStops: 2 },
    },
    {
        name: "3-Stops Method",
        options: { chunkMode: "stops", chunkStops: 3 },
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
            name="drillPage"
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

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

/**
 * Root component for the drill. Include all steps of the drill (configuration, session, stats).
 *
 * @param {Object} props The component properties.
 */
function Game(props) {
    return (
        <GameFactory
            {...props}
            name="drillSchulte"
            category="vision-span"
            drill={<Drill />}
            instructions={<Instructions />}
            form={<Form />}
            stats={<Stats />}
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

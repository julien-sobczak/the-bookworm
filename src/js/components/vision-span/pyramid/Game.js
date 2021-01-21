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
    ...defaultViewerSettings
};

/**
 * Default drill presets.
 */
const presets = [
    {
        name: "A",
        settings: { span: "0.75in" },
    },
    {
        name: "B",
        settings: { span: "1in" },
    },
    {
        name: "C",
        settings: { span: "1.25in" },
    },
    {
        name: "D",
        settings: { span: "1.5in" },
    },
    {
        name: "E",
        settings: { span: "1.75in" },
    },
    {
        name: "F",
        settings: { span: "2in" },
    },
    {
        name: "G",
        settings: { span: "2.25in" },
    },
    {
        name: "H",
        settings: { span: "2.5in" },
    },
    {
        name: "I",
        settings: { span: "2.75in" },
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
            name="drillPyramid"
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

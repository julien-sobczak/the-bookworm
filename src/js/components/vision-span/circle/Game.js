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

/**
 * Root component for the drill. Include all steps of the drill (configuration, session, stats).
 *
 * @param {Object} props The component properties.
 */
function Game(props) {
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
}

Game.propTypes = {
    // Inherit properties
    ...Drill.propTypes,
};
Game.defaultProps = {
    ...defaultDrillSettings,
};

export { Game as default, defaultDrillSettings };

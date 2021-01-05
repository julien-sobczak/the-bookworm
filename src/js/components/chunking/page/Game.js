import React from 'react';
import PropTypes from 'prop-types';

import GameFactory from '../../toolbox/GameFactory';
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

    return (
        <GameFactory
            {...props}
            name="drillPage"
            category="chunking"
            drill={<Drill />}
            instructions={<Instructions />}
            form={<Form />}
            stats={<Stats />}
            contentAware={true}
            countdownDuration={2000}
            drillSettings={defaultDrillSettings}
            drillPresets={presets} />
    );
};

Game.propTypes = {
    configurable: PropTypes.bool,
};

Game.defaultProps = {
    configurable: true,
};

export { Game as default, defaultDrillSettings };

import React from 'react';
import PropTypes from 'prop-types';

import GameFactory from '../../toolbox/GameFactory';
import { defaultDrillSettings } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';
import Stats from '../Stats';

const Game = (props) => {

    const examples = [
        {
            name: "Minimal",
            difficulty: 0,
            options: { disableVisualRegression: true, disableVisualProgression: true, disableVisualProblemStyle: 'transparent' },
        },
        {
            name: "Focused",
            difficulty: 0,
            options: { disableVisualRegression: true, disableVisualProgression: true, disableVisualProblemStyle: 'blur' },
        },
        {
            name: "See the past",
            difficulty: 0,
            options: { disableVisualRegression: false, disableVisualProgression: true, disableVisualProblemStyle: 'transparent' },
        },
        {
            name: "See the future",
            difficulty: 0,
            options: { disableVisualRegression: true, disableVisualProgression: false, disableVisualProblemStyle: 'transparent' },
        },
        {
            name: "Word by word",
            difficulty: 1,
            options: { chunkMode: "words", chunkWords: 1 },
        },
        {
            name: "2-Stops Method",
            difficulty: 1,
            options: { chunkMode: "stops", chunkStops: 2 },
        },
        {
            name: "3-Stops Method",
            difficulty: 1,
            options: { chunkMode: "stops", chunkStops: 3 },
        },
    ];

    return (
        <GameFactory
            {...props}
            name="drillPage"
            category="chunking"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            stats={<Stats />}
            contentAware={true}
            countdownDuration={2000}
            drillSettings={defaultDrillSettings}
            predefinedDrills={examples} />
    );
};

Game.propTypes = {
    configurable: PropTypes.bool,
};

Game.defaultProps = {
    configurable: true,
};

export default Game;
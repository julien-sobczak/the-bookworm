import React from 'react';

import GameFactory from '../../core/GameFactory';
import { defaultViewerSettings } from '../Viewer';
import InstructionsStopWatch from './Instructions';
import Form from '../Form';
import Drill from '../Drill';
import Stats from '../Stats';

const defaultDrillSettings = {
    ...defaultViewerSettings,
    timer: 1, // One minute
};

const Game = (props) => {

    return (
        <GameFactory
            {...props}
            name="drillStopWatch"
            category="practice"
            drill={<Drill />}
            instructions={<InstructionsStopWatch />}
            form={<Form />}
            stats={<Stats />}
            contentAware
            countdownDuration={2000}
            drillSettings={defaultDrillSettings}
        />
    );
};

export { Game as default, defaultDrillSettings };

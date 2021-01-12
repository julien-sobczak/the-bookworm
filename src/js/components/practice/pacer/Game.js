import React from 'react';

import GameFactory from '../../toolbox/GameFactory';
import { defaultViewerSettings } from '../Viewer';
import InstructionsPacer from './Instructions';
import Form from '../Form';
import Drill from '../Drill';
import Stats from '../Stats';

const defaultDrillSettings = {
    ...defaultViewerSettings,
    pacerWpm: 200,
};

const Game = (props) => {

    return (
        <GameFactory
            {...props}
            name="drillPacer"
            category="practice"
            drill={<Drill />}
            instructions={<InstructionsPacer />}
            form={<Form />}
            stats={<Stats />}
            contentAware
            countdownDuration={2000}
            drillSettings={defaultDrillSettings}
        />
    );
};

export { Game as default, defaultDrillSettings };

import React from 'react';

import GameFactory from '../../core/GameFactory';
import { defaultViewerSettings } from '../Viewer';
import InstructionsFree from './Instructions';
import Form from '../Form';
import Drill from '../Drill';
import Stats from '../Stats';

const defaultDrillSettings = {
    ...defaultViewerSettings,
};

const Game = (props) => {

    return (
        <GameFactory
            {...props}
            name="drillFree"
            category="practice"
            drill={<Drill />}
            instructions={<InstructionsFree />}
            form={<Form />}
            stats={<Stats />}
            contentAware
            countdownDuration={2000}
            drillSettings={defaultDrillSettings} />
    );
};

export { Game as default, defaultDrillSettings };

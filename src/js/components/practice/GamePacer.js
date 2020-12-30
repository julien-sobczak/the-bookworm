import React from 'react';

import GameFactory from '../toolbox/GameFactory';
import { defaultViewerSettings } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';
import Stats from './Stats';

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
            demo={<Demo />}
            form={<Form />}
            stats={<Stats />}
            contentAware={true}
            countdownDuration={2000}
            drillSettings={defaultDrillSettings}
        />
    );
};

export { Game as default, defaultDrillSettings };

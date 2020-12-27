import React from 'react';

import GameFactory from '../toolbox/GameFactory';
import { defaultDrillSettings } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';
import Stats from './Stats';

const DEFAULT_DRILL_SETTINGS = {
    ...defaultDrillSettings,
};

const Game = (props) => {

    return (
        <GameFactory
            {...props}
            name="drillFree"
            category="practice"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            stats={<Stats />}
            contentAware={true}
            countdownDuration={2000}
            drillSettings={DEFAULT_DRILL_SETTINGS} />
    );
};

export { Game as default, DEFAULT_DRILL_SETTINGS };

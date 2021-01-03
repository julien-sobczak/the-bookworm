import React from 'react';

import GameFactory from '../toolbox/GameFactory';
import { defaultViewerSettings } from './Viewer';
import DemoFree from './DemoFree';
import Form from './Form';
import Drill from './Drill';
import Stats from './Stats';

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
            demo={<DemoFree />}
            form={<Form />}
            stats={<Stats />}
            contentAware={true}
            countdownDuration={2000}
            drillSettings={defaultDrillSettings} />
    );
};

export { Game as default, defaultDrillSettings };

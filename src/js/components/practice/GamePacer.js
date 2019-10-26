import React from 'react';

import GameFactory from '../toolbox/GameFactory';
import { defaultDrillSettings } from './Viewer';
import Demo from './Demo';
import Form from './Form';
import Drill from './Drill';
import Stats from './Stats';

const Game = (props) => {

    return (
        <GameFactory
            {...props}
            name="drillPacer"
            drill={<Drill />}
            demo={<Demo />}
            form={<Form />}
            stats={<Stats />}
            contentAware={true}
            countdownDuration={2000}
            drillSettings={{
                ...defaultDrillSettings,
                pacerWpm: 200,
            }}
        />
    );
};

export default Game;
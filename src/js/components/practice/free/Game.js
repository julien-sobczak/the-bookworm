import React from 'react';

import GameFactory from '../../core/GameFactory';
import { defaultViewerSettings } from '../Viewer';
import InstructionsFree from './Instructions';
import Form from '../Form';
import Drill from '../Drill';
import Stats from '../Stats';

/**
 * Default drill settings.
 */
const defaultDrillSettings = {
    ...defaultViewerSettings,
};

/**
 * Root component for the drill. Include all steps of the drill (configuration, session, stats).
 *
 * @param {Object} props The component properties.
 */
function Game(props) {
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
}

Game.propTypes = {
    // Inherit properties
    ...Drill.propTypes,
};
Game.defaultProps = {
    ...defaultDrillSettings,
};

export { Game as default, defaultDrillSettings };

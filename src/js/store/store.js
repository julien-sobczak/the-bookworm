import { createStore } from "redux";
import rootReducer from "./reducers";

import { defaultDrillSettings as defaultDrillCircleSettings } from "../components/vision-span/circle/Game";
import { defaultDrillSettings as defaultDrillHorizontalSettings } from "../components/vision-span/horizontal/Game";
import { defaultDrillSettings as defaultDrillPyramidSettings } from "../components/vision-span/pyramid/Game";
import { defaultDrillSettings as defaultDrillSchulteSettings } from "../components/vision-span/schulte/Game";
import { defaultDrillSettings as defaultDrillChunkSettings } from "../components/chunking/chunk/Game";
import { defaultDrillSettings as defaultDrillColumnSettings } from "../components/chunking/column/Game";
import { defaultDrillSettings as defaultDrillPageSettings } from "../components/chunking/page/Game";
import { defaultDrillSettings as defaultDrillFreeSettings } from "../components/practice/free/Game";
import { defaultDrillSettings as defaultDrillPacerSettings } from "../components/practice/pacer/Game";
import { defaultDrillSettings as defaultDrillStopWatchSettings } from "../components/practice/stopwatch/Game";
import { defaultTextSettings } from "../components/toolbox/Styled";

const defaultState = {
    startDate: new Date().toDateString(),
    tutorialCompleted: false,
    readings: [],
    history: {
        drillHorizontal: [],
        drillCircle: [],
        drillPyramid: [],
        drillSchulte: [],
        drillChunk: [],
        drillPage: [],
        drillColumn: [],
        drillFree: [],
        drillPacer: [],
        drillStopWatch: [],
    },
    customPresets: {
        drill: { // Drill presets are specific to a drill
            "drillCircle": [],
            "drillHorizontal": [],
            "drillPyramid": [],
            "drillSchulte": [],
            "drillPage": [],
            "drillChunk": [],
            "drillColumn": [],
            "drillFree": [],
            "drillPacer": [],
            "drillStopWatch": [],
        },
        text: [], // Text presets are shared among drills
    },
    defaults: {
        // Vision span
        "drillCircle": {
            drill: defaultDrillCircleSettings,
            text: defaultTextSettings,
            showInstructions: true,
        },
        "drillHorizontal": {
            drill: defaultDrillHorizontalSettings,
            text: defaultTextSettings,
            showInstructions: true,
        },
        "drillPyramid": {
            drill: defaultDrillPyramidSettings,
            text:  defaultTextSettings,
            showInstructions: true,
        },
        "drillSchulte": {
            drill: defaultDrillSchulteSettings,
            text: defaultTextSettings,
            showInstructions: true,
        },

        // Chunking
        "drillPage": {
            drill: defaultDrillPageSettings,
            text: defaultTextSettings,
            showInstructions: true,
        },
        "drillChunk": {
            drill: defaultDrillChunkSettings,
            text: defaultTextSettings,
            showInstructions: true,
        },
        "drillColumn": {
            drill: defaultDrillColumnSettings,
            text: defaultTextSettings,
            showInstructions: true,
        },

        // Practice
        "drillFree": {
            drill: defaultDrillFreeSettings,
            text: defaultTextSettings,
            showInstructions: true,
        },
        "drillPacer": {
            drill: defaultDrillPacerSettings,
            text: defaultTextSettings,
            showInstructions: true,
        },
        "drillStopWatch": {
            drill: defaultDrillStopWatchSettings,
            text: defaultTextSettings,
            showInstructions: true,
        },
    },
    preferences: {
        global: {
            displayScale: 1,
        },
        language: {
            native: "English",
        },
        text: {
            fontFamily: 'Roboto',
            fontSize: '14pt',
            fontStyle: 'normal',
            theme: 'Light',
        },
        chunk: {
            chunkStyle: 'highlight',
        }
    },
    stats: {
        "books": 0,
        "pastes": 0,
        "epubs": 0,
        "readingTime": 0, // In seconds
        "wpms": [], // Ten latest WPM to calculate the current user WPM
        "wpm": 0,
    },
    lastBackup: null,
    previousReadings: [],
};

const initialState = defaultState;

// localStorage persistence implementation
// Based on blogpost: https://stackoverflow.com/questions/35305661/where-to-write-to-localstorage-in-a-redux-app
const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : initialState;
const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export { store as default, defaultState};

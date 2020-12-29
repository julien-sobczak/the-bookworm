import { createStore } from "redux";
import rootReducer from "./reducers";

import { defaultDrillSettings as DEFAULT_DRILL_CIRCLE_SETTINGS } from "../components/vision-span/circle/Viewer";
import { defaultDrillSettings as DEFAULT_DRILL_HORIZONTAL_SETTINGS } from "../components/vision-span/horizontal/Viewer";
import { defaultDrillSettings as DEFAULT_DRILL_PYRAMID_SETTINGS } from "../components/vision-span/pyramid/Viewer";
import { defaultDrillSettings as DEFAULT_DRILL_SCHULTE_SETTINGS } from "../components/vision-span/schulte/Viewer";
import { defaultDrillSettings as DEFAULT_DRILL_CHUNK_SETTINGS } from "../components/chunking/chunk/Viewer";
import { defaultDrillSettings as DEFAULT_DRILL_COLUMN_SETTINGS } from "../components/chunking/column/Viewer";
import { defaultDrillSettings as DEFAULT_DRILL_PAGE_SETTINGS } from "../components/chunking/page/Viewer";
import { DEFAULT_DRILL_SETTINGS as DEFAULT_DRILL_FREE_SETTINGS } from "../components/practice/GameFree";
import { DEFAULT_DRILL_SETTINGS as DEFAULT_DRILL_PACER_SETTINGS } from "../components/practice/GamePacer";
import { DEFAULT_DRILL_SETTINGS as DEFAULT_DRILL_STOPWATCH_SETTINGS } from "../components/practice/GameStopWatch";
import { DEFAULT_TEXT_SETTINGS } from "../components/toolbox/Styled";

const defaultState = {
    startDate: new Date().toDateString(),
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
            drill: DEFAULT_DRILL_CIRCLE_SETTINGS,
            text: DEFAULT_TEXT_SETTINGS,
        },
        "drillHorizontal": {
            drill: DEFAULT_DRILL_HORIZONTAL_SETTINGS,
            text: DEFAULT_TEXT_SETTINGS,
        },
        "drillPyramid": {
            drill: DEFAULT_DRILL_PYRAMID_SETTINGS,
            text:  DEFAULT_TEXT_SETTINGS,
        },
        "drillSchulte": {
            drill: DEFAULT_DRILL_SCHULTE_SETTINGS,
            text: DEFAULT_TEXT_SETTINGS,
        },

        // Chunking
        "drillPage": {
            drill: DEFAULT_DRILL_PAGE_SETTINGS,
            text: DEFAULT_TEXT_SETTINGS,
        },
        "drillChunk": {
            drill: DEFAULT_DRILL_CHUNK_SETTINGS,
            text: DEFAULT_TEXT_SETTINGS,
        },
        "drillColumn": {
            drill: DEFAULT_DRILL_COLUMN_SETTINGS,
            text: DEFAULT_TEXT_SETTINGS,
        },

        // Practice
        "drillFree": {
            drill: DEFAULT_DRILL_FREE_SETTINGS,
            text: DEFAULT_TEXT_SETTINGS,
        },
        "drillPacer": {
            drill: DEFAULT_DRILL_PACER_SETTINGS,
            text: DEFAULT_TEXT_SETTINGS,
        },
        "drillStopWatch": {
            drill: DEFAULT_DRILL_STOPWATCH_SETTINGS,
            text: DEFAULT_TEXT_SETTINGS,
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

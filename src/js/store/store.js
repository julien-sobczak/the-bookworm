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
    startDate: new Date(),
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
    defaults: {
        // Vision span
        "drillCircle-drillSettings": DEFAULT_DRILL_CIRCLE_SETTINGS,
        "drillCircle-textSettings": DEFAULT_TEXT_SETTINGS,

        "drillHorizontal-drillSettings": DEFAULT_DRILL_HORIZONTAL_SETTINGS,
        "drillHorizontal-textSettings": DEFAULT_TEXT_SETTINGS,

        "drillPyramid-drillSettings": DEFAULT_DRILL_PYRAMID_SETTINGS,
        "drillPyramid-textSettings": DEFAULT_TEXT_SETTINGS,

        "drillSchulte-drillSettings": DEFAULT_DRILL_SCHULTE_SETTINGS,
        "drillSchulte-textSettings": DEFAULT_TEXT_SETTINGS,

        // Chunking
        "drillPage-drillSettings": DEFAULT_DRILL_PAGE_SETTINGS,
        "drillPage-textSettings": DEFAULT_TEXT_SETTINGS,

        "drillChunk-drillSettings": DEFAULT_DRILL_CHUNK_SETTINGS,
        "drillChunk-textSettings": DEFAULT_TEXT_SETTINGS,

        "drillColumn-drillSettings": DEFAULT_DRILL_COLUMN_SETTINGS,
        "drillColumn-textSettings": DEFAULT_TEXT_SETTINGS,

        // Practice
        "drillFree-drillSettings": DEFAULT_DRILL_FREE_SETTINGS,
        "drillFree-textSettings": DEFAULT_TEXT_SETTINGS,

        "drillPacer-drillSettings": DEFAULT_DRILL_PACER_SETTINGS,
        "drillPacer-textSettings": DEFAULT_TEXT_SETTINGS,

        "drillStopWatch-drillSettings": DEFAULT_DRILL_STOPWATCH_SETTINGS,
        "drillStopWatch-textSettings": DEFAULT_TEXT_SETTINGS,
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

const dummyState = {
    startDate: new Date(),
    readings: [
        {
            id: "content-book-en-Alices-Adventures-in-Wonderland",
            type: "book",
            description: {
                "type": "literature",
                "origin": "gutenberg",
                "title": "Alice's Adventures in Wonderland",
                "author": "Lewis Carroll",
                "slug": "Alices-Adventures-in-Wonderland",
                "url": "https://www.gutenberg.org/ebooks/11",
                "file": "https://www.gutenberg.org/files/11/11-0.txt",
                "language": "English",
            },
            reloadable: true,
            position: {
                section: 5,
                block: 0,
                progress: 40,
            },
            lastDate: "2019-09-13T18:25:43.511Z",
        },
        {
            id: "content-book-en-Pride-and-Prejudice",
            type: "book",
            description: {
                "type": "literature",
                "origin": "gutenberg",
                "title": "Pride and Prejudice",
                "author": "Jane Austen",
                "slug": "Pride-and-Prejudice",
                "url": "https://www.gutenberg.org/ebooks/1342",
                "file": "https://www.gutenberg.org/files/1342/1342-0.txt",
                "language": "English",
            },
            reloadable: true,
            position: {
                section: 10,
                block: 0,
                progress: 90,
            },
            lastDate: "2019-08-23T18:25:43.511Z",
        },
        {
            id: "content-book-en-The-Adventures-of-Tom-Sawyer",
            type: "book",
            description: {
                "type": "literature",
                "origin": "gutenberg",
                "title": "The Adventures of Tom Sawyer",
                "author": "Mark Twain",
                "slug": "The-Adventures-of-Tom-Sawyer",
                "url": "https://www.gutenberg.org/ebooks/74",
                "file": "https://www.gutenberg.org/files/74/74-0.txt",
                "language": "English",
            },
            reloadable: true,
            position: {
                section: 0,
                block: 0,
                progress: 0,
            },
            lastDate: "2019-07-02T18:25:43.511Z",
        },
    ],
    history: {
        drillHorizontal: [
            {
                date: "2012-04-23T18:25:43.511Z",
                textSettings: { fontFamily: 'Roboto', fontSize: '14pt', fontStyle: 'normal', theme: 'Light' },
                drillSettings: { multiple: true, lines: 1, columns: 3, spans: ["1.25in", "1.25in"] },
                stats: {},
            },
            {
                date: "2014-02-23T18:25:43.511Z",
                textSettings: { fontFamily: 'Roboto', fontSize: '14pt', fontStyle: 'bold', theme: 'Light' },
                drillSettings: { multiple: false, columns: 5, spans: ["1.25in", "1.25in", "1.25in", "1.25in"] },
                stats: {},
            },
        ],
        drillCircle: [
            {
                date: "2014-02-23T18:25:43.511Z",
                textSettings: { fontFamily: 'Roboto', fontSize: '14pt', fontStyle: 'bold', theme: 'Light' },
                drillSettings: { span: "2in" },
                stats: {},
            },
        ],
        drillPyramid: [
            {
                date: "2014-02-23T18:25:43.511Z",
                textSettings: { fontFamily: 'Roboto', fontSize: '14pt', fontStyle: 'bold', theme: 'Light' },
                drillSettings: { lines: 5, span: "2.25in" },
                stats: {},
            },
        ],
        drillSchulte: [
            {
                date: "2014-02-23T18:25:43.511Z",
                textSettings: { fontFamily: 'Roboto', fontSize: '14pt', fontStyle: 'bold', theme: 'Light' },
                drillSettings: { size: 5, span: "1.25in" },
                stats: {},
            },
        ]
    },
    preferences: {
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
        "books": 2,
        "pastes": 10,
        "epubs": 1,
        "readingTime": 13200,
        "wpms": [350, 340, 540, 320, 400, 200, 100],
        "wpm": 450,
    },
    lastBackup: "2019-10-02T18:25:43.511Z",
    previousReadings: [
        {
            id: "content-book-en-Peter-Pan",
            type: "book",
            description: {
                "type": "literature",
                "origin": "gutenberg",
                "title": "Peter Pan",
                "author": "J. M. Barrie",
                "slug": "Peter-Pan",
                "url": "https://www.gutenberg.org/ebooks/16",
                "file": "https://www.gutenberg.org/files/16/16-0.txt",
                "language": "English"
            },
            lastDate: "2019-05-02T18:25:43.511Z",
        },
        {
            id: "content-book-en-Peter-Pan",
            type: "book",
            description: {
                "type": "literature",
                "origin": "gutenberg",
                "title": "Moby Dick",
                "author": "Herman Melville",
                "slug": "Moby-Dick",
                "url": "https://www.gutenberg.org/ebooks/2701",
                "file": "https://www.gutenberg.org/files/2701/2701-0.txt",
                "language": "English"
            },
            lastDate: "2019-05-02T18:25:43.511Z",
        },

    ],
};

const initialState = defaultState || dummyState;

// localStorage persistence implementation
// Based on blogpost: https://stackoverflow.com/questions/35305661/where-to-write-to-localstorage-in-a-redux-app
const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : initialState;
const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export { store as default, defaultState};

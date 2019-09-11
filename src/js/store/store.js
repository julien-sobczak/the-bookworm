import { createStore } from "redux";
import rootReducer from "./reducers";

const initialState = {
    readings: [
        {
            title: "The Adventures of Tom Sawyer",
            author: "Mark Twain",
            slug: "The-Adventures-of-Tom-Sawyer",
            position: {
                chapter: 0,
                line: 0,
            },
        },
    ],
    lastReading: 0,
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
};

// localStorage persistence implementation
// Based on blogpost: https://stackoverflow.com/questions/35305661/where-to-write-to-localstorage-in-a-redux-app
const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : initialState;
const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()))
});

export default store;
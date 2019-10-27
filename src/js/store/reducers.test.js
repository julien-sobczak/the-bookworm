import reducer from './reducers';
import * as actions from './actions';

const initialState = {
    readings: [],
    history: {
        drillHorizontal: [],
        drillCircle: [],
        drillPyramid: [],
        drillSchulte: []
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
    stats: {
        "books": 0,
        "paste": 0,
        "epub": 0,
        "readingTime": 0,
        "wpms": [],
        "wpm": 0,
    },
    lastBackup: null,
    previousReadings: [],
};

describe('rootReducer', () => {

    // TODO add a unit test to test the initial state
    // it('should return the initial state', () => {
    //     expect(reducer(undefined, {})).toEqual([
    //         {
    //             text: 'Use Redux',
    //             completed: false,
    //             id: 0
    //         }
    //     ]);
    // });

    it('should handle updateChunkPreferences', () => {
        expect(
            reducer(initialState, actions.updateChunkPreferences({
                chunkStyle: 'underline'
            }))
        ).toMatchObject({
            preferences: {
                chunk: {
                    chunkStyle: 'underline',
                },
            },
        });
    });

    it('should handle updateTextPreferences', () => {
        expect(
            reducer(initialState, actions.updateTextPreferences({
                fontSize: '12pt'
            }))
        ).toMatchObject({
            preferences: {
                text: {
                    fontSize: '12pt',
                },
            },
        });
    });

    it('should handle registerBackup', () => {
        const now = new Date();
        expect(
            reducer(initialState, actions.registerBackup({
                date: now
            }))
        ).toMatchObject({
            lastBackup: now.toJSON(),
        });
    });

    it('should handle restoreBackup', () => {
        const backupState = {
            readings: [],
            history: {
                drillHorizontal: [],
                drillCircle: [],
                drillPyramid: [],
                drillSchulte: []
            },
            preferences: {
                text: {
                    fontFamily: 'Roboto',
                    fontSize: '12pt',
                    fontStyle: 'bold',
                    theme: 'Black',
                },
                chunk: {
                    chunkStyle: 'unerline',
                }
            },
            stats: {
                "books": 2,
                "paste": 1,
                "epub": 4,
                "readingTime": 180,
                "wpms": [100, 150, 440],
                "wpm": 200,
            },
            lastBackup: "2019-10-02T18:25:43.511Z",
            previousReadings: [],
        };
        expect(
            reducer(initialState, actions.restoreBackup(backupState))
        ).toEqual(backupState);
    });

    it('should handle updateReading', () => {
        const reading = {
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
        };

        const newState = reducer(initialState, actions.updateReading(reading));
        expect(newState.readings).toHaveLength(1);
        expect(newState.readings[0].lastDate).not.toBe(reading.lastDate);
    });

    it('should handle recordSession', () => {
        const session = {
            type: 'drillChunk',
            session: {
                date: "2014-02-23T18:25:43.511Z",
                textSettings: { fontFamily: 'Roboto', fontSize: '14pt', fontStyle: 'bold', theme: 'Light' },
                drillSettings: { lines: 5, span: "2.25in" },
                stats: {},
            },
        };
        expect(
            reducer(initialState, actions.recordSession(session)
        ).toMatchObject({
            history: {
                drillChunk: [session],
            }
        });
    });
});

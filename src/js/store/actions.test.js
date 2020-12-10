import * as actions from './actions';

describe('actions', () => {

    it('should create an action to update the current reading', () => {
        const payload = {
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
        const expectedAction = {
            type: actions.UPDATE_READING,
            payload,
        };
        expect(actions.updateReading(payload)).toEqual(expectedAction);
    });

    it('should create an action to update text preferences', () => {
        const payload = {
            fontFamily: 'Roboto',
            fontSize: '14pt',
            fontStyle: 'normal',
            theme: 'Light',
        };
        const expectedAction = {
            type: actions.UPDATE_TEXT_PREFERENCES,
            payload,
        };
        expect(actions.updateTextPreferences(payload)).toEqual(expectedAction);
    });

    it('should create an action to update chunk preferences', () => {
        const payload = {
            chunkStyle: 'highlight',
        };
        const expectedAction = {
            type: actions.UPDATE_CHUNK_PREFERENCES,
            payload,
        };
        expect(actions.updateChunkPreferences(payload)).toEqual(expectedAction);
    });

    it('should create an action to restore a backup', () => {
        const payload = {
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
        const expectedAction = {
            type: actions.RESTORE_BACKUP,
            payload,
        };
        expect(actions.restoreBackup(payload)).toEqual(expectedAction);
    });

    it('should create an action to register a new backup', () => {
        const payload = {
            date: new Date(),
        };
        const expectedAction = {
            type: actions.REGISTER_BACKUP,
            payload,
        };
        expect(actions.registerBackup(payload)).toEqual(expectedAction);
    });

    it('should create an action to record a new session', () => {
        const payload = {
            type: 'drillChunk',
            session: {
                date: "2014-02-23T18:25:43.511Z",
                textSettings: { fontFamily: 'Roboto', fontSize: '14pt', fontStyle: 'bold', theme: 'Light' },
                drillSettings: { lines: 5, span: "2.25in" },
                stats: {},
            },
        };
        const expectedAction = {
            type: actions.RECORD_SESSION,
            payload,
        };
        expect(actions.recordSession(payload)).toEqual(expectedAction);
    });

    it('should create an action to save new defaults', () => {
        const payload = {
            key: 'drillCircle-drillSettings',
            session: {
                span: "1in",
            },
        };
        const expectedAction = {
            type: actions.SAVE_DEFAULTS,
            payload,
        };
        expect(actions.saveDefaults(payload)).toEqual(expectedAction);
    });

});

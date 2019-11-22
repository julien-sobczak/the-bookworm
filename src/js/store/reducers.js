
import * as actions from "./actions";

/** How many sessions should be kept in history for every drill. */
const MAX_SESSIONS_HISTORY = 10;

/** Use the last N WPM to determine the current user WPM. */
const MAX_WPMS = 10;

function rootReducer(state, action) {

    if (action.type === actions.UPDATE_READING) {
            // if progress: 100
    // => update stats.[books|paste|epubs]
    // => move to previousReadings

        // Update existing reading
        const newReadings = [...state.readings];
        let found = false;
        for (let i = 0; i < newReadings.length; i++) {
            if (newReadings[i].id === action.payload.id) {
                newReadings[i] = {
                    ...action.payload,
                    lastDate: new Date().toJSON(),
                };
                found = true;
                break;
            }
        }
        // Or add new reading
        if (!found) {
            newReadings.push({
                ...action.payload,
                lastDate: new Date().toJSON(),
            });
        }
        newReadings.sort((a, b) => new Date(a.lastDate) > new Date(b.lastDate) ? -1 : 1);
        console.log('Updating readings...', newReadings);

        const currentReading = newReadings[0];
        const newStats = state.stats;
        if (currentReading.position.progress === 100) { // Reading is finished
            // Move the reading to previous readings
            state.previousReadings.unshift(newReadings.shift());
            newStats[currentReading.type + 's']++;
        }

        return {
            ...state,
            readings: newReadings,
            stats: newStats,
        };

    } else if (action.type === actions.UPDATE_LANGUAGE_PREFERENCES) {
        return {
            ...state,
            preferences: {
                ...state.preferences,
                language: action.payload,
            },
        };

    } else if (action.type === actions.UPDATE_TEXT_PREFERENCES) {
        return {
            ...state,
            preferences: {
                ...state.preferences,
                text: action.payload,
            },
        };

    } else if (action.type === actions.UPDATE_CHUNK_PREFERENCES) {
        return {
            ...state,
            preferences: {
                ...state.preferences,
                chunk: action.payload,
            },
        };

    } else if (action.type === actions.RESTORE_BACKUP) {
        return {
            ...state,
            // Override everything with previous backup data
            ...action.payload,
            lastBackup: new Date(),
        };

    } else if (action.type === actions.REGISTER_BACKUP) {
        return {
            ...state,
            lastBackup: action.payload.date.toJSON(),
        };

    } else if (action.type === actions.RECORD_SESSION) {
        const drillType = action.payload.type;

        // Add session in history
        const previousSessions = [...state.history[drillType]];
        previousSessions.unshift(action.payload);
        const newHistory = {
            ...state.history,
        };
        newHistory[drillType] = previousSessions.slice(0, MAX_SESSIONS_HISTORY);

        // Update reading stats in global stats
        let newStats = state.stats;
        const drillStats = action.payload.stats;
        if (drillStats.hasOwnProperty('wpm')) { // Only for text-based drills
            const wpms = [...state.stats.wpms];
            wpms.unshift(drillStats.wpm);
            const sum = wpms.reduce(function(a, b) { return a + b; });
            const wpm = parseInt(sum / wpms.length); // avg
            newStats = {
                ...newStats,
                wpms: wpms.slice(0, MAX_WPMS),
                wpm: wpm,
                readingTime: state.readingTime + drillStats.durationInSeconds,
            };
        }

        return {
            ...state,
            history: newHistory,
            stats: newStats,
        };
    }

    return state;
}

export default rootReducer;
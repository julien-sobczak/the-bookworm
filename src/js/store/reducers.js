
import { UPDATE_READING, UPDATE_TEXT_PREFERENCES, UPDATE_CHUNK_PREFERENCES } from "./actions";

function rootReducer(state, action) {
    if (action.type === UPDATE_READING) {
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
        if (!found) {
            newReadings.push({
                ...action.payload,
                lastDate: new Date().toJSON(),
            });
        }
        newReadings.sort((a, b) => new Date(a.lastDate) > new Date(b.lastDate) ? -1 : 1);
        console.log('Updating readings...', newReadings);
        return {
            ...state,
            readings: newReadings,
        };
    } else if (action.type === UPDATE_TEXT_PREFERENCES) {
        return {
            ...state,
            preferences: {
                ...state.preferences,
                text: action.payload,
            },
        };
    } else if (action.type === UPDATE_CHUNK_PREFERENCES) {
        return {
            ...state,
            preferences: {
                ...state.preferences,
                chunk: action.payload,
            },
        };
    }

    return state;
};

export default rootReducer;
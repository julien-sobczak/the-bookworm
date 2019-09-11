
import { UPDATE_READING, UPDATE_TEXT_PREFERENCES, UPDATE_CHUNK_PREFERENCES } from "./actions";

function rootReducer(state, action) {
    if (action.type === UPDATE_READING) {
        const newReadings = {
            ...state.readings,
        };
        newReadings[action.payload.slug] = action.position;
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
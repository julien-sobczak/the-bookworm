
import { UPDATE_READING } from "./actions";

function rootReducer(state, action) {
    if (action.type === UPDATE_READING) {
        const newReadings = {
            ...state.readings,
        };
        newReadings[action.payload.slug] = action.position;
        return Object.assign({}, state, {
            readings: newReadings,
        });
    }
    return state;
};

export default rootReducer;
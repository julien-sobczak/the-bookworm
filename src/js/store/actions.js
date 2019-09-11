
export const UPDATE_READING = "UPDATE_READING";
export const UPDATE_TEXT_PREFERENCES = "UPDATE_TEXT_PREFERENCES";
export const UPDATE_CHUNK_PREFERENCES = "UPDATE_CHUNK_PREFERENCES";

export function updateReading(payload) {
    return { type: UPDATE_READING, payload };
};

export function updateTextPreferences(payload) {
    return { type: UPDATE_TEXT_PREFERENCES, payload };
};

export function updateChunkPreferences(payload) {
    return { type: UPDATE_CHUNK_PREFERENCES, payload };
};
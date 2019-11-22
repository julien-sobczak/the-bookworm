
export const UPDATE_READING = "UPDATE_READING";
export const UPDATE_LANGUAGE_PREFERENCES = "UPDATE_LANGUAGE_PREFERENCES";
export const UPDATE_TEXT_PREFERENCES = "UPDATE_TEXT_PREFERENCES";
export const UPDATE_CHUNK_PREFERENCES = "UPDATE_CHUNK_PREFERENCES";
export const RESTORE_BACKUP = "RESTORE_BACKUP";
export const REGISTER_BACKUP = "REGISTER_BACKUP";
export const RECORD_SESSION = "RECORD_SESSION";

export function updateReading(payload) {
    return { type: UPDATE_READING, payload };
}

export function updateLanguagePreferences(payload) {
    return { type: UPDATE_LANGUAGE_PREFERENCES, payload };
}

export function updateTextPreferences(payload) {
    return { type: UPDATE_TEXT_PREFERENCES, payload };
}

export function updateChunkPreferences(payload) {
    return { type: UPDATE_CHUNK_PREFERENCES, payload };
}

export function restoreBackup(payload) {
    return { type: RESTORE_BACKUP, payload };
}

export function registerBackup(payload) {
    return { type: REGISTER_BACKUP, payload };
}

export function recordSession(payload) {
    return { type: RECORD_SESSION, payload };
}
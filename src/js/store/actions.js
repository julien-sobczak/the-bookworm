
// Update the position inside the curent reading.
export const UPDATE_READING = "UPDATE_READING";
// Update the global preferences.
export const UPDATE_GLOBAL_PREFERENCES = "UPDATE_GLOBAL_PREFERENCES";
// Update the language preferences.
export const UPDATE_LANGUAGE_PREFERENCES = "UPDATE_LANGUAGE_PREFERENCES";
// Update the text preferences.
export const UPDATE_TEXT_PREFERENCES = "UPDATE_TEXT_PREFERENCES";
// Update the chunk preferences.
export const UPDATE_CHUNK_PREFERENCES = "UPDATE_CHUNK_PREFERENCES";
// Save a backup containing the Redux State and the localStorage database.
export const REGISTER_BACKUP = "REGISTER_BACKUP";
// Restore a previously generated backup.
export const RESTORE_BACKUP = "RESTORE_BACKUP";
// Put a new drill session in history.
export const RECORD_SESSION = "RECORD_SESSION";
// Save the settings for a drill.
export const SAVE_DEFAULTS = "SAVE_DEFAULTS";
// Save a new drill preset.
export const SAVE_DRILL_PRESET = "SAVE_DRILL_PRESET";
// Save a new text preset.
export const SAVE_TEXT_PRESET = "SAVE_TEXT_PRESET";
// Delete a drill preset.
export const DELETE_DRILL_PRESET = "DELETE_DRILL_PRESET";
// Delete a text preset.
export const DELETE_TEXT_PRESET = "DELETE_TEXT_PRESET";

export function updateReading(payload) {
    return { type: UPDATE_READING, payload };
}

export function updateGlobalPreferences(payload) {
    return { type: UPDATE_GLOBAL_PREFERENCES, payload };
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

export function saveDefaults(payload) {
    return { type: SAVE_DEFAULTS, payload };
}

export function saveDrillPreset(drillName, preset) {
    console.debug('saveDrillPreset()', drillName, preset);
    return {
        type: SAVE_DRILL_PRESET,
        payload: {
            drill: drillName,
            preset: preset,
        },
    };
}

export function saveTextPreset(preset) {
    console.debug('saveTextPreset()', preset);
    return {
        type: SAVE_TEXT_PRESET,
        payload: {
            preset: preset,
        },
    };
}

export function deleteDrillPreset(drillName, presetName) {
    console.debug('deleteDrillPreset()', drillName, presetName);
    return {
        type: DELETE_DRILL_PRESET,
        payload: {
            drill: drillName,
            name: presetName,
        },
    };
}

export function deleteTextPreset(presetName) {
    console.debug('deleteTextPreset()', presetName);
    return {
        type: DELETE_TEXT_PRESET,
        payload: {
            name: presetName,
        },
    };
}

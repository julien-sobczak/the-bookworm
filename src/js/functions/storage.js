import * as library from './library';

export const tutorial = {
    id: 'content-static-tutorial',
    type: "static",
    description: {
        title: `The Bookworm Missing Manual`,
        author: "Julien Sobczak",
    },
    content: {
        sections: [
            {
                title: "Presentation",
                blocks: [
                    { tag: "h2", content: "Presentation" },
                    { tag: "p", content: "The Bookworm was created to help you practice speed reading." },
                ],
            },
            {
                title: "How it works?",
                blocks: [
                    { tag: "h2", content: "How it works?" },
                    { tag: "p", content: "The Bookworm works in your browser. It is regularly testing with Chrome and Firefox, and should work with your tablet or your computer. Phones are not supported as the screen is too small for most drills." },
                ],
            }
            // TODO
        ],
    },
    reloadable: false,
    saveOnLocalStorage: false,
};

export function storeContent(content) {
    if (!content) return; // Happens at load time
    const id = content.id;
    if (content.saveOnLocalStorage === false) return;
    localStorage.setItem(id, JSON.stringify(content));
}

export function retrieveContent(reading) {
    const id = reading.id;
    return JSON.parse(localStorage.getItem(id));
}

export function reloadContent(reading, onLoad) {
    if (!localStorage.getItem(reading.id)) {
        // Content has disappeared from local storage.
        if (reading.reloadable) {
            console.log('Downloading previous content as missing from localStorage...');
            library.downloadContent(reading.description).then(content => {
                storeContent(content)
                onLoad(content);
            });
        } else if (reading.id === 'content-static-tutorial') {
            onLoad(tutorial);
        } else {
            console.error("Unable to reload the previous reading");
        }
    } else {
        console.log('Retrieved previous reading from localStorage');
        onLoad(retrieveContent(reading));
    }
}

/**
 * Returns the values present in localStorage representing the locally saved contents.
 *
 * @return {Array} Contents in JSON
 */
export function getContents() {
    const contents = [];
    for (var key in localStorage) {
        if (!key.startsWith('content-')) continue;
        const rawContent = localStorage.getItem(key);
        const content = JSON.parse(rawContent);
        contents.push(content);
    }
    return contents;
}

/**
 * Returns the various metadata concerning contents locally saved in the localStorage.
 *
 * @return {Array} List of information about contents
 */
export function getContentsMetadata() {
    const contents = getContents();
    const metadata = [];

    contents.forEach(content => {
        const rawContent = localStorage.getItem(content.id);
        metadata.push({
            key: content.id, // TODO remove. Use id instead
            id: content.id,
            type: content.type,
            title: content.description.title,
            author: content.description.author,
            size: (new TextEncoder().encode(rawContent)).length,
        });
    });

    // Sort by size on disk
    metadata.sort((a, b) => new Date(a.size) > new Date(b.size) ? -1 : 1);
    return metadata;
}

/**
 * Creates a new backup from the current state and currently saved local contents.
 *
 * @param {Object} state The Redux state
 * @return {object} The JSON representation of the backup
 */
export function createBackup(state) {
    return {
        state: state,
        contents: getContents().filter(c => !c.reloadable),
        date: new Date(),
    };
}

/**
 * Restores a backup by reimporting the local content into the localStorage.
 * Returns the Redux state.
 *
 * @param {Object} backup The JSON representation of the backup
 * @return {Object} The Redux state
 */
export function restoreBackup(backup) {
    backup.contents.forEach(content => {
        storeContent(content);
    });
    return backup.state;
}
import React from 'react';

// See https://reactjs.org/docs/context.html#dynamic-context
export const ContentContext = React.createContext({

    /*
     * Content to speed read.
     * Example:
     * {
     *   id: <UID>, // Unique ID to reference the content easily
     *   type: book,
     *   description: {
     *     title:
     *     author:
     *   },
     *   content: {
     *     // Full content. Structure varies according the type
     *   },
     *   metadata: {}, // Optional
     *   toc: {}, // Optional
     * }
     */
    content: {},

    /**
     * Function to update the content with a new content.
     * The function accepts two parameters.
     *
     * @param {Object} content The new content value (same structure as above)
     */
    update: () => {},

    /**
     * Function to switch to a previously defined content.
     * The function accepts a unique argument, the content ID.
     *
     * @param {string} ID The content ID
     */
    toggle: () => {},

});

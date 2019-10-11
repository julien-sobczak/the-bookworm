import React from 'react';

// See https://reactjs.org/docs/context.html#dynamic-context
export const ContentContext = React.createContext({
    content: undefined,
    setContent: () => {},
});

# Developer Guide

## Introduction


## Implementation

### Games


### localStorage


### Library

The Library is accessible through the component `<PanelReading />`. The user can choose to continue a previous reading (retrieved from Redux), or switch to a new content through the component `<Library />`. There are many categories inside the library: books, copy-paste, Epub, etc. Each category is implemented by a different component (e.g., `LibraryBooks`), and all components expose the same attribute `onSelect` whose value follows the structure:

```
{
    id (string): <a unique identifier to identify this particular content> # `content-book-The-Adventures-of-Tom-Sawyer`
    type (string): <the kind of content> # `book`, `paste`, `epub`, ...
    description (object): <>
    content (object):
    metadata (object): # Maybe optional? TODO
}
```

In addition, we use a common format to represent the attribute `content` independently of its type. All components should parse the raw content and convert to this format (this way, the bookmark logic is easily implemented):

```
{
    sections: [
        {
            title: "Chapter 1",
            blocks: [
                { tag: "h2", "Chapter 1" },
                { tag: "p", "Once upon a time, in a land of magic and adventure, a young girl called..." },
            ],
        }
        // more sections
    ]
}
```

We update the Redux store after each reading to update the position of the reader in the content (i.e, bookmark). We identify the position using two indices: the section index, and the block index:

```
{
    position: {
        section: 0,
        block: 1, # "Once upon a time..."
    }
}
```

A reading session always corresponds to a given section. If a section was interrupted before the end, we resume the reading to the previous position until the end of the section (even if there remain only a few paragraphs). The function `next` in `library.js` is used to calculate the list of blocks to read for a drill session.




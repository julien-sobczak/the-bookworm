```
Reading
  - update current reading
  - load book & metadata into localStorage (if not present)
  - load next chapter into content

Book
  - update current reading
  - load book & metadata into localStorage (if not present)
  - load next chapter into content

Copy Paste
  - update current reading
  - load content into localStorage
  - copy all into content

Upload
  - update current reading
  - load content into localStorage (if not present)
  - copy next chapter into content

<ContentProvider>

</ContentProvider>


App.js
loadCurrentReading() => {
    check current reading
    check local LocalStorage (load if not present)
    copy next chapter into content
}



reading {

    "localStorage": ""
}

LocalStorage
- book-slug {
    title
    metadata
    position
    content
}
- copypaste-slug {
    title
    position
    content
}
- upload-slug {
    title
    metadata
    position
    content
}
```
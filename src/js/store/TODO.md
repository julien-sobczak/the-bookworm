```
Reading
  onSelect(
    {
      description:
      content:
      metadata:
      position:
    }
  )

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


App.update({description, content, metadata, position}) {
  localStorage.setItem(description.slug, content)
  setState({
    description: description
    content: content,
    metadata: metadata,
    selection: library.next(content),
  })
  updateReading({
    ...description,
    position: position,
  })

}


App.js
loadCurrentReading() => {
    check current reading
    check local LocalStorage (load if not present)
    copy next chapter into content

    update({ description, content, metadata, selection })
}


LocalStorage
- book-slug {
    metadata
    content
}
- copypaste-slug {
    metadata
    content
}
- upload-slug {
    metadata
    content
}
```


Library
- choose a new content
  -> onSelect ({
      type: book
      description:
      content:  # See if it's better to parse the content and remove the metadata
      metadata: ???
      toc: ???
  }, {
      saveOnLocalStorage: true|false
      reloadable: true
  })
  => Should appear in you're reading
  ContentProvider => init with last reading at load time
                  => updated by new selection when library selection

- switch to existing reading
  -> onSwitch({

  })
  - read from localStorage or reload
  - update ContentProvider (no need to update readings)


content-context.js
  {
    type: book
    description:
    content:
    toc: (optional)
  }
  update(content /* see onSelect above */, options /* see onSelect above */)
    manageLocalStorage (insert)
    setContent
  switch(ID)
    manageLocalStorage (reread or reload)
    setContent


- end game
  # NOTE: During game, no need to update the ContentProvider, Only use Redux to update state.
  -> onPracticeEnd ({
    updateReading(ID, newPosition) # For content-based games only
    updateHistory(drillName, newSession) # For all games
  })


TODO options are not very useful in fact....
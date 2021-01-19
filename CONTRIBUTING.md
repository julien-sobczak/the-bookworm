# Contributing to *The Bookworm*

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

The following is a set of guidelines for contributing to the project. These are mostly personal guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.


### Design Decisions

I created *The Bookworm* on my spare time to practice speed reading. Drills are inspired by various books on the subject.

I adopt a minimalist approach. Code is written in JavaScript using a short list of dependencies: React, Styled-components, and MUI. I don't use frontend technologies in my daily work as a professional programmer, and I don't want to spend too much time fixing dependency issues or rereading the documentation of a large number of libraries.

Similarly, I tried to design the UI using an intemporal style, to not be tempted to revise it too often.


## Styleguides

This project is small and I am not an expert on Frontend development. The following is the guidelines I try to follow. Nothing is set on stone.

### Git Commit Messages

* Use the **present tense** ("Add feature" not "Added feature")
* Use the **imperative mood** ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to **72 characters or less**.

### React

I try to use a minimalist approach to React development too:

* I use **functional components when possible**. But the project was started when React hooks were not available. You will find class and functional components.
* I use **only Jest** for automated testing. I try to keep the number of tests small (tests is code and code must be maintained).
* I do not use Cypress for integration testing. I tested it but I finally conclude that it would add too much complexity for me.
* I use a global CSS stylesheet and use styled-components for components specific rules.
* I use the **`localStorage` to save settings and sessions history**. No server exposing an API is required. It considerably makes things easier, especially concerning the hosting solutions. The biggest downside is it prevents to implement social features like gamification with friends. I don't think it's bad. Deliberate practice must be done alone after all.
* I use **Redux to manage the `localStorage`**. I try to use Redux only on top-level components and on only a few of them.

### JavaScript

* I use the default configuration of `create-react-app` to enforce conventions/linter/etc.
* I try to use syntaxes from **latest JavaScript versions**. The application is free and the fact is I haven't time to test older browsers.

## Ready?

Why not reading the [Developer Guide](./DEVELOPER.md) to learn how the code is organized.

Thanks! ❤️ ❤️ ❤️

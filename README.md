<p align="center">
  <p align="center">
    <a href="https://julien-sobczak.github.io/the-bookworm/" target="_blank">
      <img src="https://raw.githubusercontent.com/julien-sobczak/the-bookworm/master/src/images/logo.svg" alt="The Bookworm" height="72">
    </a>
  </p>
</p>

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![Website](https://img.shields.io/website-up-down-green-red/https/julien-sobczak.github.io/the-bookworm.svg)](https://julien-sobczak.github.io/the-bookworm/) [![GitHub Actions Status](https://github.com/julien-sobczak/the-bookworm/workflows/CI/badge.svg)](https://github.com/julien-sobczak/the-bookworm/actions) [![GitHub issues](https://img.shields.io/github/issues/julien-sobczak/the-bookworm.svg)](https://github.com/julien-sobczak/the-bookworm/issues/) [![GitHub pull-requests](https://img.shields.io/github/issues-pr/julien-sobczak/the-bookworm.svg)](https://github.com/julien-sobczak/the-bookworm/pull/) [![Hit Count](http://hits.dwyl.com/julien-sobczak/the-bookworm.svg)](http://hits.dwyl.com/julien-sobczak/the-bookworm)

----

## What's The Bookworm?

The Bookworm is a web application to practice spead reading.

<p align="center">
  <a href="https://raw.githubusercontent.com/julien-sobczak/the-bookworm/master/src/images/screenshot-drill-horizontal.png" target="_blank"><img src="https://raw.githubusercontent.com/julien-sobczak/the-bookworm/master/src/images/screenshot-drill-horizontal.png" width="290"></a>
  <a href="https://raw.githubusercontent.com/julien-sobczak/the-bookworm/master/src/images/screenshot-drill-circle.png" target="_blank"><img src="https://raw.githubusercontent.com/julien-sobczak/the-bookworm/master/src/images/screenshot-drill-circle.png" width="290"></a>
  <a href="https://raw.githubusercontent.com/julien-sobczak/the-bookworm/master/src/images/screenshot-drill-chunk.png" target="_blank"><img src="https://raw.githubusercontent.com/julien-sobczak/the-bookworm/master/src/images/screenshot-drill-chunk.png" width="290"></a>
  <a href="https://raw.githubusercontent.com/julien-sobczak/the-bookworm/master/src/images/screenshot-drill-page.png" target="_blank"><img src="https://raw.githubusercontent.com/julien-sobczak/the-bookworm/master/src/images/screenshot-drill-page.png" width="290"></a>
</p>

The application uses [React](https://github.com/facebook/react) and is written in JavaScript.

## Download

The Bookworm is a progressive web application. No download or installation is required. Browse to https://the-bookworm.web.app/ using a modern browser (the application was developed using Chrome).

You may also add the application to your home screen. (Check your [browser documentation](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DDesktop&hl=fr) to find out how to install a progressive application.) This step is optional.

## Have a bug or a feature request?

First, search for existing and closed issues. If your problem or idea is not addressed yet, please [open a new issue](https://github.com/julien-sobczak/the-bookworm/issues).

## Contributing

Please read through the [contributing guidelines](CONTRIBUTING.md) which includes explanations about coding standards, and notes on development.

## Developing

Development can be done on Mac, Windows, or Linux as long as you have
[NodeJS](https://nodejs.org) and [Git](https://git-scm.com/).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Clone the project and run the command `npm install`.

<details>
<summary>Available Scripts</summary>

In the project directory, you can run:

### Runs the app in the development mode.

```bash
$ npm start
````

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

### Launches the test runner in the interactive watch mode.

```bash
$ npm test
```

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Builds the app for production to the `build` folder.

```bash
$ npm run build
```

It correctly bundles React in production mode and optimizes the build for the best performance.
</details>


## Deploying

The project's main branch is automatically deployed to [Firebase](https://firebase.google.com/) using GitHub Actions (see `.github/` directory)

<details>
<summary>Manual deployment</summary>

To deploy manually (not recommended):

```bash
$ firebase login
# Create a project from the console first https://console.firebase.google.com
$ firebase init
# Choose build/ instead of public/
$ npm run build
$ firebase deploy
```

Browse to: https://the-bookworm.web.app/
</details>



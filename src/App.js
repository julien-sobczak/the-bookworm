import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import { updateReading } from './js/store/actions';

import VisionSpanCatalog from './js/components/vision-span/Catalog';
import GameHorizontal from './js/components/vision-span/horizontal/Game';
import GamePyramid from './js/components/vision-span/pyramid/Game';
import GameCircle from './js/components/vision-span/circle/Game';
import GameSchulte from './js/components/vision-span/schulte/Game';

import ChunkingCatalog from './js/components/chunking/Catalog';
import GameChunk from './js/components/chunking/chunk/Game';
import GameColumn from './js/components/chunking/column/Game';
import GamePage from './js/components/chunking/page/Game';

import PracticeCatalog from './js/components/practice/Catalog';
import BookViewer from './js/components/library/BookViewer';

import * as library from './js/functions/library';

import { ContentContext } from './content-context';

import SettingsPreferences from './js/components/settings/Preferences';

import 'normalize.css';
import './Reset.css';
import './App.css';

function IndexPage() {
  return (
    <section id="Home" className="page home">
      <h2>Home</h2>
    </section>
  );
}

function VisionSpanSelector({ match }) {
  const drills = {
    'drill-horizontal': <GameHorizontal />,
    'drill-pyramid': <GamePyramid />,
    'drill-circle': <GameCircle />,
    'drill-schulte': <GameSchulte />,
  }

  if (match.params.drill in drills) {
    return drills[match.params.drill]
  } else {
    return <h3>Drill not found</h3>
  }
}

function VisionSpanPage({ match }) {
  return (
    <section id="VisionSpan" className="page vision-span">
      <h2>Vision Span</h2>

      <Route path={`${match.path}`} exact component={VisionSpanCatalog} />
      <Route path={`${match.path}:drill`} component={VisionSpanSelector} />

    </section>
  );
}

function ChunkingPage({ match }) {
  return (
    <section id="Chunking" className="page chunking">
      <h2>Chunking</h2>

      <Route path={`${match.path}`} exact component={ChunkingCatalog} />
      <Route path={`${match.path}:drill`} component={ChunkingSelector} />

    </section>
  );
}

function ChunkingSelector({ match }) {
  const drills = {
    'drill-page': <GamePage />,
    'drill-chunk': <GameChunk />,
    'drill-column': <GameColumn />,
  }

  if (match.params.drill in drills) {
    return drills[match.params.drill];
  } else {
    return <h3>Drill not found</h3>
  }
}

function PracticePage({ match }) {
  return (
    <section id="Practice" className="page practice">
      <h2>Practice</h2>

      <Route path={`${match.path}`} exact component={PracticeCatalog} />
      <Route path={`${match.path}:drill`} component={PracticeSelector} />

    </section>
  );
}

function PracticeSelector({ match }) {
  const drills = {
    'book-viewer': <BookViewer />,
  }

  if (match.params.drill in drills) {
    return drills[match.params.drill];
  } else {
    return <h3>Drill not found</h3>
  }
}

function SettingsPage() {
  return (
    <section id="About" className="page settings">
      <h2>Settings</h2>
      <SettingsPreferences />
    </section>
  );
}

function AboutPage() {
  return (
    <section id="About" className="page about">
      <h2>About</h2>
    </section>
  );
}


class App extends React.Component {

  constructor(props) {
    super(props);

    // Implement content-context.js

    this.updateContent = (content) => {
      console.log(`New content is ${content.description.title}`);

      if (content.saveOnLocalStorage || true) {
        console.log('Save!');
        App.storeContent(content);
      }

      this.setState(state => ({
        content: content,
      }));
    };

    this.toggleContent = (reading) => {
      console.log(`Toggle content with ${reading.description.title}`);
      App.reloadContent(reading, (content) => this.updateContent(content));
    }

    this.state = {
      content: {},
      update: this.updateContent,
      toggle: this.toggleContent,
    };
  }

  render() {
    return (
      <ContentContext.Provider value={this.state}>
        <Router>
          <nav className="menu">
            <NavLink to="/" activeClassName="active" exact><div><i className="material-icons">home</i> Home</div></NavLink>
            {/* The attribute `exact` prevent this link to have the activeClassName set for every URL starting with / */}
            <NavLink to="/vision-span/" activeClassName="active"><div><i className="material-icons">visibility</i> Vision Span</div></NavLink>
            <NavLink to="/chunking/"    activeClassName="active"><div><i className="material-icons">view_module</i> Chunking</div></NavLink>
            <NavLink to="/practice/"    activeClassName="active"><div><i className="material-icons">fitness_center</i> Practice</div></NavLink>
            <NavLink to="/settings/"    activeClassName="active"><div><i className="material-icons">build</i> Settings</div></NavLink>
            <NavLink to="/about/"       activeClassName="active"><div><i className="material-icons">info</i> About</div></NavLink>
          </nav>
          <section id="content">
            <Route path="/"       exact component={IndexPage} />
            <Route path="/vision-span/" component={VisionSpanPage} />
            <Route path="/chunking/"    component={ChunkingPage} />
            <Route path="/practice/"    component={PracticePage} />
            <Route path="/settings/"    component={SettingsPage} />
            <Route path="/about/"       component={AboutPage} />
          </section>
        </Router>
      </ContentContext.Provider>
    );
  }

  componentDidMount() {
    if (this.props.readings.length > 0) {
      const currentReading = this.props.readings[0];
      App.reloadContent(currentReading, (content) => this.updateContent(content));
    }
  }


  /*
   * localStorage management
   */

  static storeContent(content) {
    if (!content) return; // Happens at load time
    const id = content.id;
    localStorage.setItem(id, JSON.stringify(content));
  }

  static retrieveContent(reading) {
    const id = reading.id;
    return JSON.parse(localStorage.getItem(id));
  }

  static reloadContent(reading, onLoad) {
    if (!localStorage.getItem(reading.id)) {
      // Content has disappeared from local storage.
      if (reading.reloadable) {
        console.log('Downloading previous content as missing from localStorage...');
        library.downloadContent(reading.description).then(content => {
          App.storeContent(content)
          onLoad(content);
        });
      } else {
        console.error("Unable to reload the previous reading");
      }
    } else {
      console.log('Retrieved previous reading from localStorage');
      onLoad(App.retrieveContent(reading));
    }
  }

}

const mapStateToProps = state => {
  return {
      readings: state.readings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
      updateReading: reading => dispatch(updateReading(reading)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
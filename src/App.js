import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import { updateReading } from './js/store/actions';

import Profile from './js/components/home/Profile';

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
import GameFree from './js/components/practice/GameFree';
import GamePacer from './js/components/practice/GamePacer';
import GameStopWatch from './js/components/practice/GameStopWatch';

import * as storage from './js/functions/storage';

import { ContentContext } from './content-context';

import SettingsPreferences from './js/components/settings/Preferences';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import 'normalize.css';
import './App.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#000000",
        },
        secondary: {
            main: "#ffffff",
        },
    },
});

function IndexPage() {
    return (
        <section id="Home" className="page home">
            <Profile />
        </section>
    );
}

function VisionSpanSelector({ match }) {
    const drills = {
        'drill-horizontal': <GameHorizontal />,
        'drill-pyramid': <GamePyramid />,
        'drill-circle': <GameCircle />,
        'drill-schulte': <GameSchulte />,
    };

    if (match.params.drill in drills) {
        return drills[match.params.drill];
    } else {
        return <h3>Drill not found</h3>;
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
VisionSpanPage.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
};

function ChunkingPage({ match }) {
    return (
        <section id="Chunking" className="page chunking">
            <h2>Chunking</h2>

            <Route path={`${match.path}`} exact component={ChunkingCatalog} />
            <Route path={`${match.path}:drill`} component={ChunkingSelector} />

        </section>
    );
}
ChunkingPage.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
};

function ChunkingSelector({ match }) {
    const drills = {
        'drill-page': <GamePage />,
        'drill-chunk': <GameChunk />,
        'drill-column': <GameColumn />,
        'tutorial': <GamePage content={storage.tutorial} configurable={false} />
    };

    if (match.params.drill in drills) {
        return drills[match.params.drill];
    } else {
        return <h3>Drill not found</h3>;
    }
}
ChunkingSelector.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
};

function PracticePage({ match }) {
    return (
        <section id="Practice" className="page practice">
            <h2>Practice</h2>

            <Route path={`${match.path}`} exact component={PracticeCatalog} />
            <Route path={`${match.path}:drill`} component={PracticeSelector} />

        </section>
    );
}
PracticePage.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
};

function PracticeSelector({ match }) {
    const drills = {
        'free': <GameFree />,
        'pacer': <GamePacer />,
        'stopwatch': <GameStopWatch />,
    };

    if (match.params.drill in drills) {
        return drills[match.params.drill];
    } else {
        return <h3>Drill not found</h3>;
    }
}
PracticeSelector.propTypes = {
    match: PropTypes.objectOf(PropTypes.any),
};

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

            if (content.saveOnLocalStorage) {
                storage.storeContent(content);
            }

            this.setState(() => ({
                content: content,
            }));
        };

        this.toggleContent = (reading) => {
            console.log(`Toggle content with ${reading.description.title}`);
            storage.reloadContent(reading).then((content) => this.updateContent(content));
        };

        this.state = {
            content: {},
            update: this.updateContent,
            toggle: this.toggleContent,
        };

        // Apply global settings
        if (window && window.document) {
            console.log(`Defining length calibration to ${this.props.preferences.global.displayScale}`);
            document.documentElement.style.setProperty('--scale', this.props.preferences.global.displayScale);
        }
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <ContentContext.Provider value={this.state}>
                    <div id="ScreenTooSmall"></div>
                    {this.state.content.content && <Router>
                        <nav className="menu">
                            <NavLink to="/home" activeClassName="active" exact><div><i className="material-icons">home</i><br/>Home</div></NavLink>
                            {/* The attribute `exact` prevent this link to have the activeClassName set for every URL starting with / */}
                            <NavLink to="/vision-span/" activeClassName="active"><div><i className="material-icons">visibility</i><br/>Vision Span</div></NavLink>
                            <NavLink to="/chunking/"    activeClassName="active"><div><i className="material-icons">view_module</i><br/>Chunking</div></NavLink>
                            <NavLink to="/practice/"    activeClassName="active"><div><i className="material-icons">fitness_center</i><br/>Practice</div></NavLink>
                            <NavLink to="/settings/"    activeClassName="active"><div><i className="material-icons">build</i><br/>Settings</div></NavLink>
                            {/* Uncomment this line to add an "About" page */}
                            {/* <NavLink to="/about/"       activeClassName="active"><div><i className="material-icons">info</i> About</div></NavLink> */}
                        </nav>
                        <section id="content">
                            <Route path="/home"   exact component={IndexPage} />
                            <Route path="/vision-span/" component={VisionSpanPage} />
                            <Route path="/chunking/"    component={ChunkingPage} />
                            <Route path="/practice/"    component={PracticePage} />
                            <Route path="/settings/"    component={SettingsPage} />
                            <Route path="/about/"       component={AboutPage} />
                        </section>
                    </Router>}
                </ContentContext.Provider>
            </ThemeProvider>
        );
    }

    componentDidMount() {
        if (this.props.readings.length > 0) {
            const currentReading = this.props.readings[0];
            storage.reloadContent(currentReading).then((content) => this.updateContent(content));
        } else {
            this.updateContent(storage.tutorial);
        }
    }

}
App.propTypes = {
    readings: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    preferences: PropTypes.objectOf(PropTypes.any),
};

const mapStateToProps = state => {
    return {
        readings: state.readings,
        preferences: state.preferences,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateReading: reading => dispatch(updateReading(reading)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

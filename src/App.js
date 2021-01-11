import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, NavLink, useHistory } from "react-router-dom";

import { updateReading, updateGlobalPreferences, completeTutorial } from './js/store/actions';

import Tutorial from './js/components/tutorial/Tutorial';
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
import GameFree from './js/components/practice/free/Game';
import GamePacer from './js/components/practice/pacer/Game';
import GameStopWatch from './js/components/practice/stopwatch/Game';

import * as storage from './js/functions/storage';

import { ContentContext } from './content-context';

import SettingsPreferences from './js/components/settings/Preferences';

import ScreenTester from './js/components/toolbox/ScreenTester';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import HomeIcon from '@material-ui/icons/Home';
import VisionSpanIcon from '@material-ui/icons/Visibility';
import ChunkingIcon from '@material-ui/icons/ViewModule';
import PracticeIcon from '@material-ui/icons/FitnessCenter';
import PreferencesIcon from '@material-ui/icons/Settings';

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

function TutorialPage() {
    let history = useHistory();
    return (
        <Tutorial onDone={() => history.push('/home')} />
    );
}

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
            document.documentElement.style.setProperty('--scale', this.props.preferences.global.displayScale / 100.0);
        }

        this.handleTutorialCompleted = this.handleTutorialCompleted.bind(this);
    }

    handleTutorialCompleted() {
        this.props.completeTutorial();
        // TODO save Global preferences
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <ContentContext.Provider value={this.state}>
                    <ScreenTester minWidth="5in" minHeight="5in" />
                    {!this.props.tutorialCompleted && <Tutorial onDone={this.handleTutorialCompleted} />}
                    {this.props.tutorialCompleted && this.state.content.content && <Router>
                        <nav className="menu">
                            <NavLink to="/home" activeClassName="active" exact><div><HomeIcon /><br/>Home</div></NavLink>
                            {/* The attribute `exact` prevent this link to have the activeClassName set for every URL starting with / */}
                            <NavLink to="/vision-span/" activeClassName="active"><div><VisionSpanIcon /><br/>Vision Span</div></NavLink>
                            <NavLink to="/chunking/"    activeClassName="active"><div><ChunkingIcon /><br/>Chunking</div></NavLink>
                            <NavLink to="/practice/"    activeClassName="active"><div><PracticeIcon /><br/>Practice</div></NavLink>
                            <NavLink to="/settings/"    activeClassName="active"><div><PreferencesIcon /><br/>Settings</div></NavLink>
                            {/* <NavLink to="/about/"       activeClassName="active"><div><AboutIcon /><br/>About</div></NavLink> */}
                        </nav>
                        <section id="content">
                            <Route path="/"         exact component={IndexPage} />
                            <Route path="/tutorial" exact component={TutorialPage} />
                            <Route path="/home"     exact component={IndexPage} />
                            <Route path="/vision-span/"   component={VisionSpanPage} />
                            <Route path="/chunking/"      component={ChunkingPage} />
                            <Route path="/practice/"      component={PracticePage} />
                            <Route path="/settings/"      component={SettingsPage} />
                            <Route path="/about/"         component={AboutPage} />
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
    // Redux
    tutorialCompleted: PropTypes.bool,
    readings: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    preferences: PropTypes.objectOf(PropTypes.any),
    updateReading: PropTypes.func,
    updateGlobalPreferences: PropTypes.func,
    completeTutorial: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        tutorialCompleted: state.tutorialCompleted,
        readings: state.readings,
        preferences: state.preferences,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateReading: reading => dispatch(updateReading(reading)),
        updateGlobalPreferences: prefs => dispatch(updateGlobalPreferences(prefs)),
        completeTutorial: () => dispatch(completeTutorial({})),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

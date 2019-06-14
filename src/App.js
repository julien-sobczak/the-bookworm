import React from "react";
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";

import PracticeWizard from './drills/PracticeWizard'

import VisionSpanDrill from './drills/VisionSpanDrill'
import VisionSpanDrill2 from './drills/VisionSpanDrill2'
import VisionSpanDemo from './drills/VisionSpanDemo'

import ChunkingDrill from './chunks/ChunkingDrill'

import Card, {
  CardPrimaryContent,
  CardActions,
  CardActionButtons,
  CardActionIcons
} from "@material/react-card";
import Button from "@material/react-button";

import 'normalize.css'
import './Reset.css';
import './App.css';
import '@material/react-card/dist/card.css';

function IndexPage() {
  return (
    <section className="page home">
      <h2>Home</h2>
    </section>
  );
}

class VisionSpanCatalog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      autoplayDemoCustom: false,
    }

    this.customDrillDemo = React.createRef();

    this.toggleDemoCustom = this.toggleDemoCustom.bind(this);
  }

  toggleDemoCustom() {
    this.setState(state => ({
      ...state,
      autoplayDemoCustom: !state.autoplayDemoCustom,
    }))
  }

  render() {
    const match = this.props.match;
    return (
      <div className="Catalog">

        <Card>
          <CardPrimaryContent className="NoRipple">
            <h1>Custom Drill</h1>
            <VisionSpanDemo ref={this.customDrillDemo} controls autoplay={this.state.autoplayDemoCustom} />
          </CardPrimaryContent>

          <CardActions>
            <CardActionButtons>
              <Link to={`${match.url}/drill-letter-easy`}>
                <Button raised icon={<i className="material-icons">play_arrow</i>}>Try!</Button>
              </Link>
              <Button icon={<i className="material-icons">{this.state.autoplayDemoCustom ? 'pause_arrow' : 'play_arrow'}</i>} onClick={this.toggleDemoCustom}>Demo</Button>
            </CardActionButtons>

            <CardActionIcons>
              <i className="material-icons">history</i>
            </CardActionIcons>
          </CardActions>
        </Card>

        <Card>
          <CardPrimaryContent className="NoRipple">
            <h1>Drill Letter Easy</h1>
          </CardPrimaryContent>

          <CardActions>
            <CardActionButtons>
              <Link to={`${match.url}/drill-letter-intermediate`}>
                <Button raised>Try!</Button>
              </Link>
            </CardActionButtons>

            <CardActionIcons>
              <i className="material-icons">history</i>
            </CardActionIcons>
          </CardActions>
        </Card>

      </div>
    );
  }
}

function VisionSpanPage({match}) {

  return (
    <section className="page vision-span">
      <h2>Vision Span</h2>

      <Route path={`${match.path}/`} exact component={VisionSpanCatalog} />
      <Route path={`${match.path}/:drill`} component={VisionSpanSelector} />

    </section>
  );
}

function ChunkingPage() {
  // TODO use the same logic as for VisionSpanDrills
  return (
    <section className="page chunking">
      <h2>Chunking</h2>
      <ChunkingDrill/>
    </section>
  );
}

function PracticePage() {
  return (
    <section className="page practice">
      <h2>Practice</h2>

      <PracticeWizard/>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="page about">
      <h2>About</h2>
    </section>
  );
}

function VisionSpanSelector({ match }) {
  if (match.params.drill === 'drill-letter-easy') {
    return (
      <VisionSpanDrill type="letter" span="1in" />
    );
  } else if (match.params.drill === 'drill-letter-intermediate') {
    return (
      // <VisionSpanDrill2 multiple={false} columns="3" fontFamily="Roboto" fontSize="12pt" spans={["2in"]} />
      //<VisionSpanDrill2 multiple={true} lines="1" columns="5" fontFamily="Roboto" fontSize="18pt" spans={["1in", "0.5in"]} />
      <VisionSpanDrill2 multiple={true} lines="2" columns="5" fontFamily="SourceCodePro" fontSize="18pt" fontStyle="bold italic" spans={["1in", "0.5in"]} autoLevel={true} />
    );
  } else {
    return (
      <section className="drill">
        <h3>Drill Letter Intermediate</h3>
      </section>
    );
  }
}

function AppRouter() {
  return (
    <Router>
      <nav className="menu">
        <NavLink to="/" activeClassName="active" exact><div><i className="material-icons">home</i> Home</div></NavLink>
        {/* The attribute `exact` prevent this link to have the activeClassName set for every URL starting with / */}
        <NavLink to="/vision-span/" activeClassName="active"><div><i className="material-icons">visibility</i> Vision Span</div></NavLink>
        <NavLink to="/chunking/"    activeClassName="active"><div><i className="material-icons">view_module</i> Chunking</div></NavLink>
        <NavLink to="/practice/"    activeClassName="active"><div><i className="material-icons">fitness_center</i> Practice</div></NavLink>
        <NavLink to="/about/"       activeClassName="active"><div><i className="material-icons">info</i> About</div></NavLink>
      </nav>
      <section id="content">
        <Route path="/"       exact component={IndexPage} />
        <Route path="/vision-span/" component={VisionSpanPage} />
        <Route path="/chunking/"    component={ChunkingPage} />
        <Route path="/practice/"    component={PracticePage} />
        <Route path="/about/"       component={AboutPage} />
      </section>
    </Router>
  );
}

export default AppRouter;
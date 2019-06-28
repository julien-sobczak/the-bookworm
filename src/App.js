import React from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import PracticeWizard from './spike/PracticeWizard'

import VisionSpanDrill from './vision-span/Drill'
import VisionSpanCatalog from './vision-span/Catalog'

import ChunkingDrill from './chunking/Drill'


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

function VisionSpanSelector({ match }) {
  const drills = {
    'drill-letter-easy': <VisionSpanDrill multiple={false} columns={3} fontFamily="Roboto" fontSize="12pt" spans={["1in"]} />,
    'drill-letter-intermediate': <VisionSpanDrill multiple={true} lines={2} columns={5} fontFamily="SourceCodePro" fontSize="18pt" fontStyle="bold italic" spans={["1in", "0.5in"]} autoLevel={true} />
  }
  // Other examples:
  //   <VisionSpanDrill multiple={false} columns="3" fontFamily="Roboto" fontSize="12pt" spans={["2in"]} />
  //   <VisionSpanDrill multiple={true} lines="1" columns="5" fontFamily="Roboto" fontSize="18pt" spans={["1in", "0.5in"]} />

  if (match.params.drill in drills) {
    return drills[match.params.drill];
  } else {
    return (
      <section className="drill">
        <h3>Drill Letter Intermediate</h3>
      </section>
    );
  }
}

function VisionSpanPage({ match }) {
  return (
    <section className="page vision-span">
      <h2>Vision Span</h2>

      <Route path={`${match.path}/`} exact component={VisionSpanCatalog} />
      <Route path={`${match.path}/:drill`} component={VisionSpanSelector} />

    </section>
  );
}

function ChunkingPage() {
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
import React from "react";
import PropTypes from 'prop-types';

import { Entry, Drawing, DrillOutline, LetterOutline, GridOutline, CellOutline } from '../core/CatalogUI';

function DrawingHorizontal() {
    return (
        <Drawing>
            <DrillOutline>
                <LetterOutline style={{height: "2em", width: "2em", marginRight: "3em"}} />
                <LetterOutline selected style={{width: "2em"}} />
                <LetterOutline style={{width: "2em", marginLeft: "3em"}} />
                <br/>
                <LetterOutline style={{width: "2em", marginRight: "3em"}} />
                <LetterOutline selected style={{width: "2em"}} />
                <LetterOutline style={{width: "2em", marginLeft: "3em"}} />
                <br/>
                <LetterOutline style={{width: "2em", marginRight: "3em"}} />
                <LetterOutline selected style={{width: "2em"}} />
                <LetterOutline style={{width: "2em", marginLeft: "3em"}} />
            </DrillOutline>
        </Drawing>
    );
}

function DrawingCircle() {
    // See Drill Circle for details
    const angleDegree = 45;
    const angleRadian = angleDegree * Math.PI / 180;
    const span = "0.65in";
    const x = parseFloat(span) * Math.cos(angleRadian);
    const y = parseFloat(span) * Math.sin(angleRadian);

    return (
        <Drawing style={{position: "relative", marginTop: "-1.5em", marginLeft: "-2em"}}>
            {/* We should move the drawing up and left to recenter */}
            <LetterOutline selected style={{ position: "absolute", left: `50%`, top: `50%` }} />
            <LetterOutline style={{ position: "absolute", left: `50%`, top: `calc(50% - ${span})` }} />
            <LetterOutline style={{ position: "absolute", left: `calc(50% + ${x}in)`, top: `calc(50% - ${y}in)` }} />
            <LetterOutline style={{ position: "absolute", left: `calc(50% + ${span})`, top: `50%` }} />
            <LetterOutline style={{ position: "absolute", left: `calc(50% + ${x}in)`, top: `calc(50% + ${y}in)` }} />
            <LetterOutline style={{ position: "absolute", left: `50%`, top: `calc(50% + ${span})` }} />
            <LetterOutline style={{ position: "absolute", left: `calc(50% - ${x}in)`, top: `calc(50% + ${y}in)` }} />
            <LetterOutline style={{ position: "absolute", left: `calc(50% - ${span})`, top: `50%` }} />
            <LetterOutline style={{ position: "absolute", left: `calc(50% - ${x}in)`, top: `calc(50% - ${y}in)` }} />
        </Drawing>
    );
}

function DrawingPyramid() {
    return (
        <Drawing>
            <DrillOutline style={{ textAlign: "center" }}>
                <LetterOutline style={{width: "2em", marginRight: "0.5em"}} />
                <LetterOutline selected style={{width: "2em"}} />
                <LetterOutline style={{width: "2em", marginLeft: "0.5em"}} />
                <br/>
                <LetterOutline style={{width: "2em", marginRight: "1.5em"}} />
                <LetterOutline selected style={{width: "2em"}} />
                <LetterOutline style={{width: "2em", marginLeft: "1.5em"}} />
                <br/>
                <LetterOutline style={{width: "2em", marginRight: "2.5em"}} />
                <LetterOutline selected style={{width: "2em"}} />
                <LetterOutline style={{width: "2em", marginLeft: "2.5em"}} />
                <br/>
                <LetterOutline style={{width: "2em", marginRight: "3.5em"}} />
                <LetterOutline selected style={{width: "2em"}} />
                <LetterOutline style={{width: "2em", marginLeft: "3.5em"}} />
            </DrillOutline>
        </Drawing>
    );
}

function DrawingSchulte() {
    return (
        <Drawing>
            <GridOutline>
                <CellOutline />
                <CellOutline />
                <CellOutline />
                <br/>
                <CellOutline />
                <CellOutline selected />
                <CellOutline />
                <br/>
                <CellOutline />
                <CellOutline />
                <CellOutline />
            </GridOutline>
        </Drawing>
    );
}

function Catalog({match}) {

    return (
        <div className="Catalog">

            <Entry name="Horizontal" slug="drill-horizontal" match={match}>
                <DrawingHorizontal />
            </Entry>

            <Entry name="Circle" slug="drill-circle" match={match}>
                <DrawingCircle />
            </Entry>

            <Entry name="Pyramid" slug="drill-pyramid" match={match}>
                <DrawingPyramid />
            </Entry>

            <Entry name="Schulte Table" slug="drill-schulte" match={match}>
                <DrawingSchulte />
            </Entry>

        </div>
    );
}

Catalog.propTypes = {
    match: PropTypes.object.isRequired,
};

export default Catalog;

import React from "react";
import { Link } from "react-router-dom";

import Button from "../toolbox/Button.js";

function Entry({ name, slug, children }) {
    return (
        <div className="Entry">
            <div className="Preview">
                {children}
            </div>
            <div className="Actions">
                <Link to={slug}>
                    <Button text={name} colorText="white" colorBackground="#111" />
                </Link>
            </div>
        </div>
    );
}

function DrawingHorizontal() {
    return (
        <div className="Drawing Centered">
            <div className="DrillOutline">
                <span className="ElementOutline LetterOutline" style={{height: "2em", width: "2em", marginRight: "3em"}}></span>
                <span className="ElementOutline LetterOutline ElementOutlineSelected" style={{width: "2em"}}></span>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginLeft: "3em"}}></span>
                <br/>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginRight: "3em"}}></span>
                <span className="ElementOutline LetterOutline ElementOutlineSelected" style={{width: "2em"}}></span>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginLeft: "3em"}}></span>
                <br/>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginRight: "3em"}}></span>
                <span className="ElementOutline LetterOutline ElementOutlineSelected" style={{width: "2em"}}></span>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginLeft: "3em"}}></span>
            </div>
        </div>
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
        <div className="Drawing Centered" style={{position: "relative", marginTop: "-1.5em", marginLeft: "-2em"}}>
            {/* We should move the drawing up and left to recenter */}
            <span className="ElementOutline LetterOutline ElementOutlineSelected" style={{ position: "absolute", left: `50%`, top: `50%` }}></span>
            <span className="ElementOutline LetterOutline" style={{ position: "absolute", left: `50%`, top: `calc(50% - ${span})` }}></span>
            <span className="ElementOutline LetterOutline" style={{ position: "absolute", left: `calc(50% + ${x}in)`, top: `calc(50% - ${y}in)` }}></span>
            <span className="ElementOutline LetterOutline" style={{ position: "absolute", left: `calc(50% + ${span})`, top: `50%` }}></span>
            <span className="ElementOutline LetterOutline" style={{ position: "absolute", left: `calc(50% + ${x}in)`, top: `calc(50% + ${y}in)` }}></span>
            <span className="ElementOutline LetterOutline" style={{ position: "absolute", left: `50%`, top: `calc(50% + ${span})` }}></span>
            <span className="ElementOutline LetterOutline" style={{ position: "absolute", left: `calc(50% - ${x}in)`, top: `calc(50% + ${y}in)` }}></span>
            <span className="ElementOutline LetterOutline" style={{ position: "absolute", left: `calc(50% - ${span})`, top: `50%` }}></span>
            <span className="ElementOutline LetterOutline" style={{ position: "absolute", left: `calc(50% - ${x}in)`, top: `calc(50% - ${y}in)` }}></span>
        </div>
    );
}

function DrawingPyramid() {
    return (
        <div className="Drawing Centered">
            <div className="DrillOutline" style={{ textAlign: "center" }}>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginRight: "0.5em"}}></span>
                <span className="ElementOutline LetterOutline ElementOutlineSelected" style={{width: "2em"}}></span>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginLeft: "0.5em"}}></span>
                <br/>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginRight: "1.5em"}}></span>
                <span className="ElementOutline LetterOutline ElementOutlineSelected" style={{width: "2em"}}></span>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginLeft: "1.5em"}}></span>
                <br/>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginRight: "2.5em"}}></span>
                <span className="ElementOutline LetterOutline ElementOutlineSelected" style={{width: "2em"}}></span>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginLeft: "2.5em"}}></span>
                <br/>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginRight: "3.5em"}}></span>
                <span className="ElementOutline LetterOutline ElementOutlineSelected" style={{width: "2em"}}></span>
                <span className="ElementOutline LetterOutline" style={{width: "2em", marginLeft: "3.5em"}}></span>
            </div>
        </div>
    );
}

function DrawingSchulte() {
    return (
        <div className="Drawing Centered">
            <div className="GridOutline">
                <span className="CellOutline"></span>
                <span className="CellOutline"></span>
                <span className="CellOutline"></span>
                <br/>
                <span className="CellOutline"></span>
                <span className="CellOutline ElementOutlineSelected"></span>
                <span className="CellOutline"></span>
                <br/>
                <span className="CellOutline"></span>
                <span className="CellOutline"></span>
                <span className="CellOutline"></span>
            </div>
        </div>
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

export default Catalog;
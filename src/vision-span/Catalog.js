import React, { useState } from "react";
import { Link } from "react-router-dom";

import ViewerHorizontal from './horizontal/Viewer';
import EngineHorizontal from './horizontal/Engine';
import ViewerCircle from './circle/Viewer';
import EngineCircle from './circle/Engine';
import ViewerPyramid from './pyramid/Viewer';
import EnginePyramid from './pyramid/Engine';
import ViewerSchulte from './schulte/Viewer';
import EngineSchulte from './schulte/Engine';

import MainButton from "../toolbox/MainButton.js";

function Entry({ name, slug, children }) {
    return (
        <div className="Entry">
            <div className="Preview">
                {children}
            </div>
            <div className="Actions">
                <Link to={slug}>
                    <MainButton text={name} colorText="white" colorBackground="#111" />
                </Link>
            </div>
        </div>
    );
}

function Catalog({match}) {

    const [drillHorizontal] = useState(new EngineHorizontal(2, 5, 3));
    const [drillCircle] = useState(new EngineCircle(15, 3));
    const [drillPyramid] = useState(new EnginePyramid(8));
    const [drillSchulte] = useState(new EngineSchulte(3));

    const styles = {
        color: "black",
        backgroundColor: "transparent",
        fontSize: "18pt",
        fontStyle: "bold",
    };

    return (
        <div className="Catalog">

            <Entry name="Horizontal Vision" slug="drill-horizontal" match={match}>
                <ViewerHorizontal drill={drillHorizontal.getDrill()} spans={["0.5in", "0.75in", "0.75in", "0.5in"]} {...styles} />
            </Entry>

            <Entry name="Circle" slug="drill-circle" match={match}>
                <ViewerCircle drill={drillCircle.getDrill()} span={"1in"} {...styles} />
            </Entry>

            <Entry name="Pyramid" slug="drill-pyramid" match={match}>
                <ViewerPyramid drill={drillPyramid.getDrill()} span={"1in"} {...styles} />
            </Entry>

            <Entry name="Schulte Table" slug="drill-schulte" match={match}>
                <ViewerSchulte drill={drillSchulte.getDrill()} span={"1in"} {...styles} />
            </Entry>

        </div>
    );
}

export default Catalog;
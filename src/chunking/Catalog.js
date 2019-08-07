import React from "react";
import { Link } from "react-router-dom";

import Viewer from './Viewer'

import Card, {
    CardPrimaryContent,
    CardActions,
    CardActionButtons,
    CardActionIcons
} from "@material/react-card";
import Button from "@material/react-button";

function Entry({ name, match, slug, children }) {
    return (
        <Card>
            <CardPrimaryContent className="NoRipple">
                <h1>{name}</h1>
                <div className="Demo">
                    {children}
                </div>
            </CardPrimaryContent>

            <CardActions>
                <CardActionButtons>
                    <Link to={`${match.url}${slug}`}>
                        <Button raised icon={<i className="material-icons">play_arrow</i>}>Try!</Button>
                    </Link>
                </CardActionButtons>

                <CardActionIcons>
                    <i className="material-icons">history</i>
                </CardActionIcons>
            </CardActions>
        </Card>
    );
}

function Catalog({match}) {

    return (
        <div className="Catalog">

            <Entry name="Page Reader" slug="drill-page" match={match}>
                <Viewer />
            </Entry>

            <Entry name="Chunk Reader" slug="drill-chunk-reader" match={match}>
                <Viewer />
            </Entry>

            <Entry name="Chunk Column" slug="drill-chunk-column" match={match}>
                <Viewer />
            </Entry>

            <Entry name="Pager" slug="pager" match={match}>
                <Viewer />
            </Entry>

            <Entry name="Book Viewer" slug="book-viewer" match={match}>
                <Viewer />
            </Entry>

        </div>
    );
}

export default Catalog;
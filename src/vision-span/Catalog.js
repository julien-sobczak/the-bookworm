import React from "react";
import { Link } from "react-router-dom";

import Engine from './Engine'
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
                    <Link to={`${match.url}/${slug}`}>
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

class Catalog extends React.Component {

    DRILL_CUSTOM = new Engine(1, 5);
    DRILL_EASY = new Engine(15, 3);

    render() {
        const match = this.props.match;
        return (
            <div className="Catalog">

                <Entry name="Custom Drill" slug="drill-letter-easy" match={match}>
                    <Viewer drill={this.DRILL_CUSTOM} spans={["0.5in", "0.25in", "0.25in", "0.5in"]} />
                </Entry>

                <Entry name="Drill Letter Easy" slug="drill-letter-intermediate" match={match}>
                    <Viewer drill={this.DRILL_EASY} spans={["1in", "1in"]} />
                </Entry>

            </div>
        );
    }
}

export default Catalog;
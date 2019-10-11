import React, { useState } from 'react';
import { connect } from "react-redux";

import Library from './Library';
import Progress from '../toolbox/Progress';
import Loader from "../toolbox/Loader.js";

import { updateReading } from '../../store/actions';
import { humanReadableDate } from '../../functions/string';

import MaterialIcon from '@material/react-material-icon';
import ReactButton from '@material/react-button';
import '@material/react-button/dist/button.css';

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

function PanelReading(props) {

    const [libraryActive, setLibraryActive] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [loading, setLoading] = useState(false);

    const download = (reading) => {
        const contentUrl = `https://open-library-books.firebaseapp.com/gutenberg/${reading.slug}.txt`;
        const metadataUrl = `https://open-library-books.firebaseapp.com/gutenberg/${reading.slug}.json`;
        console.log(`Downloading ${contentUrl}...`);
        console.log(`Downloading ${metadataUrl}...`);
        Promise.all([
            fetch(contentUrl).then(response => { return response.text(); }),
            fetch(metadataUrl).then((response) => { return response.json(); }),
        ]).then(([content, metadata]) => {
            console.log(content.substring(0, 100), metadata);
            console.log('Download done!');
            setLoading(false);
            // TODO update context
        });
    };

    const handleSwitchBook = (event) => {
        const reading = props.readings[event.target.dataset.index];
        props.updateReading(reading);
        setCollapsed(true);
        setLoading(this);
        download(reading);
    };

    const handleLibrarySelection = (event) => {
        console.log("handleLibrarySelection", event); 
    };

    return (
        <>
            {loading && <Loader />}

            <div className={"PanelCorner " + (collapsed ? "Collapsed" : "Expanded")}>

                <ReactButton className="ButtonBrowse" onClick={() => setLibraryActive(true)}>Browse Library</ReactButton>

                {props.readings.length === 0 && <div>
                    No previous reading.
                </div>}
                {props.readings.length > 0 && <div>
                    <ReactButton className="Clickable"
                            onClick={() => setCollapsed(!collapsed)}
                            icon={<MaterialIcon icon={collapsed ? "unfold_less" : "unfold_more"} />}>
                        You are reading <em>{props.readings[0].title}</em> by <em>{props.readings[0].author}</em>
                    </ReactButton>
                </div>}

                {!collapsed && <table className="Styled">
                    <tbody>
                        {props.readings.map((reading, index) => {
                            return (
                                <tr key={index}>
                                    <td><em>{reading.title}</em></td>
                                    <td><small>{reading.author}</small></td>
                                    <td><small>{humanReadableDate(reading.lastDate)}</small></td>
                                    <td><Progress value={reading.position.progress} showText={true} /></td>
                                    <td><ReactButton onClick={handleSwitchBook} data-index={index} className="Clickable">Switch</ReactButton></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>}

            </div>

            {libraryActive &&
                <Library onClose={() => setLibraryActive(false)} onSelect={handleLibrarySelection} />}
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PanelReading);
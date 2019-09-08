import React, { useState } from 'react';
import { connect } from "react-redux";

import Library from '../library/Library';

import Button from '@material/react-button';
import '@material/react-button/dist/button.css';

const mapStateToProps = state => {
    return {
        readings: state.readings,
        lastReading: state.lastReading,
    };
};

function PanelReading(props) {

    const [libraryActive, setLibraryActive] = useState(false);

    const handleLibrarySelection = (event) => {
        console.log("changeCurrentReading", event); 
    };

    return (
        <>
            <div className="PanelCorner">
                <Button className="ButtonBrowse" onClick={() => setLibraryActive(true)}>Browse Library</Button>
                {props.lastReading === undefined && <div>
                    No previous reading.
                </div>}
                {props.lastReading !== undefined && <div>
                    You are reading <em>{props.readings[props.lastReading].title}</em> by <em>{props.readings[props.lastReading].author}</em>.
                </div>}
            </div>

            {libraryActive &&
                <Library redirect="/chunking/chunk" onSelect={handleLibrarySelection} />}
        </>
    );
}

export default connect(mapStateToProps)(PanelReading);
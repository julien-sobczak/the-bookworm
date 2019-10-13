import React, { useState } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import Library from './Library';
import Progress from '../toolbox/Progress';

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
    };
};

function PanelReading(props) {

    const [libraryActive, setLibraryActive] = useState(false);
    const [collapsed, setCollapsed] = useState(true);

    const handleReadingSwitch = (event) => {
        const reading = props.readings[event.target.dataset.index];
        setCollapsed(true);
        props.onToggle(reading);
    };

    const handleLibrarySelect = (data) => {
        props.onSelect(data);
        setLibraryActive(false);
    };

    return (
        <>
            <div className={"PanelCorner " + (collapsed ? "Collapsed" : "Expanded")}>

                <ReactButton className="ButtonBrowse" onClick={() => setLibraryActive(true)}>Browse Library</ReactButton>

                {!props.content.type && <div>
                    No reading in progress.
                </div>}
                {props.content.type && <div>
                    <ReactButton className="Clickable"
                            onClick={() => setCollapsed(!collapsed)}
                            icon={<MaterialIcon icon={collapsed ? "unfold_less" : "unfold_more"} />}>
                        You are reading <em>{props.content.description.title}</em> by <em>{props.content.description.author}</em>
                    </ReactButton>
                </div>}

                {!collapsed && <table className="Styled">
                    <tbody>
                        {props.readings.map((reading, index) => {
                            return (
                                <tr key={index}>
                                    <td><em>{reading.description.title}</em></td>
                                    <td><small>{reading.description.author}</small></td>
                                    <td><small>{humanReadableDate(reading.lastDate)}</small></td>
                                    <td><Progress value={reading.position.progress} showText={true} /></td>
                                    <td><ReactButton onClick={handleReadingSwitch} data-index={index} className="Clickable">Switch</ReactButton></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>}

            </div>

            {libraryActive &&
                <Library onClose={() => setLibraryActive(false)} onSelect={handleLibrarySelect} />}
        </>
    );
}


PanelReading.propTypes = {
    // The current selected content.
    content: PropTypes.object,
    // Callback when the user selects a new content.
    onSelect: PropTypes.func,
    // Callback when the user switches to a previous reading.
    onToggle: PropTypes.func,
};

PanelReading.defaultProps = {
    content: {},
    onSelect: () => {},
    onToggle: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(PanelReading);
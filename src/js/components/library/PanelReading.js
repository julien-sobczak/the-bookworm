import React, { useState } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import ReactButton from '@material-ui/core/Button';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';

import Library from './Library';
import Progress from '../toolbox/Progress';

import * as string from '../../functions/string';

const mapStateToProps = state => {
    return {
        readings: state.readings,
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

                <div className="PanelCornerMenu">
                    <div className="PanelCornerText">
                        {!props.content.type && <>
                            No reading in progress.
                        </>}
                        {props.content.type && <>
                            {collapsed ?
                                <ReactButton variant="contained" disableElevation={true}
                                    className="ButtonLight Clickable ButtonLongText"
                                    onClick={() => setCollapsed(false)}
                                    startIcon={<UnfoldLessIcon />}>
                                    <span style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>You are reading <em>{props.content.description.title}</em> by <em>{props.content.description.author}</em></span>
                                </ReactButton> :
                                <ReactButton variant="contained" disableElevation={true}
                                    className="ButtonDark Clickable"
                                    onClick={() => setCollapsed(true)}
                                    startIcon={<UnfoldMoreIcon />}>
                                    <span style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>You are reading <em>{props.content.description.title}</em> by <em>{props.content.description.author}</em></span>
                                </ReactButton>
                            }
                        </>}
                    </div>
                    <div className="PanelCornerButton">
                        <ReactButton variant="contained" disableElevation={true}
                                    className="ButtonBrowse"
                                    onClick={() => setLibraryActive(true)}>
                            Browse Library
                        </ReactButton>
                    </div>
                </div>

                {!collapsed && <table className="Styled">
                    <tbody>
                        {props.readings.map((reading, index) => {
                            return (
                                <tr key={index}>
                                    <td><em>{reading.description.title}</em></td>
                                    <td><small>{reading.description.author}</small></td>
                                    <td><small>{string.humanReadableDate(reading.lastDate)}</small></td>
                                    <td><Progress value={reading.position.progress} showText={true} /></td>
                                    <td><ReactButton variant="contained" disableElevation={true} onClick={handleReadingSwitch} data-index={index} className="ButtonLight Clickable">Switch</ReactButton></td>
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
    // Redux state
    readings: PropTypes.array.isRequired,
    // The current selected content.
    content: PropTypes.object,
    // Callback when the user selects a new content.
    onSelect: PropTypes.func,
    // Callback when the user switches to a previous reading.
    onToggle: PropTypes.func,
};

PanelReading.defaultProps = {
    content: {},
    onSelect: () => { },
    onToggle: () => { },
};

export default connect(mapStateToProps)(PanelReading);
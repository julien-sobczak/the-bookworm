import React, { useState } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';

import Library from './Library';
import Progress from '../toolbox/Progress';
import { StyledTable } from '../core/UI';

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

    const Panel = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        color: white;
        font-size: 1.2em;
        z-index: 200;
        background: ${collapsed ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 100)'};
        transition: 0.1s linear all;

        em {
            font-style: italic;
            font-weight: 600;
        }
        small {
            font-size: 75%;
            font-weight: 600;
        }

        .ButtonBrowse {
            width: 100%;
            height: 100%;
            padding: 0 1cm;
            background: rgba(0,0,0,0.25);
            color: white;
        }

        .ButtonCollapse {
            background: rgba(0,0,0,0.25);
            color: white;
        }
        .ButtonExpand {
            background: rgba(255,255,255,0.25);
            color: black;
            max-width: 100%;
            text-transform: none;
        }
    `;

    const Menu = styled.div`
        display: grid;
        grid-template-columns: auto 2in;
        grid-template-rows: auto;
        grid-template-areas:
        "text button"
    `;
    const ReadingText = styled.div`
        grid-area: text;
        padding: 1em;
        overflow: hidden;
    `;
    const BrowseButton = styled.div`
        grid-area: button;
    `;

    return (
        <>
            <Panel>

                <Menu>
                    <ReadingText>
                        {!props.content.type && <>
                            No reading in progress.
                        </>}
                        {props.content.type && <>
                            {collapsed ?
                                <Button
                                    variant="contained"
                                    disableElevation
                                    className="ButtonCollapse Clickable"
                                    onClick={() => setCollapsed(false)}
                                    startIcon={<UnfoldLessIcon />}>
                                    <span style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>You are reading <em>{props.content.description.title}</em> by <em>{props.content.description.author}</em></span>
                                </Button> :
                                <Button
                                    variant="contained"
                                    disableElevation
                                    className="ButtonExpand Clickable"
                                    onClick={() => setCollapsed(true)}
                                    startIcon={<UnfoldMoreIcon />}>
                                    <span style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>You are reading <em>{props.content.description.title}</em> by <em>{props.content.description.author}</em></span>
                                </Button>
                            }
                        </>}
                    </ReadingText>
                    <BrowseButton>
                        <Button
                            variant="contained"
                            disableElevation
                            className="ButtonBrowse"
                            onClick={() => setLibraryActive(true)}>
                            Browse Library
                        </Button>
                    </BrowseButton>
                </Menu>

                {!collapsed && <StyledTable>
                    <tbody>
                        {props.readings.map((reading, index) => {
                            return (
                                <tr key={index}>
                                    <td><em>{reading.description.title}</em></td>
                                    <td><small>{reading.description.author}</small></td>
                                    <td><small>{string.humanReadableDate(reading.lastDate)}</small></td>
                                    <td><Progress value={reading.position.progress} showText /></td>
                                    <td><Button variant="contained" disableElevation onClick={handleReadingSwitch} data-index={index} className="ButtonLight Clickable">Switch</Button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </StyledTable>}

            </Panel>

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

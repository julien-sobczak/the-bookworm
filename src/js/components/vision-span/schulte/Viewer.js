import React from 'react';
import PropTypes from 'prop-types';

import Engine from './Engine';
import Styled from '../../toolbox/Styled';

const defaultDrillSettings = {
    span: "1in",
    size: 5,
    autoLevel: true,
};

function Viewer(props) {

    let drill = props.drill;
    if (!drill) {
        drill = new Engine(props.size).getDrill();
    }

    const cssCell = 'Width' + props.span.replace('.', '_');

    return (
        <Styled className="Viewer Centered" {...props}>
            <table className="SchulteTable">
                <tbody>
                    {drill && drill.lines.map((line, index) => {
                        return (
                            <tr className="Line" key={index}>
                                {line.columns.map((col, index) => {
                                    return <td key={index} className={"Cell " + cssCell + " " + (col.valid === true ? 'valid' : '')}>{col.label}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Styled>
    );
}

Viewer.propTypes = {
    ...Styled.propTypes,

    // How many lines/columns in the table?
    size: PropTypes.number,
    // Cell size
    span: PropTypes.string,
    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,
    // Drill to display
    drill: PropTypes.object,
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...defaultDrillSettings,
};

export { Viewer as default, defaultDrillSettings };

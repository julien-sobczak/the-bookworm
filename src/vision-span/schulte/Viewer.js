import React from 'react';
import PropTypes from 'prop-types';

import Engine from './Engine';
import Styled from '../../toolbox/Styled';

const DEFAULT_DRILL_SETTINGS = {
    span: "1in",
    size: 5,
};

function Viewer(props) {

    let drill = props.drill;
    if (!drill) {
        drill = new Engine(props.size).getDrill();
    }

    const cssCell = 'Width' + props.span.replace('.', '_');

    return (
        <Styled className="Viewer" {...props}>
            <table className="SchulteTable">
                <tbody>
                    {drill && drill.lines.map((line, index) => {
                        return (
                            <tr className="Line" key={index}>
                                {line.columns.map((col, index) => {
                                    return <td key={index} className={"Cell " + cssCell + " " + (col.valid === true ? 'valid' : '')}>{col.label}</td>
                                })}
                            </tr>
                        )
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

    drill: PropTypes.object,
};

Viewer.defaultProps = {
    ...Styled.defaultProps,
    ...DEFAULT_DRILL_SETTINGS,
};

export { Viewer as default, DEFAULT_DRILL_SETTINGS };

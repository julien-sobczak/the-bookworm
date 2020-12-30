import React from 'react';
import PropTypes from 'prop-types';

import Engine from './Engine';
import Styled from '../../toolbox/Styled';

const defaultViewerSettings = {
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
                    {drill && drill.lines.map((line, lineIndex) => {
                        return (
                            <tr className="Line" key={lineIndex}>
                                {line.columns.map((column, columnIndex) => {
                                    return (
                                        <td
                                            key={columnIndex}
                                            data-testid={'Line'+lineIndex+'Column'+columnIndex}
                                            className={"Cell " + cssCell + " " + (column.valid === true ? 'valid' : '')}>
                                            {column.label}
                                        </td>
                                    );
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
    ...defaultViewerSettings,
};

export { Viewer as default, defaultViewerSettings };

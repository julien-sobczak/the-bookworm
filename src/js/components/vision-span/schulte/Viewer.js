import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Cell } from '../UI';
import Engine from './Engine';
import Styled from '../../core/Styled';
import { SPANS } from '../../../functions/engine';

const defaultViewerSettings = {
    span: "1in",
    size: 3,
    autoLevel: true,
};

function Viewer(props) {

    let drill = props.drill;
    if (!drill) {
        drill = new Engine(props.size).getDrill();
    }

    const cssCell = 'Width' + props.span.replace('.', '_');

    const SchulteTable = styled.table`
        border: 1px solid black;

        td {
            border: 1px solid black;
            text-align: center;
            display: table-cell;
            vertical-align: middle
        }

        td.Width0in     { width: 0in;    height: 0in;    }
        td.Width0_25in  { width: 0.25in; height: 0.25in; }
        td.Width0_5in   { width: 0.5in;  height: 0.5in;  }
        td.Width0_75in  { width: 0.75in; height: 0.75in; }
        td.Width1in     { width: 1in;    height: 1in;    }
        td.Width1_25in  { width: 1.25in; height: 1.25in; }
        td.Width1_5in   { width: 1.5in;  height: 1.5in;  }
        td.Width1_75in  { width: 1.75in; height: 1.75in; }
        td.Width2in     { width: 2in;    height: 2in;    }
        td.Width2_25in  { width: 2.25in; height: 2.25in; }
        td.Width2_5in   { width: 2.5in;  height: 2.5in;  }
        td.Width2_75in  { width: 2.75in; height: 2.75in; }
        td.Width3in     { width: 3in;    height: 3in;    }
        td.Width3_25in  { width: 3.25in; height: 3.25in; }
        td.Width3_5in   { width: 3.5in;  height: 3.5in;  }
        td.Width3_75in  { width: 3.75in; height: 3.75in; }
        td.Width4in     { width: 4in;    height: 4in;    }
        td.Width3in     { width: 4.25in; height: 4.25in; }
        td.Width4_25in  { width: 4.25in; height: 4.25in; }
        td.Width4_5in   { width: 4.5in;  height: 4.5in;  }
        td.Width4_75in  { width: 4.75in; height: 4.75in; }
        td.Width5in     { width: 5in;    height: 5in;    }
    `;

    return (
        <Styled {...props} centered>
            <SchulteTable>
                <tbody>
                    {drill && drill.lines.map((line, lineIndex) => {
                        return (
                            <tr key={lineIndex}>
                                {line.columns.map((column, columnIndex) => {
                                    return (
                                        <td key={columnIndex} className={cssCell}>
                                            <Cell
                                                testId={'Line' + lineIndex + 'Column' + columnIndex}
                                                valid={column.valid}>
                                                {column.label}
                                            </Cell>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </SchulteTable>
        </Styled>
    );
}

Viewer.propTypes = {
    ...Styled.propTypes,

    // How many lines/columns in the table?
    size: PropTypes.number,
    // Cell size
    span: PropTypes.oneOf(SPANS),
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

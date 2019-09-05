import React from 'react';
import Styled from '../../toolbox/Styled';

function Viewer(props) {

    if (!props.drill) return <span></span>;

    const cssCell = 'Width' + props.span.replace('.', '_');

    return (
        <Styled className="Viewer" {...props}>
            <table className="SchulteTable">
                <tbody>
                    {props.drill && props.drill.lines.map((line, index) => {
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

export default Viewer;

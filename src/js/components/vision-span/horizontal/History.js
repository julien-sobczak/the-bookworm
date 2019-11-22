import React from 'react';
import PropTypes from 'prop-types';

import * as engine from '../../../functions/engine';
import * as string from '../../../functions/string';

const History = ({ history, onSelect }) => {

    return (
        <div className="DrillHistory">
            <table className="Styled">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Columns</th>
                        <th>Series</th>
                        <th>Lines</th>
                        <th>Span</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((drill, index) => {
                        return (
                            <tr key={index} onClick={onSelect} data-drill={JSON.stringify(drill)}>
                                <td className="Clickable">{string.humanReadableDate(drill.date)}</td>
                                <td className="Clickable">{drill.drillSettings.columns}</td>
                                <td className="Clickable">{drill.drillSettings.multiple && <span>&#10003;</span>}</td>
                                <td className="Clickable">{drill.drillSettings.multiple && <span>{drill.drillSettings.lines}</span>}</td>
                                <td className="Clickable">{engine.globalSpan(drill.drillSettings.spans)}</td>
                            </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

History.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func,
};

History.defaultProps = {
    history: [],
    onSelect: function() {},
};

export default History;
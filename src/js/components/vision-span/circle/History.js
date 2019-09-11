import React from 'react';
import PropTypes from 'prop-types';

import { humanReadableDate } from '../../../functions/string';

const History = ({ history, onSelect }) => {

    return (
        <div className="DrillHistory">
            <table className="Styled">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Span</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((drill, index) => {
                        return (
                            <tr key={index} onClick={onSelect} data-drill={JSON.stringify(drill)}>
                                <td className="Clickable">{humanReadableDate(drill.date)}</td>
                                <td className="Clickable">{drill.drillSettings.span}</td>
                            </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}

History.propTypes = {
    history: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func,
};

History.defaultProps = {
    history: [],
    onSelect: function() {},
};

export default History;
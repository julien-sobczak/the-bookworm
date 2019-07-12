import React from 'react';

/**
 * Only responsible to display a DrillLogic.
 */
class Viewer extends React.Component {

    static defaultProps = {
        fontFamily: 'Rosboto',
        fontSize: '12pt',
        fontStyle: 'normal',
        backgroundColor: 'white',
        color: 'black',
    };

    static propTypes = {
    };

    render() {
        return (
            <div>
                Test
            </div>
        );
    }
}

export default Viewer;

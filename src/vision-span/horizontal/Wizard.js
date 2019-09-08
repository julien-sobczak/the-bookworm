import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../toolbox/Button';
import { DEFAULT_TEXT_SETTINGS } from '../../toolbox/Styled';

import FormText from '../../settings/FormText';
import FormDrill from './Form';

import Drill, { DEFAULT_DRILL_SETTINGS } from './Drill';
import Engine from './Engine';
import Viewer from './Viewer';

// Material Design UI forms
import Tab from '@material/react-tab';
import TabBar from '@material/react-tab-bar';
import MaterialButton from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';

import '@material/react-tab-bar/dist/tab-bar.css';
import '@material/react-tab-scroller/dist/tab-scroller.css';
import '@material/react-tab/dist/tab.css';
import '@material/react-tab-indicator/dist/tab-indicator.css';
import '@material/react-button/dist/button.css';


class Wizard extends React.Component {

    PREDEFINED_DRILLS = [
        {
            name: "Drill A",
            difficulty: 0,
            settings: { multiple: true, lines: 1, columns: 3, spans: ["1.25in", "1.25in"] },
        },
        {
            name: "Drill B",
            difficulty: 0,
            settings: { multiple: true, lines: 1, columns: 5, spans: ["1.25in", "0", "0", "1.25in"] },
        },
        {
            name: "Drill C",
            difficulty: 1,
            settings: { multiple: true, lines: 1, columns: 5, spans: ["0.75in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "Drill D",
            difficulty: 1,
            settings: { multiple: true, lines: 1, columns: 7, spans: ["0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in"] },
        },
        {
            name: "Drill E",
            difficulty: 2,
            settings: { multiple: true, lines: 1, columns: 9, spans: ["0.75in", "0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "Drill F",
            difficulty: 0,
            settings: { multiple: true, lines: 2, columns: 3, spans: ["1in", "1in"] },
        },
        {
            name: "Drill G",
            difficulty: 1,
            settings: { multiple: true, lines: 3, columns: 7, spans: ["0.5in", "0.5in", "0in", "0in", "0.5in", "0.5in"] },
        },
        {
            name: "Drill H",
            difficulty: 1,
            settings: { multiple: true, lines: 3, columns: 5, spans: ["0.75in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "Drill I",
            difficulty: 1,
            settings: { multiple: false, lines: 5, columns: 7, spans: ["0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in"] },
        },
        {
            name: "Drill J",
            difficulty: 2,
            settings: { multiple: true, lines: 3, columns: 7, spans: ["0.75in", "0.75in", "0.75in", "0.75in", "0.75in", "0.75in"] },
        },

    ];

    DEFAULT_DRILL = new Engine(
                            Drill.defaultProps.lines,
                            Drill.defaultProps.columns,
                            Drill.defaultProps.multiple ? 2 : 1).getDrill();

    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            demoActive: false,

            // Copy default settings to make them editable
            drillSettings: props.drillSettings,
            textSettings: props.textSettings,

            // Preview drill
            drill: this.DEFAULT_DRILL,
        };

        this.usePredefinedDrill = this.usePredefinedDrill.bind(this);

        this.handleDrillSettingsChange = this.handleDrillSettingsChange.bind(this);
        this.handleTextSettingsChange = this.handleTextSettingsChange.bind(this);

        this.handleDemoClick = this.handleDemoClick.bind(this);
        this.handleValidateClick = this.handleValidateClick.bind(this);
    }

    handleActiveIndexUpdate = (activeIndex) => this.setState({ activeIndex: activeIndex });

    handleDemoClick = (event) => this.setState({ demoActive: true });

    handleDrillSettingsChange = (drillSettings) => {
        console.log('Received new drill settings', drillSettings)
        this.setState(state => ({
            ...state,
            drillSettings: drillSettings,
        }));
        this.refreshDrill(drillSettings)
    };

    handleTextSettingsChange = (textSettings) => {
        console.log('Received new text settings', textSettings)
        this.setState(state => ({
            ...state,
            textSettings: textSettings,
        }));
    };

    refreshDrill({ lines, columns, multiple }) {
        return new Engine(lines, columns, multiple ? 2 : 1).getDrill();
    };

    usePredefinedDrill(event) {
        const drillSettings = JSON.parse(event.target.dataset.drill);
        const newDrill = this.refreshDrill(drillSettings);
        this.setState({
            ...this.state,
            activeIndex: 0,
            drillSettings: drillSettings,
            drill: newDrill,
        });
    }

    render() {
        return (
            <div className="Wizard FullScreen Centered">

                <div className="Preferences InnerContent Scrollbar">

                    <TabBar
                        activeIndex={this.state.activeIndex}
                        handleActiveIndexUpdate={this.handleActiveIndexUpdate}>
                        <Tab indicatorContent={<MaterialIcon icon='tune' />} />
                        <Tab indicatorContent={<MaterialIcon icon='style' />} />
                        <Tab indicatorContent={<MaterialIcon icon='bookmarks' />} />
                        <Tab indicatorContent={<MaterialIcon icon='history' />} />
                    </TabBar>

                    {this.state.activeIndex === 0 && <div className="TabContent Centered">
                        <section>
                            <h4>Drill options</h4>
                            <p>Customize the drill.</p>
                            <FormDrill {...this.state.drillSettings} onChange={this.handleDrillSettingsChange} />
                        </section>
                    </div>}

                    {this.state.activeIndex === 1 && <div className="TabContent Centered">
                        <section>
                            <h4>Font</h4>
                            <p>Control how texts are displayed in the drills.</p>
                            <FormText {...this.state.textSettings} onChange={this.handleTextSettingsChange} />
                        </section>
                    </div>}

                    {this.state.activeIndex === 2 && <div className="TabContent Centered">
                        <section>
                            <h4>Predefined Drills</h4>
                            <p>Practice with these ready-to-go drills.</p>
                            <table className="PredefinedDrills">
                                <tbody>
                                    {this.PREDEFINED_DRILLS.map((drill, index) => {
                                        return (
                                            <tr key={index}>
                                                <th>
                                                    {drill.name}
                                                </th>
                                                <td>
                                                    <span className="Tag">{drill.settings.columns} columns</span>
                                                    <span className="Tag">{drill.settings.series ? 'unique' : 'multiple'} series</span>
                                                    {drill.difficulty === 0 && <span className="Tag Easy">easy</span>}
                                                    {drill.difficulty === 1 && <span className="Tag Easy">intermediate</span>}
                                                    {drill.difficulty === 2 && <span className="Tag Easy">advanced</span>}
                                                    {drill.difficulty === 3 && <span className="Tag Easy">hard</span>}
                                                </td>
                                                <td>
                                                    <MaterialButton onClick={this.usePredefinedDrill} data-drill={JSON.stringify(drill.settings)}>
                                                        Use Me!
                                                    </MaterialButton>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </section>
                    </div>}

                    {this.state.activeIndex === 3 && <div className="TabContent Centered">
                        <section>
                            <h4>Previous Drills</h4>
                            <p>Redo one of your previous drill sessions.</p>
                            TODO
                        </section>
                    </div>}

                    {this.state.demoActive && <div className="Demo FullScreen Centered">
                        <Viewer
                            drill={this.state.drill}
                            {...this.state.drillSettings}
                            {...this.state.styleSettings} />
                    </div>}

                </div>

                <div className="ButtonForm">
                    <Button text="Demo" colorText="white" colorBackground="#111" onClick={this.handleDemoClick} />
                    <Button text="Start" colorText="white" colorBackground="#111" onClick={this.handleValidateClick} />
                </div>
            </div>
        );
    }

    handleValidateClick() {
        this.props.onValidate({
            drillSettings: this.state.drillSettings,
            textSettings: this.state.textSettings,
        })
    }

}

Wizard.propTypes = {
    drillSettings: PropTypes.object,
    textSettings: PropTypes.object,
    onValidate: PropTypes.func,
};

Wizard.defaultProps = {
    drillSettings: DEFAULT_DRILL_SETTINGS,
    textSettings: DEFAULT_TEXT_SETTINGS,
    onValidate: function() {},
};

export default Wizard;
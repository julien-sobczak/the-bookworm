import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import Button from './Button';

import FormText from '../settings/FormText';

// Material Design UI forms
import Tab from '@material/react-tab';
import TabBar from '@material/react-tab-bar';
import MaterialIcon from '@material/react-material-icon';

import '@material/react-tab-bar/dist/tab-bar.css';
import '@material/react-tab-scroller/dist/tab-scroller.css';
import '@material/react-tab/dist/tab.css';
import '@material/react-tab-indicator/dist/tab-indicator.css';
import '@material/react-button/dist/button.css';


const PredefinedDrills = ({drills, onSelect}) => {
    return (
        <div className="PredefinedDrills">
            {drills.map((drill, index) => {
                return (
                    <div key={index} className="PredefinedDrill Centered" onClick={onSelect} data-drill={JSON.stringify(drill.settings)}>
                        <span className="DrillName">{drill.name}</span>
                        {drill.difficulty === 0 && <span className="DrillTag Easy">easy</span>}
                        {drill.difficulty === 1 && <span className="DrillTag Intermediate">intermediate</span>}
                        {drill.difficulty === 2 && <span className="DrillTag Advanced">advanced</span>}
                        {drill.difficulty === 3 && <span className="DrillTag Hard">hard</span>}
                    </div>
                );
            })}
        </div>
    );
};

PredefinedDrills.propTypes = {
    drills: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

class WizardFactory extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            demoActive: false,

            // Copy default settings to make them editable
            drillSettings: props.drillSettings,
            textSettings: props.textSettings,
        };

        this.usePredefinedDrill = this.usePredefinedDrill.bind(this);
        this.useHistoryDrill = this.useHistoryDrill.bind(this);

        this.handleDrillSettingsChange = this.handleDrillSettingsChange.bind(this);
        this.handleTextSettingsChange = this.handleTextSettingsChange.bind(this);

        this.handleDemoClick = this.handleDemoClick.bind(this);
        this.handleValidateClick = this.handleValidateClick.bind(this);
    }

    handleActiveIndexUpdate(activeIndex) {
        this.setState({
            activeIndex: activeIndex,
        });
    }

    handleDemoClick()  {
        this.setState({
            demoActive: !this.state.demoActive,
        });
    }

    handleDrillSettingsChange(drillSettings) {
        this.setState(state => ({
            ...state,
            drillSettings: drillSettings,
        }));
    }

    handleTextSettingsChange(textSettings) {
        this.setState(state => ({
            ...state,
            textSettings: textSettings,
        }));
    }

    usePredefinedDrill(event) {
        const drillSettings = JSON.parse(event.target.dataset.drill);
        this.setState({
            ...this.state,
            activeIndex: 0,
            drillSettings: drillSettings,
        });
    }

    useHistoryDrill(event) {
        const drill = JSON.parse(event.target.parentNode.dataset.drill);
        this.setState({
            ...this.state,
            activeIndex: 0,
            drillSettings: drill.drillSettings,
            textSettings: drill.textSettings,
        });
    }

    render() {
        const tabs = [];
        tabs.push(<Tab key={1} indicatorContent={<MaterialIcon icon='tune' />} />);
        tabs.push(<Tab key={2} indicatorContent={<MaterialIcon icon='style' />} />);
        if (this.props.history) {
            tabs.push(<Tab key={3} indicatorContent={<MaterialIcon icon='history' />} />);
        }
        if (this.props.predefinedDrills) {
            tabs.push(<Tab key={4} indicatorContent={<MaterialIcon icon='bookmarks' />} />);
        }
        return (
            <div className="Wizard FullScreen Scrollbar">

                <Link to={`/${this.props.category}/`} className="ButtonClose"><i className="material-icons">close</i></Link>

                <div className="Preferences InnerContent">

                    <TabBar
                        activeIndex={this.state.activeIndex}
                        handleActiveIndexUpdate={this.handleActiveIndexUpdate}>
                        {tabs}
                    </TabBar>

                    {this.state.activeIndex === 0 && <div className="TabContent Centered">
                        <section>
                            <h4>Drill options</h4>
                            <p>Customize the drill.</p>
                            {React.cloneElement(this.props.form, {
                                ...this.state.drillSettings,
                                keyboardDetected: this.props.keyboardDetected,
                                onChange: this.handleDrillSettingsChange,
                            })}
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
                            <PredefinedDrills drills={this.props.predefinedDrills} onSelect={this.usePredefinedDrill} />
                        </section>
                    </div>}

                    {this.state.activeIndex === 3 && <div className="TabContent Centered">
                        <section>
                            <h4>Previous Drills</h4>
                            <p>Redo one of your previous drill sessions.</p>
                            {React.cloneElement(this.props.history, {
                                history: this.props.historySessions,
                                onSelect: this.useHistoryDrill,
                            })}
                        </section>
                    </div>}

                    {this.state.demoActive && <div className="Demo FullScreen Centered">
                        <button className="CornerTopLeft" onClick={this.handleDemoClick}><i className="material-icons">close</i></button>
                        {React.cloneElement(this.props.demo, {
                            ...this.state.drillSettings,
                            ...this.state.styleSettings,
                        })}
                    </div>}

                </div>

                <div className="Centered">
                    <div className="Actions">
                        <Button text="Demo" colorText="white" colorBackground="#111" onClick={this.handleDemoClick} />
                        <Button text="Start" colorText="white" colorBackground="#111" onClick={this.handleValidateClick} />
                    </div>
                </div>
            </div>
        );
    }

    handleValidateClick() {
        this.props.onValidate({
            drillSettings: this.state.drillSettings,
            textSettings: this.state.textSettings,
        });
    }

}

WizardFactory.propTypes = {
    category: PropTypes.string.isRequired,

    form: PropTypes.element.isRequired,
    demo: PropTypes.element.isRequired,
    history: PropTypes.element,

    drillSettings: PropTypes.object,
    textSettings: PropTypes.object,

    predefinedDrills: PropTypes.arrayOf(PropTypes.object),
    historySessions: PropTypes.arrayOf(PropTypes.object),

    keyboardDetected: PropTypes.bool,

    onValidate: PropTypes.func,
};

WizardFactory.defaultProps = {
    historySessions: [],
    keyboardDetected: false,
    onValidate: function() {},
};

export default WizardFactory;
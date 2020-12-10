import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { saveDefaults } from '../../store/actions';

import Button from './Button';

import FormText from '../settings/FormText';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TuneIcon from '@material-ui/icons/Tune';
import StyleIcon from '@material-ui/icons/Style';
import HistoryIcon from '@material-ui/icons/History';
import BookmarksIcon from '@material-ui/icons/Bookmarks';

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
            activeTab: 0,
            demoActive: false,

            // Copy settings to make them editable
            drillSettings: props.drillSettings,
            textSettings: {...props.defaults[props.name + '-textSettings'], ...props.textSettings},
        };

        // Merge possible previous saved settings
        if ((props.name + '-drillSettings') in props.defaults) {
            this.state.drillSettings = {
                ...this.state.drillSettings,
                ...props.defaults[props.name + '-drillSettings'],
            };
        }
        if ((props.name + '-textSettings') in props.defaults) {
            this.state.drillSettings = {
                ...this.state.drillSettings,
                ...props.defaults[props.name + '-textSettings'],
            };
        }

        this.usePredefinedDrill = this.usePredefinedDrill.bind(this);
        this.useHistoryDrill = this.useHistoryDrill.bind(this);

        this.handleDrillSettingsChange = this.handleDrillSettingsChange.bind(this);
        this.handleTextSettingsChange = this.handleTextSettingsChange.bind(this);

        this.handleDemoClick = this.handleDemoClick.bind(this);
        this.handleValidateClick = this.handleValidateClick.bind(this);

        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(event, activeTab) {
        this.setState({
            activeTab: activeTab,
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
            activeTab: 0,
            drillSettings: drillSettings,
        });
    }

    useHistoryDrill(event) {
        const drill = JSON.parse(event.target.parentNode.dataset.drill);
        this.setState({
            ...this.state,
            activeTab: 0,
            drillSettings: drill.drillSettings,
            textSettings: drill.textSettings,
        });
    }

    render() {
        const tabs = [];
        tabs.push(<Tab key={1} icon={<TuneIcon />} label="Options" />);
        tabs.push(<Tab key={2} icon={<StyleIcon />} label="Style" />);
        if (this.props.predefinedDrills) {
            tabs.push(<Tab key={4} icon={<BookmarksIcon />} label="Favorite" />);
        }
        if (this.props.history && this.props.history.length > 0) {
            tabs.push(<Tab key={3} icon={<HistoryIcon />} label="History" />);
        }
        return (
            <div className="Wizard FullScreen Scrollbar">

                <Link to={`/${this.props.category}/`} className="ButtonClose"><i className="material-icons">close</i></Link>

                <div className="Preferences InnerContent">

                    <Tabs
                        value={this.state.activeTab}
                        onChange={this.handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered>
                        {tabs}
                    </Tabs>

                    {this.state.activeTab === 0 && <div className="TabContent Centered">
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

                    {this.state.activeTab === 1 && <div className="TabContent Centered">
                        <section>
                            <h4>Font</h4>
                            <p>Control how texts are displayed in the drills.</p>
                            <FormText {...this.state.textSettings} onChange={this.handleTextSettingsChange} />
                        </section>
                    </div>}

                    {this.state.activeTab === 2 && <div className="TabContent Centered">
                        <section>
                            <h4>Predefined Drills</h4>
                            <p>Practice with these ready-to-go drills.</p>
                            <PredefinedDrills drills={this.props.predefinedDrills} onSelect={this.usePredefinedDrill} />
                        </section>
                    </div>}

                    {this.state.activeTab === 3 && <div className="TabContent Centered">
                        <section>
                            <h4>History</h4>
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
        this.props.saveDefaults({
            key: this.props.name + "-drillSettings",
            settings: this.state.drillSettings,
        });
        this.props.saveDefaults({
            key: this.props.name + "-textSettings",
            settings: this.state.textSettings,
        });
        this.props.onValidate({
            drillSettings: this.state.drillSettings,
            textSettings: this.state.textSettings,
        });
    }

}

WizardFactory.propTypes = {
    // The category of the drill (chunking, vision-span, etc.)
    category: PropTypes.string.isRequired,
    // The name of the drill (drillCircle, drillPractice, etc.)
    name: PropTypes.string.isRequired,

    form: PropTypes.element.isRequired,
    demo: PropTypes.element.isRequired,
    history: PropTypes.element,

    // Previously  used settings.
    defaults: PropTypes.object,

    drillSettings: PropTypes.object,
    textSettings: PropTypes.object,

    predefinedDrills: PropTypes.arrayOf(PropTypes.object),
    historySessions: PropTypes.arrayOf(PropTypes.object),

    keyboardDetected: PropTypes.bool,

    saveDefaults: PropTypes.func,
    onValidate: PropTypes.func,
};

WizardFactory.defaultProps = {
    historySessions: [],
    keyboardDetected: false,
    onValidate: function() {},
};

const mapStateToProps = state => {
    return {
        defaults: state.defaults,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveDefaults: settings => dispatch(saveDefaults(settings)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WizardFactory);

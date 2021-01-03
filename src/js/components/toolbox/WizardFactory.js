import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { saveDefaults, deleteTextPreset, saveTextPreset, saveDrillPreset, deleteDrillPreset } from '../../store/actions';

import Button from './Button';
import Screen from './Screen';
import FormText from '../settings/FormText';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TuneIcon from '@material-ui/icons/Tune';
import StyleIcon from '@material-ui/icons/Style';
import { withStyles } from '@material-ui/core/styles';
import ReactButton from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import AddCircle from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DefaultPresets } from '../../components/settings/FormText';

function PresetsList({ fixedPresets, customPresets, onSelectPreset, onDeletePreset, onNewPreset }) {

    const [saved, setSaved] = useState(false);

    const handleSave = (name) => {
        setSaved(true);
        onNewPreset(name);
    };

    const handleSelect = (event) => {
        onSelectPreset(JSON.parse(event.target.dataset.preset));
    };

    const handleDelete = (event) => {
        onDeletePreset(event.target.closest('button').dataset.name);
    };

    return (
        <>
            <ul className="PresetLabels">
                {fixedPresets.map((preset, index) => {
                    return (
                        <li key={index} className="PresetLabel">
                            <button onClick={handleSelect} data-preset={JSON.stringify(preset.settings)}>{preset.name}</button>
                        </li>
                    );
                })}
                {customPresets.map((preset, index) => {
                    return (
                        <li key={index} className="PresetLabel">
                            <button onClick={handleSelect} data-preset={JSON.stringify(preset.settings)}>{preset.name}</button>
                            <button onClick={handleDelete} data-name={preset.name}>
                                <CancelIcon fontSize="inherit" />
                            </button>
                        </li>
                    );
                })}
                {!saved && <li>
                    <NewPresetForm onSave={handleSave} />
                </li>}
            </ul>
        </>
    );
}
PresetsList.propTypes = {
    fixedPresets: PropTypes.arrayOf(PropTypes.object),
    customPresets: PropTypes.arrayOf(PropTypes.object),
    onSelectPreset: PropTypes.func.isRequired,
    onDeletePreset: PropTypes.func.isRequired,
    onNewPreset: PropTypes.func.isRequired,
};
PresetsList.defaultProps = {
    fixedPresets: [],
    customPresets: [],
};

function NewPresetForm({ onSave }) {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");

    const handleOpen = () => {
        setOpen(true);
    };

    const handleNameChanged = event => {
        setName(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
        onSave(name);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <BlackCheckbox icon={<AddCircleOutline />} checkedIcon={<AddCircle />} value={open} onChange={handleOpen} />
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Save new preset</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        value={name}
                        onChange={handleNameChanged}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <ReactButton onClick={handleCancel} color="primary">
                        Cancel
                    </ReactButton>
                    <ReactButton onClick={handleClose} color="primary">
                        Save
                    </ReactButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
NewPresetForm.propTypes = {
    onSave: PropTypes.func.isRequired,
};

const BlackCheckbox = withStyles({
    root: {
        color: 'black',
        '&$checked': {
            color: 'black',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

class WizardFactory extends React.Component {

    constructor(props) {
        super(props);

        const defaults = props.defaults[props.name];
        this.state = {
            activeTab: 0,
            demoActive: defaults.showInstructions,

            // Copy settings to make them editable
            drillSettings: {...defaults.drillSettings, ...props.drillSettings},
            textSettings: {...defaults.textSettings, ...props.textSettings},
            showInstructions: defaults.showInstructions,
        };

        this.handleDemoClick = this.handleDemoClick.bind(this);
        this.handleValidateClick = this.handleValidateClick.bind(this);

        this.handleDrillSettingsSave = this.handleDrillSettingsSave.bind(this);
        this.handleDrillSettingsChange = this.handleDrillSettingsChange.bind(this);
        this.handleDrillSettingsDelete = this.handleDrillSettingsDelete.bind(this);
        this.handleTextSettingsSave = this.handleTextSettingsSave.bind(this);
        this.handleTextSettingsChange = this.handleTextSettingsChange.bind(this);
        this.handleTextSettingsDelete = this.handleTextSettingsDelete.bind(this);
        this.handleShowInstructions = this.handleShowInstructions.bind(this);

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
        this.forceUpdate();
    }

    handleTextSettingsChange(textSettings) {
        this.setState(state => ({
            ...state,
            textSettings: textSettings,
        }));
        this.forceUpdate();
    }

    handleDrillSettingsDelete(presetName) {
        this.props.deleteDrillPreset(this.props.name, presetName);
    }

    handleTextSettingsDelete(presetName) {
        this.props.deleteTextPreset(presetName);
    }

    handleDrillSettingsSave(presetName) {
        this.props.saveDrillPreset(this.props.name, {
            name: presetName,
            settings: this.state.drillSettings,
        });
    }

    handleTextSettingsSave(presetName) {
        this.props.saveTextPreset({
            name: presetName,
            settings: this.state.textSettings,
        });
    }

    handleShowInstructions(event) {
        this.setState({
            showInstructions: event.target.checked,
        });
    }

    render() {
        const tabs = [];
        tabs.push(<Tab key={1} icon={<TuneIcon />} label="Options" />);
        tabs.push(<Tab key={2} icon={<StyleIcon />} label="Style" />);
        return (
            <div className="Wizard FullScreen Scrollbar">

                <Link to={`/${this.props.category}/`} className="ButtonClose"><i className="material-icons">close</i></Link>

                {this.state.demoActive && <Screen className="Demo" scrollable={true} onClose={this.handleDemoClick}>
                    <div>
                        {this.props.demo}
                    </div>
                    <div className="InstructionsCheckbox">
                        <FormControlLabel
                            control={<BlackCheckbox checked={this.state.showInstructions} onChange={this.handleShowInstructions} name="doNotShowInstructions" />}
                            label="Always show instructions"
                        />
                    </div>
                    <div className="Centered">
                        <div className="Actions">
                            <Button text="I understand" colorText="white" colorBackground="#111" onClick={this.handleDemoClick} />
                        </div>
                    </div>
                </Screen>}

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
                            {this.props.drillPresets.length > 0 && <>
                                <p>Use an existing preset:</p>
                                <PresetsList
                                    fixedPresets={this.props.drillPresets}
                                    customPresets={this.props.customPresets.drill[this.props.name]}
                                    onSelectPreset={this.handleDrillSettingsChange}
                                    onDeletePreset={this.handleDrillSettingsDelete}
                                    onNewPreset={this.handleDrillSettingsSave} />
                            </>}
                            <p>Or customize a new drill:</p>
                            {React.cloneElement(this.props.form, {
                                ...this.state.drillSettings,
                                keyboardDetected: this.props.keyboardDetected,
                                onChange: this.handleDrillSettingsChange,
                            })}
                        </section>
                    </div>}

                    {this.state.activeTab === 1 && <div className="TabContent Centered">
                        <section>
                            <h4>Style</h4>
                            {DefaultPresets.length > 0 && <>
                                <p>Use an existing preset:</p>
                                <PresetsList
                                    fixedPresets={DefaultPresets}
                                    customPresets={this.props.customPresets.text}
                                    onSelectPreset={this.handleTextSettingsChange}
                                    onDeletePreset={this.handleTextSettingsDelete}
                                    onNewPreset={this.handleTextSettingsSave} />
                            </>}
                            <p>Or customize how text is displayed:</p>
                            <FormText {...this.state.textSettings} onChange={this.handleTextSettingsChange} />
                        </section>
                    </div>}

                </div>

                <div className="Centered">
                    <div className="Actions">
                        <Button text="Instructions" colorText="white" colorBackground="#111" onClick={this.handleDemoClick} />
                        <Button text="Start" colorText="white" colorBackground="#111" onClick={this.handleValidateClick} />
                    </div>
                </div>
            </div>
        );
    }

    handleValidateClick() {
        this.props.saveDefaults({
            drill: this.props.name,
            defaults: {
                drill: this.state.drillSettings,
                text: this.state.textSettings,
                showInstructions: this.state.showInstructions,
            },
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
    demo: PropTypes.node.isRequired,
    history: PropTypes.element,

    drillSettings: PropTypes.object,
    textSettings: PropTypes.object,

    drillPresets: PropTypes.arrayOf(PropTypes.object),
    historySessions: PropTypes.arrayOf(PropTypes.object),

    keyboardDetected: PropTypes.bool,

    // Redux
    defaults: PropTypes.object,
    customPresets: PropTypes.object,
    saveDefaults: PropTypes.func,
    saveDrillPreset: PropTypes.func,
    saveTextPreset: PropTypes.func,
    deleteDrillPreset: PropTypes.func,
    deleteTextPreset: PropTypes.func,

    // Events
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
        customPresets: state.customPresets,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveDefaults: settings => dispatch(saveDefaults(settings)),
        saveDrillPreset: (drillName, preset) => dispatch(saveDrillPreset(drillName, preset)),
        saveTextPreset: preset => dispatch(saveTextPreset(preset)),
        deleteDrillPreset: (drillName, presetName) => dispatch(deleteDrillPreset(drillName, presetName)),
        deleteTextPreset: presetName => dispatch(deleteTextPreset(presetName)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WizardFactory);

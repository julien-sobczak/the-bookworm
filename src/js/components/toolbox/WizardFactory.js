import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { saveDefaults, deleteTextPreset, saveTextPreset, saveDrillPreset, deleteDrillPreset } from '../../store/actions';

import LargeButton from './LargeButton';
import Screen from './Screen';
import Text from './Text';
import FormText from '../settings/FormText';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TuneIcon from '@material-ui/icons/Tune';
import StyleIcon from '@material-ui/icons/Style';
import CloseIcon from '@material-ui/icons/Close';
import NewIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DefaultPresets } from '../../components/settings/FormText';

function PresetsList({ fixedPresets, customPresets, onSelectPreset, onDeletePreset, onNewPreset }) {

    const [saved, setSaved] = useState(false);

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: "3rem",
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
    }));

    const handleSave = (name) => {
        setSaved(true);
        onNewPreset(name);
    };

    const handleSelect = (settings) => {
        onSelectPreset(settings);
    };

    const handleDelete = (name) => {
        onDeletePreset(name);
    };

    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                {fixedPresets.map((preset, index) => {
                    return (
                        <Chip
                            key={index}
                            label={preset.name}
                            clickable
                            color="primary"
                            onClick={() => handleSelect(preset.settings)}
                        />
                    );
                })}
                {customPresets.map((preset, index) => {
                    return (
                        <Chip
                            key={index}
                            label={preset.name}
                            clickable
                            color="primary"
                            onClick={() => handleSelect(preset.settings)}
                            onDelete={() => handleDelete(preset.name)}
                            deleteIcon={<DeleteIcon />}
                        />
                    );
                })}
                {!saved && <NewPresetForm onSave={handleSave} />}
            </div>
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
            <Chip
                icon={<NewIcon/>}
                label="New"
                clickable
                color="primary"
                onClick={handleOpen}
            />
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
                    <Button onClick={handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Save
                    </Button>
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
            instructionsActive: defaults.showInstructions,

            // Copy settings to make them editable
            drillSettings: {...defaults.drillSettings, ...props.drillSettings},
            textSettings: {...defaults.textSettings, ...props.textSettings},
            showInstructions: defaults.showInstructions,
        };

        this.handleInstructionsClick = this.handleInstructionsClick.bind(this);
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

    handleInstructionsClick()  {
        this.setState({
            instructionsActive: !this.state.instructionsActive,
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

                <Link to={`/${this.props.category}/`} className="ButtonClose"><CloseIcon /></Link>

                {this.state.instructionsActive && <Screen className="Instructions" scrollable={true} onClose={this.handleInstructionsClick}>
                    <div>
                        {this.props.instructions}
                    </div>
                    <div className="InstructionsCheckbox">
                        <FormControlLabel
                            control={<BlackCheckbox checked={this.state.showInstructions} onChange={this.handleShowInstructions} name="doNotShowInstructions" />}
                            label="Always show instructions"
                        />
                    </div>
                    <div className="Centered">
                        <div className="Actions">
                            <LargeButton text="I understand" colorText="white" colorBackground="#111" onClick={this.handleInstructionsClick} />
                        </div>
                    </div>
                </Screen>}

                <div className="Form InnerContent">

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
                            {this.props.drillPresets.length > 0 && <>
                                <p><Text manuscript={true} arrow={true} arrowDirection="bottom" arrowPosition="left" arrowVariant="primary">Use an existing preset</Text></p>
                                <PresetsList
                                    fixedPresets={this.props.drillPresets}
                                    customPresets={this.props.customPresets.drill[this.props.name]}
                                    onSelectPreset={this.handleDrillSettingsChange}
                                    onDeletePreset={this.handleDrillSettingsDelete}
                                    onNewPreset={this.handleDrillSettingsSave} />
                            </>}
                            <p><Text manuscript={true} arrow={true} arrowDirection="bottom" arrowPosition="left" arrowVariant="secondary">Customize a new drill</Text></p>
                            {React.cloneElement(this.props.form, {
                                ...this.state.drillSettings,
                                keyboardDetected: this.props.keyboardDetected,
                                onChange: this.handleDrillSettingsChange,
                            })}
                        </section>
                    </div>}

                    {this.state.activeTab === 1 && <div className="TabContent Centered">
                        <section>
                            {DefaultPresets.length > 0 && <>
                                <p><Text manuscript={true} arrow={true} arrowDirection="bottom" arrowPosition="left" arrowVariant="primary">Use an existing preset</Text></p>
                                <PresetsList
                                    fixedPresets={DefaultPresets}
                                    customPresets={this.props.customPresets.text}
                                    onSelectPreset={this.handleTextSettingsChange}
                                    onDeletePreset={this.handleTextSettingsDelete}
                                    onNewPreset={this.handleTextSettingsSave} />
                            </>}
                            <p><Text manuscript={true} arrow={true} arrowDirection="bottom" arrowPosition="left" arrowVariant="secondary">Customize how the text is displayed</Text></p>
                            <FormText {...this.state.textSettings} onChange={this.handleTextSettingsChange} />
                        </section>
                    </div>}

                </div>

                <div className="Centered">
                    <div className="Actions">
                        <LargeButton text="Instructions" colorText="white" colorBackground="#111" onClick={this.handleInstructionsClick} />
                        <LargeButton text="Start" colorText="white" colorBackground="#111" onClick={this.handleValidateClick} />
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
    instructions: PropTypes.node.isRequired,
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

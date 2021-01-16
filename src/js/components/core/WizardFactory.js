import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import styled from 'styled-components';

import { saveDefaults, deleteTextPreset, saveTextPreset, saveDrillPreset, deleteDrillPreset } from '../../store/actions';

import Screen from './Screen';
import { Form } from './UI';
import Text from '../toolbox/Text';
import LargeButton from '../toolbox/LargeButton';
import LargeButtonGroup from '../toolbox/LargeButtonGroup';
import FormText from '../settings/FormText';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TuneIcon from '@material-ui/icons/Tune';
import StyleIcon from '@material-ui/icons/Style';
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
import { DefaultPresets } from '../settings/FormText';

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


const TabContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 2em 0;
`;

/*
 * Screen Instructions
 */

const BlackCheckbox = withStyles({
    root: {
        color: 'black',
        '&$checked': {
            color: 'black',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

function ScreenInstructions(props) {

    const [checked, setChecked] = useState(props.showInstructions);

    const handleClick = (event) => {
        setChecked(event.target.checked);
    };

    const handleDone = () => {
        props.onClose({
            showInstructions: checked,
        });
    };

    const Wrapper = styled.div`
        z-index: 1000;
        background-color: var(--theme-color);
        --chunk-color: black;

        h1 {
            margin-bottom: 2rem;
            text-align: center;
            font-size: 3rem;
            font-weight: 900;
            letter-spacing: .25em;
            text-transform: uppercase;
            vertical-align: middle;
        }
        .Text {
            max-width: 50rem;
            background: black;
            border-radius: 0.5rem;
            color: white;
            font-weight: bold;
            padding: 1rem 2rem;
            margin: 2rem auto;
            font: 1.5rem;
            line-height: 1.8;
            text-align: center;
        }
        .Text p {
            margin: 1rem 0;
        }
        .Text .Label {
            background: var(--theme-color);
            color: black;
            padding: 0.25rem;
            border-radius: 0.125em;
        }
        .Icon {
            color: var(--theme-color);
            margin-right: 0.5rem;
            margin-top: -2rem;
        }
    `;
    const Form = styled.div`
        text-align: center;
        margin: 1rem auto;
    `;

    return (
        <Wrapper>
            <Screen colored scrollable onClose={handleDone}>
                <div>
                    {props.instructions}
                </div>
                <Form>
                    <FormControlLabel
                        control={<BlackCheckbox checked={checked} onChange={handleClick} name="showInstructions" />}
                        label="Always show instructions"
                    />
                </Form>
                <LargeButtonGroup>
                    <LargeButton text="I understand" colorText="white" colorBackground="#111" onClick={handleDone} />
                </LargeButtonGroup>
            </Screen>
        </Wrapper>
    );
}
ScreenInstructions.propTypes = {
    instructions: PropTypes.node.isRequired,
    showInstructions: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

function ScreenWizard({ category, children }) {
    const Wrapper = styled.div`
        --mdc-theme-secondary: black; /* Used by Switch */
    `;

    return (
        <Wrapper>
            <Screen colored centered={false} scrollable closeUrl={`/${category}/`}>
                {children}
            </Screen>
        </Wrapper>
    );
}
ScreenWizard.propTypes = {
    category: PropTypes.oneOf(['vision-span', 'chunking', 'practice']),
    children: PropTypes.node.isRequired,
};

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
        this.handleInstructionsClose = this.handleInstructionsClose.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);

        this.handleDrillSettingsSave = this.handleDrillSettingsSave.bind(this);
        this.handleDrillSettingsChange = this.handleDrillSettingsChange.bind(this);
        this.handleDrillSettingsDelete = this.handleDrillSettingsDelete.bind(this);
        this.handleTextSettingsSave = this.handleTextSettingsSave.bind(this);
        this.handleTextSettingsChange = this.handleTextSettingsChange.bind(this);
        this.handleTextSettingsDelete = this.handleTextSettingsDelete.bind(this);
    }

    handleTabChange(event, activeTab) {
        this.setState({
            activeTab: activeTab,
        });
    }

    handleInstructionsClick() {
        this.setState({
            instructionsActive: true,
        });
    }

    handleInstructionsClose(event) {
        this.setState({
            showInstructions: event.showInstructions,
            instructionsActive: false,
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

    render() {
        const tabs = [];
        tabs.push(<Tab key={1} icon={<TuneIcon />} label="Options" />);
        tabs.push(<Tab key={2} icon={<StyleIcon />} label="Style" />);

        return (
            <>
                {this.state.instructionsActive && <ScreenInstructions
                    instructions={this.props.instructions}
                    showInstructions={this.state.showInstructions}
                    onClose={this.handleInstructionsClose} />}

                {!this.state.instructionsActive && <ScreenWizard category={this.props.category}>
                    <Form>

                        <Tabs
                            value={this.state.activeTab}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered>
                            {tabs}
                        </Tabs>

                        {this.state.activeTab === 0 && <TabContent>
                            <section>
                                {this.props.drillPresets.length > 0 && <>
                                    <p><Text manuscript arrow arrowDirection="bottom" arrowPosition="left" arrowVariant="primary">Use an existing preset</Text></p>
                                    <PresetsList
                                        fixedPresets={this.props.drillPresets}
                                        customPresets={this.props.customPresets.drill[this.props.name]}
                                        onSelectPreset={this.handleDrillSettingsChange}
                                        onDeletePreset={this.handleDrillSettingsDelete}
                                        onNewPreset={this.handleDrillSettingsSave} />
                                </>}
                                <p><Text manuscript arrow arrowDirection="bottom" arrowPosition="left" arrowVariant="secondary">Customize a new drill</Text></p>
                                {React.cloneElement(this.props.form, {
                                    ...this.state.drillSettings,
                                    keyboardDetected: this.props.keyboardDetected,
                                    onChange: this.handleDrillSettingsChange,
                                })}
                            </section>
                        </TabContent>}

                        {this.state.activeTab === 1 && <TabContent>
                            <section>
                                {DefaultPresets.length > 0 && <>
                                    <p><Text manuscript arrow arrowDirection="bottom" arrowPosition="left" arrowVariant="primary">Use an existing preset</Text></p>
                                    <PresetsList
                                        fixedPresets={DefaultPresets}
                                        customPresets={this.props.customPresets.text}
                                        onSelectPreset={this.handleTextSettingsChange}
                                        onDeletePreset={this.handleTextSettingsDelete}
                                        onNewPreset={this.handleTextSettingsSave} />
                                </>}
                                <p><Text manuscript arrow arrowDirection="bottom" arrowPosition="left" arrowVariant="secondary">Customize how the text is displayed</Text></p>
                                <FormText {...this.state.textSettings} onChange={this.handleTextSettingsChange} />
                            </section>
                        </TabContent>}

                    </Form>

                    <LargeButtonGroup>
                        <LargeButton text="Instructions" colorText="white" colorBackground="#111" onClick={this.handleInstructionsClick} />
                        <LargeButton text="Start" colorText="white" colorBackground="#111" onClick={this.handleValidateClick} />
                    </LargeButtonGroup>
                </ScreenWizard>}
            </>
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
    // The category of the drill
    category: PropTypes.oneOf(['vision-span', 'chunking', 'practice']).isRequired,
    // The name of the drill (drillCircle, drillPractice, etc.)
    name: PropTypes.string.isRequired,

    form: PropTypes.element.isRequired,
    instructions: PropTypes.node.isRequired,

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

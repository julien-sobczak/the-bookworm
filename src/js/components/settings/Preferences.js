import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import LanguageIcon from '@material-ui/icons/Language';
import StyleIcon from '@material-ui/icons/Style';
import StorageIcon from '@material-ui/icons/Storage';
import ExtensionIcon from '@material-ui/icons/Extension';
import EditIcon from '@material-ui/icons/Edit';

import { updateGlobalPreferences, updateLanguagePreferences, updateTextPreferences, updateChunkPreferences } from '../../store/actions';


import Screen from '../toolbox/Screen';
import FormCalibration from './FormCalibration';
import FormLanguage from './FormLanguage';
import FormText from './FormText';
import FormChunk from './FormChunk';
import FormStorage from './FormStorage';

function Preference({ settings, form, onClose }) {
    const [currentSettings, setCurrentSettings] = useState(settings);
    const onChange = (settings) => {
        setCurrentSettings(settings);
    };
    return (
        <Screen colored={true} scrollable={true} onClose={() => onClose(currentSettings)}>
            {React.cloneElement(form, {
                ...currentSettings,
                onChange: onChange,
            })}
        </Screen>
    );
}
Preference.propTypes = {
    settings: PropTypes.object.isRequired,
    form: PropTypes.node.isRequired,
    onClose: PropTypes.func,
};
Preference.defaultProps = {
    settings: {},
};

function Preferences(props) {

    const [setting, setSetting] = useState(undefined);

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
    }));

    const saveCalibrationPreferences = (settings) => {
        if (window && window.document) {
            document.documentElement.style.setProperty('--scale', settings.displayScale);
        }
        props.updateGlobalPreferences(settings);
        setSetting(undefined);
    };

    const saveLanguagePreferences = (settings) => {
        this.props.updateLanguagePreferences(settings);
        setSetting(undefined);
    };

    const saveTextPreferences = (settings) => {
        this.props.updateTextPreferences(settings);
        setSetting(undefined);
    };

    const saveChunkPreferences = (settings) => {
        this.props.updateChunkPreferences(settings);
        setSetting(undefined);
    };

    const saveStoragePreferences = () => {
        // Nothing to save in Redux
        setSetting(undefined);
    };

    const classes = useStyles();

    return (
        <div className="Preferences InnerContent">

            {setting === 'calibration' && <Preference settings={props.preferences.global} form={<FormCalibration />} onClose={saveCalibrationPreferences} />}
            {setting === 'language'    && <Preference settings={props.preferences.language} form={<FormLanguage />} onClose={saveLanguagePreferences} />}
            {setting === 'text'        && <Preference settings={props.preferences.text} form={<FormText />} onClose={saveTextPreferences} />}
            {setting === 'chunk'       && <Preference settings={props.preferences.chunk} form={<FormChunk />} onClose={saveChunkPreferences} />}
            {setting === 'storage'     && <Preference form={<FormStorage />} onClose={saveStoragePreferences} />}

            <div className={classes.root}>
                <Chip
                    icon={<AspectRatioIcon fontSize="small" />}
                    label="Calibration"
                    clickable
                    color="primary"
                    onClick={() => setSetting("calibration")}
                    onDelete={() => setSetting("calibration")}
                    deleteIcon={<EditIcon />}
                />
                <Chip
                    icon={<LanguageIcon fontSize="small" />}
                    label="Language"
                    clickable
                    color="primary"
                    onClick={() => setSetting("language")}
                    onDelete={() => setSetting("language")}
                    deleteIcon={<EditIcon />}
                />
                <Chip
                    icon={<StyleIcon fontSize="small" />}
                    label="Text"
                    clickable
                    color="primary"
                    onClick={() => setSetting("text")}
                    onDelete={() => setSetting("text")}
                    deleteIcon={<EditIcon />}
                />
                <Chip
                    icon={<ExtensionIcon fontSize="small" />}
                    label="Chunk"
                    clickable
                    color="primary"
                    onClick={() => setSetting("chunk")}
                    onDelete={() => setSetting("chunk")}
                    deleteIcon={<EditIcon />}
                />
                <Chip
                    icon={<StorageIcon fontSize="small" />}
                    label="Storage"
                    clickable
                    color="primary"
                    onClick={() => setSetting("storage")}
                    onDelete={() => setSetting("storage")}
                    deleteIcon={<EditIcon />}
                />

            </div>

        </div>
    );

}

Preferences.propTypes = {
    // Redux state
    preferences: PropTypes.object.isRequired,
    updateGlobalPreferences: PropTypes.func.isRequired,
    updateLanguagePreferences: PropTypes.func.isRequired,
    updateTextPreferences: PropTypes.func.isRequired,
    updateChunkPreferences: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        preferences: state.preferences,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateGlobalPreferences: prefs => dispatch(updateGlobalPreferences(prefs)),
        updateLanguagePreferences: prefs => dispatch(updateLanguagePreferences(prefs)),
        updateTextPreferences: prefs => dispatch(updateTextPreferences(prefs)),
        updateChunkPreferences: prefs => dispatch(updateChunkPreferences(prefs)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);

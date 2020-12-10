import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { updateGlobalPreferences, updateLanguagePreferences, updateTextPreferences, updateChunkPreferences } from '../../store/actions';

import FormGlobal from './FormGlobal';
import FormLanguage from './FormLanguage';
import FormText from './FormText';
import FormChunk from './FormChunk';
import FormLocalStorage from './FormLocalStorage';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import StyleIcon from '@material-ui/icons/Style';
import StorageIcon from '@material-ui/icons/Storage';

class Preferences extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleGlobalPreferencesChange = this.handleGlobalPreferencesChange.bind(this);
        this.handleLanguagePreferencesChange = this.handleLanguagePreferencesChange.bind(this);
        this.handleTextPreferencesChange = this.handleTextPreferencesChange.bind(this);
        this.handleChunkPreferencesChange = this.handleChunkPreferencesChange.bind(this);
    }

    handleTabChange(event, activeTab) {
        this.setState({ activeTab: activeTab });
    }

    handleGlobalPreferencesChange(prefs) {
        console.log('Saving global preferences...', prefs);
        if (window && window.document) {
            document.documentElement.style.setProperty('--scale', prefs.displayScale);
        }
        this.props.updateGlobalPreferences(prefs);
    }

    handleLanguagePreferencesChange(prefs) {
        console.log('Saving language preferences...', prefs);
        this.props.updateLanguagePreferences(prefs);
    }

    handleTextPreferencesChange(prefs) {
        console.log('Saving text preferences...', prefs);
        this.props.updateTextPreferences(prefs);
    }

    handleChunkPreferencesChange(prefs) {
        console.log('Saving chunk preferences...', prefs);
        this.props.updateChunkPreferences(prefs);
    }

    render() {
        return (
            <div className="Preferences InnerContent">

                <Tabs
                    value={this.state.activeTab}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered>
                    <Tab icon={<StyleIcon />} label="Style" />
                    <Tab icon={<StorageIcon />} label="Storage" />
                </Tabs>

                {this.state.activeTab === 0 && <div className="TabContent Centered">

                    <section>
                        <h4>Global</h4>
                        <p>Define global settings.</p>
                        <FormGlobal {...this.props.preferences.global} onChange={this.handleGlobalPreferencesChange} />
                    </section>

                    <section>
                        <h4>Language</h4>
                        <p>Define the default selected language in the library.</p>
                        <FormLanguage {...this.props.preferences.language} onChange={this.handleLanguagePreferencesChange} />
                    </section>

                    <section>
                        <h4>Font</h4>
                        <p>Define how texts are displayed in the drills.</p>
                        <FormText {...this.props.preferences.text} onChange={this.handleTextPreferencesChange} />
                    </section>

                    <section>
                        <h4>Chunking</h4>
                        <p>Define how chunks are displayed in the drills.</p>
                        <FormChunk {...this.props.preferences.chunk} onChange={this.handleChunkPreferencesChange} />
                    </section>

                </div>}

                {this.state.activeTab === 1 && <div className="TabContent Centered">
                    <section>
                        <h4>localStorage</h4>
                        <p>Manage locally saved contents.</p>
                        <FormLocalStorage />
                    </section>
                </div>}

            </div>
        );
    }

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

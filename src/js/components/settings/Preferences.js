import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { updateLanguagePreferences, updateTextPreferences, updateChunkPreferences } from '../../store/actions';

import FormLanguage from './FormLanguage';
import FormText from './FormText';
import FormChunk from './FormChunk';
import FormLocalStorage from './FormLocalStorage';

import Tab from '@material/react-tab';
import TabBar from '@material/react-tab-bar';
import MaterialIcon from '@material/react-material-icon';

import '@material/react-tab-bar/dist/tab-bar.css';
import '@material/react-tab-scroller/dist/tab-scroller.css';
import '@material/react-tab/dist/tab.css';
import '@material/react-tab-indicator/dist/tab-indicator.css';

class Preferences extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
        };
    }

    handleActiveIndexUpdate(activeIndex) {
        this.setState({ activeIndex: activeIndex });
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

                <TabBar
                    activeIndex={this.state.activeIndex}
                    handleActiveIndexUpdate={this.handleActiveIndexUpdate}>
                    <Tab indicatorContent={<MaterialIcon icon='style' />}>
                    </Tab>
                    <Tab indicatorContent={<MaterialIcon icon='storage' />}>
                    </Tab>
                </TabBar>

                {this.state.activeIndex === 0 && <div className="TabContent Centered">

                    <section>
                        <h4>Language</h4>
                        <p>Control the language selected by default in the library.</p>
                        <FormLanguage {...this.props.preferences.language} onChange={this.handleLanguagePreferencesChange} />
                    </section>

                    <section>
                        <h4>Font</h4>
                        <p>Control how texts are displayed in the drills.</p>
                        <FormText {...this.props.preferences.text} onChange={this.handleTextPreferencesChange} />
                    </section>

                    <section>
                        <h4>Chunking</h4>
                        <p>Control how chunks are displayed during chunking drills.</p>
                        <FormChunk {...this.props.preferences.chunk} onChange={this.handleChunkPreferencesChange} />
                    </section>

                </div>}

                {this.state.activeIndex === 1 && <div className="TabContent Centered">
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
        updateLanguagePreferences: prefs => dispatch(updateLanguagePreferences(prefs)),
        updateTextPreferences: prefs => dispatch(updateTextPreferences(prefs)),
        updateChunkPreferences: prefs => dispatch(updateChunkPreferences(prefs)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);

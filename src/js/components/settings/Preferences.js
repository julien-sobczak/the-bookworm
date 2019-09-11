import React from 'react';
import { connect } from "react-redux";

import { updateTextPreferences, updateChunkPreferences } from '../../store/actions';

import FormText from './FormText';
import FormChunk from './FormChunk';

import Tab from '@material/react-tab';
import TabBar from '@material/react-tab-bar';
import MaterialIcon from '@material/react-material-icon';

import '@material/react-tab-bar/dist/tab-bar.css';
import '@material/react-tab-scroller/dist/tab-scroller.css';
import '@material/react-tab/dist/tab.css';
import '@material/react-tab-indicator/dist/tab-indicator.css';

const mapStateToProps = state => {
    return {
        preferences: state.preferences,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateTextPreferences: prefs => dispatch(updateTextPreferences(prefs)),
        updateChunkPreferences: prefs => dispatch(updateChunkPreferences(prefs)),
    };
};

class Preferences extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
        };
    }

    handleActiveIndexUpdate = (activeIndex) => this.setState({ activeIndex: activeIndex });

    handleTextPreferencesChange = (style) => {
        console.log('Saving text preferences...', style);
        this.props.updateTextPreferences(style);
    };

    handleChunkPreferencesChange = (style) => {
        console.log('Saving chunk preferences...', style);
        this.props.updateChunkPreferences(style);
    };

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
                        <h4>EPUB</h4>
                        <p>Manage local saved ePubs.</p>
                        TODO
                    </section>
                </div>}

            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);

import React from 'react';
import PropTypes from 'prop-types';

import MainButton from '../../toolbox/MainButton';
import Configurator from '../../toolbox/Stylizer';
import * as helpers from '../../functions/engine';

// Material Design UI forms
import Switch from '@material/react-switch';
import "@material/react-switch/dist/switch.css";

import Drill from './Drill';
import Engine from './Engine';
import Viewer from './Viewer';

class Wizard extends React.Component {

    PREDEFINED_DRILLS = [
        {
            name: "A",
            difficulty: 0,
            options: { span: "0.75in" },
        },
        {
            name: "B",
            difficulty: 0,
            options: { span: "1in" },
        },
        {
            name: "C",
            difficulty: 0,
            options: { span: "1.25in" },
        },
        {
            name: "D",
            difficulty: 1,
            options: { span: "1.5in" },
        },
        {
            name: "E",
            difficulty: 1,
            options: { span: "1.75in" },
        },
        {
            name: "F",
            difficulty: 1,
            options: { span: "2in" },
        },
        {
            name: "G",
            difficulty: 2,
            options: { span: "2.25in" },
        },
        {
            name: "H",
            difficulty: 2,
            options: { span: "2.5in" },
        },
        {
            name: "I",
            difficulty: 2,
            options: { span: "2.75in" },
        },
    ];

    DEFAULT_LINES = 5;
    DEFAULT_DRILL = new Engine(this.DEFAULT_LINES).getDrill();

    constructor(props) {
        super(props);

        this.state = {
            // Copy default settings to make them editable
            lines: props.lines,
            span: props.span,
            autoLevel: props.autoLevel,

            // Preview drill
            drill: this.DEFAULT_DRILL,

            // Copy styling settings as state to update during a drill session
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.fontStyle,
            backgroundColor: props.backgroundColor,
            color: props.color,
        };

        this.handleLinesChange = this.handleLinesChange.bind(this);
        this.handleSpanChange = this.handleSpanChange.bind(this);
        this.handleAutoLevelChange = this.handleAutoLevelChange.bind(this);
        this.usePredefinedDrill = this.usePredefinedDrill.bind(this);

        this.handleStyleChanged = this.handleStyleChanged.bind(this);
        this.handleValidateClick = this.handleValidateClick.bind(this);
    }

    /** Called when the user update the settings. */
    handleStyleChanged = (event) => {
        const newFontFamily = event.fontFamily;
        const newFontSize = event.fontSize;
        const newFontStyle = event.fontStyle;
        const newBackgroundColor = event.backgroundColor;
        const newColor = event.color;
        this.setState(state => ({
            ...state,
            fontFamily: newFontFamily,
            fontSize: newFontSize,
            fontStyle: newFontStyle,
            backgroundColor: newBackgroundColor,
            color: newColor,
        }));
    }

    handleLinesChange(event) {
        const newState = {
            ...this.state,
            lines: event.target.value,
        }
        this.setState(newState);
    }

    handleAutoLevelChange(event) {
        const newState = {
            ...this.state,
            autoLevel: event.target.checked,
        }
        this.setState(newState);
    }

    handleSpanChange(event) {
        const newState = {
            ...this.state,
            span: event.target.value,
        }
        this.setState(newState);
    }

    usePredefinedDrill(event) {
        const predefinedDrill = JSON.parse(event.target.dataset.drill);
        const newState = {
            ...this.state,
            ...predefinedDrill,
        };
        this.setState(newState);
    }

    render() {
        const predefinedDrills = [];
        for (let d = 0; d < this.PREDEFINED_DRILLS.length; d++) {
            const drill = this.PREDEFINED_DRILLS[d];
            predefinedDrills.push(
                <button onClick={this.usePredefinedDrill} key={d} data-difficulty={drill.difficulty} data-drill={JSON.stringify(drill.options)}>{drill.name}</button>
            );
        }

        return (
            <div className="FullScreen Wizard Centered" style={{backgroundColor: this.state.backgroundColor, color: this.state.color}}>

                <section className="Options">

                    <div className="PredefinedOptions">
                        {predefinedDrills}
                    </div>

                    {this.state.multiple && <div className="Option">
                        <input type="number" min="1" max="30" name="lines" value={this.state.lines} onChange={this.handleLinesChange} />
                        <label htmlFor="lines">Lines</label>
                    </div>}

                    <div className="Option">
                        <select name="span" onChange={this.handleSpanChange} value={this.state.span}>
                            {helpers.SPANS.map((s, index) => {
                                return <option key={index} value={s}>{s}</option>
                            })}
                        </select>
                        <label htmlFor="span">Span</label>
                    </div>

                    <div className="Option">
                        <Switch
                            nativeControlId='autoLevel'
                            checked={this.state.autoLevel}
                            onChange={this.handleAutoLevelChange} />
                        <label htmlFor="autoLevel">Auto level</label>
                    </div>

                </section>

                <section className="Preview Centered" style={{height: "6em", fontSize: this.state.fontSize}}>

                    <Viewer
                        drill={this.state.drill}
                        span={this.state.span}
                        fontFamily={this.state.fontFamily}
                        fontSize={this.state.fontSize}
                        fontStyle={this.state.fontStyle}
                        backgroundColor={this.state.backgroundColor}
                        color={this.state.color} />

                </section>

                <MainButton className="ButtonStart" text="Start" onClick={this.handleValidateClick} />

                <Configurator
                            fontFamily={this.state.fontFamily}
                            fontSize={this.state.fontSize}
                            fontStyle={this.state.fontStyle}
                            backgroundColor={this.state.backgroundColor}
                            color={this.state.color}
                            onChange={this.handleStyleChanged} />
            </div>
        );
    }

    handleValidateClick() {
        this.props.onValidate({
            multiple: this.state.multiple,
            lines: this.state.lines,
            columns: this.state.columns,
            spans: this.state.spans,
            autoLevel: this.state.autoLevel,

            fontFamily: this.state.fontFamily,
            fontSize: this.state.fontSize,
            fontStyle: this.state.fontStyle,
            backgroundColor: this.state.backgroundColor,
            color: this.state.color,
        })
    }

}

Wizard.propTypes = {
    ...Drill.propTypes,
    onValidate: PropTypes.func,
};

Wizard.defaultProps = {
    ...Drill.defaultProps,
    onValidate: function() {},
};

export default Wizard;
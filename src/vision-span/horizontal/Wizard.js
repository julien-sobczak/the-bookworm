import React from 'react';
import PropTypes from 'prop-types';

import MainButton from '../../toolbox/MainButton';
import Configurator from '../Configurator';
import * as helpers from '../../toolbox/EngineHelpers';

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
            options: { multiple: true, lines: 1, columns: 3, spans: ["1.25in", "1.25in"] },
        },
        {
            name: "B",
            difficulty: 0,
            options: { multiple: true, lines: 1, columns: 5, spans: ["1.25in", "0", "0", "1.25in"] },
        },
        {
            name: "C",
            difficulty: 1,
            options: { multiple: true, lines: 1, columns: 5, spans: ["0.75in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "D",
            difficulty: 1,
            options: { multiple: true, lines: 1, columns: 7, spans: ["0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in"] },
        },
        {
            name: "E",
            difficulty: 2,
            options: { multiple: true, lines: 1, columns: 9, spans: ["0.75in", "0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "F",
            difficulty: 0,
            options: { multiple: true, lines: 2, columns: 3, spans: ["1in", "1in"] },
        },
        {
            name: "G",
            difficulty: 1,
            options: { multiple: true, lines: 3, columns: 7, spans: ["0.5in", "0.5in", "0in", "0in", "0.5in", "0.5in"] },
        },
        {
            name: "H",
            difficulty: 1,
            options: { multiple: true, lines: 3, columns: 5, spans: ["0.75in", "0.75in", "0.75in", "0.75in"] },
        },
        {
            name: "I",
            difficulty: 1,
            options: { multiple: false, lines: 5, columns: 7, spans: ["0.75in", "0.75in", "0in", "0in", "0.75in", "0.75in"] },
        },
        {
            name: "J",
            difficulty: 2,
            options: { multiple: true, lines: 3, columns: 7, spans: ["0.75in", "0.75in", "0.75in", "0.75in", "0.75in", "0.75in"] },
        },

    ];

    DEFAULT_DRILL = new Engine(
                            Drill.defaultProps.lines,
                            Drill.defaultProps.columns,
                            Drill.defaultProps.multiple ? 2 : 1).getDrill();

    constructor(props) {
        super(props);

        this.state = {
            // Copy default settings to make them editable
            multiple: props.multiple,
            lines: props.lines,
            columns: props.columns,
            spans: props.spans,
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

        this.handleColumnsChange = this.handleColumnsChange.bind(this);
        this.handleMultipleChange = this.handleMultipleChange.bind(this);
        this.handleLinesChange = this.handleLinesChange.bind(this);
        this.handleAutoLevelChange = this.handleAutoLevelChange.bind(this);
        this.handleSpansChange = this.handleSpansChange.bind(this);
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

    handleColumnsChange(event) {
        const newColumn = event.target.value;
        const newState = {
            ...this.state,
            columns: newColumn,
            spans: Array(newColumn - 1).fill(this.state.spans[0]),
        }
        newState.drill = this.refreshDrill(newState);
        this.setState(newState);
    }

    handleMultipleChange(event) {
        const newState = {
            ...this.state,
            multiple: event.target.value === "true",
        }
        newState.drill = this.refreshDrill(newState);
        this.setState(newState);
    }

    handleLinesChange(event) {
        const newState = {
            ...this.state,
            lines: event.target.value,
        }
        newState.drill = this.refreshDrill(newState);
        this.setState(newState);
    }

    handleAutoLevelChange(event) {
        const newState = {
            ...this.state,
            autoLevel: event.target.value === "true",
        }
        this.setState(newState);
    }

    handleSpansChange(event) {
        const spanIndex = event.target.dataset.span;
        const spanValue = event.target.value;
        const newSpans = this.state.spans.slice(0);
        newSpans[spanIndex] = spanValue;
        newSpans[this.state.columns-spanIndex-2] = spanValue; // spans are symmetrical
        const newState = {
            ...this.state,
            spans: newSpans,
        }
        newState.drill = this.refreshDrill(newState);
        this.setState(newState);
    }

    refreshDrill(newState) {
        const newDrill = new Engine(newState.lines, newState.columns, newState.multiple ? 2 : 1).getDrill();
        return newDrill;
    }

    usePredefinedDrill(event) {
        const predefinedDrill = JSON.parse(event.target.dataset.drill);
        const newState = {
            ...this.state,
            ...predefinedDrill,
        };
        newState.drill = this.refreshDrill(newState);
        this.setState(newState);
    }

    render() {
        const spans = [];
        for (let c = 0; c < this.state.columns - 1; c++) {
            const disabled = (c >= (this.state.columns - 1) / 2);
            spans.push(
                <span key={c}>
                    {c > 0 && <span className="DotSeparator"></span>}
                    <select name="spans" onChange={this.handleSpansChange} data-span={c} value={this.state.spans[c]} disabled={disabled}>
                        {helpers.SPANS.map((s, index) => {
                            return <option key={index} value={s}>{s}</option>
                        })}
                    </select>
                </span>
            );
        }

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

                    <div className="Option">
                        <select name="columns" onChange={this.handleColumnsChange} value={this.state.columns}>
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                            <option value={7}>7</option>
                            <option value={9}>9</option>
                        </select>
                        <label htmlFor="columns">Columns</label>
                    </div>

                    <div className="Option">
                        <select name="columns" onChange={this.handleMultipleChange} value={this.state.multiple}>
                            <option value={false}>Unique</option>
                            <option value={true}>Multiple</option>
                        </select>
                        <label htmlFor="columns">Series</label>
                    </div>

                    {this.state.multiple && <div className="Option" value={this.state.lines}>
                        <select name="lines" onChange={this.handleLinesChange}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </select>
                        <label htmlFor="lines">Lines</label>
                    </div>}

                    <div className="Option">
                        <Switch
                            nativeControlId='autoLevel'
                            checked={this.state.autoLevel}
                            onChange={this.handleAutoLevelChange} />
                        <label htmlFor="autoLevel">Auto level</label>
                    </div>

                    <br/>

                    <div className="Spans">
                        {spans}
                    </div>

                </section>

                <section className="Preview Centered" style={{height: "6em", fontSize: this.state.fontSize}}>

                    <Viewer
                        drill={this.state.drill}
                        spans={this.state.spans}
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
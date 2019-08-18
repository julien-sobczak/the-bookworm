import React from 'react';
import PropTypes from 'prop-types';

import MainButton from '../../toolbox/MainButton';
import Configurator from '../../toolbox/Stylizer';
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
            options: { size: 3, span: "0.75in" },
        },
        {
            name: "B",
            difficulty: 1,
            options: { size: 3, span: "1in" },
        },
        {
            name: "C",
            difficulty: 2,
            options: { size: 3, span: "1.5in" },
        },
        {
            name: "D",
            difficulty: 1,
            options: { size: 5, span: "0.50in" },
        },
        {
            name: "E",
            difficulty: 2,
            options: { size: 5, span: "1in" },
        },
        {
            name: "F",
            difficulty: 2,
            options: { size: 5, span: "1.25in" },
        },
        {
            name: "G",
            difficulty: 1,
            options: { size: 7, span: "0.50in" },
        },
        {
            name: "H",
            difficulty: 2,
            options: { size: 7, span: "0.75in" },
        },
        {
            name: "I",
            difficulty: 2,
            options: { size: 7, span: "1in" },
        },
        {
            name: "J",
            difficulty: 2,
            options: { size: 9, span: "0.75in" },
        },
    ];

    DEFAULT_SIZE = 3;
    DEFAULT_DRILL = new Engine(this.DEFAULT_SIZE).getDrill();

    constructor(props) {
        super(props);

        this.state = {
            // Copy default settings to make them editable
            size: props.size,
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

        this.handleSizeChange = this.handleSizeChange.bind(this);
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

    handleSizeChange(event) {
        const newSize = event.target.value;
        const newState = {
            ...this.state,
            size: newSize,
        }
        newState.drill = this.refreshDrill(newState);
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

    refreshDrill(newState) {
        const newDrill = new Engine(newState.size).getDrill();
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
                        <select name="size" onChange={this.handleSizeChange} value={this.state.size}>
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                            <option value={7}>7</option>
                            <option value={9}>9</option>
                        </select>
                        <label htmlFor="size">Size</label>
                    </div>

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
            size: this.state.size,
            span: this.state.span,
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
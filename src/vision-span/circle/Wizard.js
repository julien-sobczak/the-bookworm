import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../toolbox/Button';
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
            options: { span: "1.25in" },
        },
        {
            name: "B",
            difficulty: 0,
            options: { span: "1.75in" },
        },
        {
            name: "C",
            difficulty: 1,
            options: { span: "2.25in" },
        },
        {
            name: "D",
            difficulty: 1,
            options: { span: "2.75in" },
        },
        {
            name: "E",
            difficulty: 1,
            options: { span: "3.25in" },
        },
        {
            name: "F",
            difficulty: 2,
            options: { span: "3.75in" },
        },
        {
            name: "G",
            difficulty: 2,
            options: { span: "4.25in" },
        },
    ];

    DEFAULT_DRILL = new Engine().getDrill();

    constructor(props) {
        super(props);

        this.state = {
            // Copy default settings to make them editable
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

        this.handleAutoLevelChange = this.handleAutoLevelChange.bind(this);
        this.handleSpanChange = this.handleSpanChange.bind(this);
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

                <Button className="ButtonStart" text="Start" onClick={this.handleValidateClick} />

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
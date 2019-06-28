import React from 'react';
import Select, {Option} from '@material/react-select';
import Button from '@material/react-button';
import PropTypes from 'prop-types';

import '@material/react-select/dist/select.css';
import '@material/react-list/dist/list.css';
import '@material/react-menu/dist/menu.css';
import '@material/react-menu-surface/dist/menu-surface.css';
import '@material/react-icon-button/dist/icon-button.css';
import '@material/react-button/dist/button.css';

import './PracticeWizard.css';

// https://github.com/material-components/material-components-web-react
class PracticeWizard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            font: 'Roboto',
            style: 'Normal',
            size: 'Size14pt',
            span: 'Span2',
        };

        this.toggleDemo = this.toggleDemo.bind(this);
    }

    toggleDemo() {
        this.setState(state => ({
            ...state,
            playing: !this.state.playing
        }))
    }

    onFontChange = (index, item) => (
        this.setState(state => ({
            ...state,
            font: item.getAttribute('data-value'),
        }))
    );

    onStyleChange = (index, item) => (
        this.setState(state => ({
            ...state,
            style: item.getAttribute('data-value'),
        }))
    );

    onSizeChange = (index, item) => (
        this.setState(state => ({
            ...state,
            size: item.getAttribute('data-value'),
        }))
    );

    onSpanChange = (index, item) => (
        this.setState(state => ({
            ...state,
            span: item.getAttribute('data-value'),
        }))
    );

    render() {
        return (
            <div className="wizard">
                <h3>Customize</h3>
                <ul className={this.state.font + ' ' + this.state.style + ' ' + this.state.size}>
                    <li className="Control">
                        <Select
                            enhanced
                            label='Choose Font'
                            value={this.state.font}
                            onEnhancedChange={this.onFontChange}>
                            <Option value='Roboto' className="Roboto">Roboto</Option>
                            <Option value='Slabo' className="Slabo">Slabo</Option>
                            <Option value='SourceCodePro' className="SourceCodePro">Source Code Pro</Option>
                            <Option value='Sacramento' className="Sacramento">Sacramento</Option>
                            <Option value='FredokaOne' className="FredokaOne">Fredoka One</Option>
                        </Select>
                    </li>
                    <li className="Control">
                        <Select
                            enhanced
                            label='Choose Style'
                            value={this.state.style}
                            onEnhancedChange={this.onStyleChange}>
                            <Option value='Normal' className={"Normal " + this.state.font}>Normal</Option>
                            <Option value='Bold' className={"Bold " + this.state.font}>Bold</Option>
                            <Option value='Italic' className={"Italic " + this.state.font}>Italic</Option>
                            <Option value='BoldItalic' className={"BoldItalic " + this.state.font}>Bold Italic</Option>
                        </Select>
                    </li>
                    <li className="Control">
                        <Select
                            enhanced
                            label='Choose Size'
                            value={this.state.size}
                            onEnhancedChange={this.onSizeChange}>
                            <Option value='Size10pt' className={"Size10pt " + this.state.style + ' ' + this.state.font}>10pt</Option>
                            <Option value='Size12pt' className={"Size12pt " + this.state.style + ' ' + this.state.font}>12pt</Option>
                            <Option value='Size14pt' className={"Size14pt " + this.state.style + ' ' + this.state.font}>14pt</Option>
                            <Option value='Size16pt' className={"Size16pt " + this.state.style + ' ' + this.state.font}>16pt</Option>
                            <Option value='Size18pt' className={"Size18pt " + this.state.style + ' ' + this.state.font}>18pt</Option>
                        </Select>
                    </li>
                </ul>
                <ul>
                    <li className="Control">
                        <Select
                            enhanced
                            label='Choose Span'
                            value={this.state.span}
                            onEnhancedChange={this.onSpanChange}>
                            <Option value='Span1' className={"Span1"}>0.5 in</Option>
                            <Option value='Span2' className={"Span2"}>1 in</Option>
                            <Option value='Span3' className={"Span3"}>1.5 in</Option>
                            <Option value='Span4' className={"Span4"}>2 in</Option>
                            <Option value='Span5' className={"Span5"}>2.5 in</Option>
                            <Option value='Span6' className={"Span6"}>3 in</Option>
                            <Option value='Span7' className={"Span7"}>3.5 in</Option>
                            <Option value='Span8' className={"Span8"}>4.0 in</Option>
                            <Option value='Span9' className={"Span9"}>4.5 in</Option>
                        </Select>
                    </li>
                </ul>

                <div className={"Preview " + this.state.font + ' ' + this.state.style + ' ' + this.state.size}>
                    {React.cloneElement(this.props.demo, { autoplay: this.state.playing, span: this.state.span })}
                </div>

                <Button raised icon={<i className="material-icons">{this.state.playing ? 'pause_arrow' : 'play_arrow'}</i>} onClick={this.toggleDemo}>
                    Demo
                </Button>
                <Button raised icon={<i className="material-icons">play_arrow</i>} onClick={this.props.onGo}>
                    Go!
                </Button>
            </div>
        );
    }

}

PracticeWizard.propTypes = {
    demo: PropTypes.element,
    go: PropTypes.func,
};

PracticeWizard.defaultProps = {
    demo: React.createElement('div'),
};

export default PracticeWizard;

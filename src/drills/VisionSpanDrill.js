import React from 'react';
import { Link } from "react-router-dom";

import PracticeWizard from './PracticeWizard';
import VisionSpanDemo from './VisionSpanDemo';

class VisionSpanDrill extends React.Component {

    CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    MAPPING_INCHES = {
        '.5in': 1,
        '0.5in': 1,
        '1in': 2,
        '1.0in': 2,
        '1.5in': 3,
        '2in': 4,
        '2.0in': 4,
        '2.5in': 5,
        '3in': 6,
        '3.0in': 6,
        '3.5in': 7,
        '4in': 8,
        '4.0in': 8,
        '4.5in': 9,
        '5in': 10,
        '5.0in': 10,
        '5.5in': 11,
        '6in': 12,
        '6.0in': 12,
        '6.5in': 13,
        '7in': 14,
        '7.0in': 14,
        '7.5in': 15,
        '8in': 16,
        '8.0in': 16,
        '8.5in': 17,
        '9in': 18,
        '9.0in': 18,
        '9.5in': 19,
        '10in': 20,
        '10.0in': 20,
        '10.5in': 21,
        '11in': 22,
        '11.0in': 22,
        '11.5in': 23,
        '12in': 24,
        '12.0in': 24,
        '12.5in': 25,
    }

    constructor(props) {
        super(props);

        this.state = {
            started: false,
            span: this.MAPPING_INCHES[props.span], // current span
            selection: '', // input from user
            drill: this.createDrill(), // the drill content
            currentLine: 0, // the current position inside the drill
            errorCount: 0, // the count of error for the current drill
        };

        // create a ref to store the textInput DOM element
        this.textInput = React.createRef();

        // This binding is necessary to make `this` work in the callback
        this.start = this.start.bind(this);
        this.increaseSpan = this.increaseSpan.bind(this);
        this.reduceSpan = this.reduceSpan.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    start() {
        this.setState(state => ({
            ...state,
            started: true,
        }));
    }

    createDrill() {
        return {
            lines: [
                {
                    texts: [
                        {
                            text: this.randomLetter(),
                            valid: null,
                        },
                        {
                            text: this.randomLetter(),
                            valid: null,
                        },
                        {
                            text: this.randomLetter(),
                            valid: null,
                        },
                    ]
                }
            ]
        }
    }

    randomLetter() {
        return this.CHARACTERS.charAt(Math.floor(Math.random() * this.CHARACTERS.length))
    }

    increaseSpan() {
        this.textInput.current.focus();
        this.setState(state => ({
            ...state,
            span: state.span + 1,
        }));
    }

    reduceSpan() {
        this.textInput.current.focus();
        this.setState(state => ({
            ...state,
            span: state.span - 1,
        }));
    }

    handleKeyPress = (event) => {
        let key = event.key;

        const line = this.state.drill.lines[this.state.currentLine];
        const leftCharacter = line.texts[0];
        const rightCharacter = line.texts[line.texts.length - 1];

        const leftCharacterValid = leftCharacter.valid || key.toUpperCase() === leftCharacter.text
        const rightCharacterValid = rightCharacter.valid || key.toUpperCase() === rightCharacter.text

        const hasChanged = leftCharacterValid !== leftCharacter.valid || rightCharacterValid !== rightCharacter.valid;

        if (leftCharacterValid && rightCharacterValid) {
            // Great!

            // Check to adjust the level
            let newSpan = this.state.span;
            if (this.state.errorCount < 2) {
                newSpan++
            } else if (this.state.errorCount > 4) {
                newSpan--
            }

            // New Game
            this.setState(state => ({
                ...state,
                drill: this.createDrill(),
                selection: '',
                errorCount: 0,
                span: newSpan,
            }));
        } else {
            // Better! Continue.
            leftCharacter.valid = leftCharacterValid;
            rightCharacter.valid = rightCharacterValid;
            this.setState(state => ({
                ...state,
                drill: { lines: [line] },
                selection: hasChanged ? '' : key, // Show the pressed key only on error
                errorCount: hasChanged ? state.errorCount : state.errorCount+1,
            }));
        }

        this.textInput.current.value = '';
    }


    render() {
        let spanClassName = 'Span' + this.state.span;

        return (
            <div>
                {/* Configure */}
                {!this.state.started && <PracticeWizard demo={<VisionSpanDemo/>} onGo={this.start} />}

                {/* Play */}
                <input ref={this.textInput} className="hidden" type="text" onKeyPress={this.handleKeyPress} />
                {this.state.started && <div className="drill VisionSpanDrill">

                    <Link to="/vision-span/" className="closeBtn"><i className="material-icons">close</i></Link>

                    <section className="GameControls">
                        <ul>
                            <li><button onClick={this.increaseSpan}><i className="material-icons">chevron_left</i></button></li>
                            <li><button onClick={this.reduceSpan}><i className="material-icons">chevron_right</i></button></li>
                        </ul>
                    </section>


                    <section className="GameArea">

                        {this.state.drill.lines.map((line, index) => {
                            return (
                                <div className={"Line " + spanClassName} key={index}>
                                    {line.texts.map((col, index) => {
                                        return <span key={index} className={"Cell " (col.valid === true ? 'valid' : '')}>{col.text}</span>
                                    })}
                                </div>
                            )
                        })}

                        {this.state.selection.length > 0 && <div className="input-center"> {this.state.selection}</div>}

                    </section>
                </div>}
            </div>
        );
    }

    componentDidMount() {
        this.textInput.current.focus();
    }

    componentDidUpdate() {
        if (this.state.selection !== '') {
            setTimeout(() => this.setState(state => ({
                ...state,
                selection: '',
            })), 200);
        }
    }

}

VisionSpanDrill.defaultProps = {
    type: 'letter',
    span: 'Span2',

};

export default VisionSpanDrill;

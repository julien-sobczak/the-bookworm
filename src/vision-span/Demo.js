import React from 'react';

import Button from "@material/react-button";
import PropTypes from 'prop-types';

class Demo extends React.Component {

    STEPS = [
        {
            "name": "Fix the center",
            "duration": 4000,
        },
        {
            "name": "Detect the left letter",
            "duration": 4000,
        },
        {
            "name": "Detect the right letter",
            "duration": 4000,
        },
        {
            "name": "Congratulations",
            "duration": 4000,
        },
    ]

    constructor(props) {
        super(props);

        this.state = {
            step: this.props.autoplay ? 0 : -1,
        };

        this.previousStep = this.previousStep.bind(this);
        this.nextStep = this.nextStep.bind(this);
    }

    previousStep() {
        this.stopDemo();
        this.setState(state => ({
            ...state,
            step: state.step - 1,
        }))
    }

    nextStep() {
        this.stopDemo();
        this.setState(state => ({
            ...state,
            step: state.step + 1,
        }))
    }

    render() {
        return (

            <section className="DrillArea Demo">

                <div className="Annotations">
                    {this.props.controls && this.state.step > 0 && <Button className="PreviousStep" icon={<i className="material-icons">chevron_left</i>} onClick={this.previousStep}></Button>}
                    {this.props.controls && this.state.step < this.STEPS.length - 1 && <Button className="NextStep" icon={<i className="material-icons">chevron_right</i>} onClick={this.nextStep}></Button>}
                    {this.state.step === 0 && <div className="EyeMarker"></div>}
                    {this.state.step === 0 && <div className="Instruction" position="center">1. Focus your eyes on the center letter</div>}
                    {this.state.step === 1 && <div className="Instruction" position="left">2. Then, without eye movement, read the left letter</div>}
                    {this.state.step === 2 && <div className="Instruction" position="right">3. Finally, still without eye movement, read the right letter</div>}
                    {/* Caution: AnimatedCircle use the z-index properties. See below. */}
                </div>

                <div className={"Line " + this.props.span}>
                    <span className={"Cell " + (this.state.step >= 2 ? 'valid ' : ' ') + (this.state.step === 1 ? 'highlighted ' : ' ')} style={{"zIndex": 10}}>A</span>
                    <span className="Cell">B</span>
                    <span className={"Cell " + (this.state.step >= 3 ? 'valid ' : ' ') + (this.state.step === 2 ? 'highlighted ' : ' ')} style={{"zIndex": 10}}>C</span>
                </div>

            </section>
        );
    }

    static getDerivedStateFromProps(props, state) {
        if (props.autoplay && state.step === -1) {
            return {
                ...state,
                step: 0,
            };
        }
        return null;
    }

    componentDidUpdate() {
        if (this.state.step < 0) return

        if (this.props.autoplay) {
            // When autoplay is on, we should schedule the next step automatically
            const currentStep = this.state.step
            const isLastStep = currentStep + 1 ===  this.STEPS.length
            const nextStep = isLastStep ? -1 : currentStep + 1
            const duration = this.STEPS[currentStep]["duration"]
            this.intervalID = setTimeout(() => this.setState(state => ({
                step: nextStep,
            })), duration)
        } else {
            // Previous calls to setTimeout should be cancelled when autoplay is switch to off
            this.stopDemo();
        }
    }

    stopDemo() {
        if (this.intervalID) {
            clearInterval(this.intervalID)
        }
    }

    componentWillUnmount() {
        this.stopDemo();
    }

}

Demo.propTypes = {
    type: PropTypes.string,
    span: PropTypes.string,
    autoplay: PropTypes.bool,
    controls: PropTypes.bool,
};

Demo.defaultProps = {
    type: "custom",
    span: "Span2",
    autoplay: false,
    controls: true,
};

export default Demo;

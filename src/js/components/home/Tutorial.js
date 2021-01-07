import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Screen from '../toolbox/Screen';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import SkipIcon from '@material-ui/icons/Done';
import PreviousIcon from '@material-ui/icons/NavigateBefore';
import NextIcon from '@material-ui/icons/NavigateNext';

const TutorialContent = styled.div`
    max-width: 75rem;
    margin: 2rem 0;
`;

const TutorialScreen = ({ step, onClose, children }) => {
    const stepProps = {};
    const labelProps = {};
    return (
        <Screen centered={false} colored={true} color={`var(--home-color-${step + 1})`} scrollable={true} onClose={onClose}>
            <Stepper activeStep={step} alternativeLabel>
                <Step {...stepProps}>
                    <StepLabel {...labelProps}>Welcome</StepLabel>
                </Step>
                <Step {...stepProps}>
                    <StepLabel {...labelProps}>How to use</StepLabel>
                </Step>
                <Step {...stepProps}>
                    <StepLabel {...labelProps}>Configuration</StepLabel>
                </Step>
            </Stepper>
            <TutorialContent>
                {children}
            </TutorialContent>
        </Screen>
    );
};
TutorialScreen.propTypes = {
    step: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
};


const Step0 = ({ onSkip, onNext }) => {
    return (
        <TutorialScreen step={0} onClose={onSkip}>
            Welcome
            <ul>
                <li><Tooltip title="Next page"><Button onClick={onNext}><NextIcon /></Button></Tooltip></li>
                <li><Tooltip title="Skip tutorial"><Button onClick={onSkip}><SkipIcon /></Button></Tooltip></li>
            </ul>
        </TutorialScreen>
    );
};
Step0.propTypes = {
    onSkip: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

const Step1 = ({ onSkip, onPrevious, onNext }) => {
    return (
        <TutorialScreen step={1} onClose={onSkip}>
            The Drills
            <ul>
                <li><Tooltip title="Previous page"><Button onClick={onPrevious}><PreviousIcon /></Button></Tooltip></li>
                <li><Tooltip title="Next page"><Button onClick={onNext}><NextIcon /></Button></Tooltip></li>
                <li><Tooltip title="Skip tutorial"><Button onClick={onSkip}><SkipIcon /></Button></Tooltip></li>
            </ul>
        </TutorialScreen>
    );
};
Step1.propTypes = {
    onSkip: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

const maxStep = 3;

const Tutorial = ({ onDone }) => {

    const [step, setStep] = useState(0);

    const handleDone = () => {
        onDone();
    };

    const handlePrevious = () => {
        if (step === 0) {
            return;
        }
        setStep(step - 1);
    };

    const handleNext = () => {
        if (step === maxStep) {
            handleDone();
        }
        setStep(step + 1);
    };

    return (
        <>
            {step === 0 && <Step0 onSkip={handleDone} onNext={handleNext} />}
            {step === 1 && <Step1 onSkip={handleDone} onPrevious={handlePrevious} onNext={handleNext} />}
        </>
    );
};

Tutorial.propTypes = {
    onDone: PropTypes.func,
};
Tutorial.defaultProps = {
    onDone: () => {},
};

export default Tutorial;

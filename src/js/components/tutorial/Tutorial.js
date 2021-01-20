import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Screen from '../core/Screen';
import LargeButton from '../toolbox/LargeButton';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import Step8 from './Step8';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';

import PreviousIcon from '@material-ui/icons/NavigateBefore';
import NextIcon from '@material-ui/icons/NavigateNext';

/**
 * Link to the previous/next page of the tutorial.
 *
 * @param {Object} props The component properties.
 */
function NavigationLink({ text, position, onClick }) {
    const Link = styled.a`
        display: block;
        border: 1px solid white;
        border-radius: 0.25em;
        padding: 1rem;
        cursor: pointer;
        box-shadow: 0 0 0.25rem rgba(255, 255, 255, 0.7);

        &:hover {
            box-shadow: 0 0 0.75rem rgba(255, 255, 255, 0.4);
            color: white;
        }
    `;
    const PreviousLink = styled(Link)`
        position: fixed;
        bottom: var(--wide-margin);
        left: var(--wide-margin);
        text-align: left;
    `;
    const NextLink = styled(Link)`
        position: fixed;
        bottom: var(--wide-margin);
        right: var(--wide-margin);
        text-align: right;
    `;
    const Position = styled.span`
        align-items: center;
        display: flex;
        font-size: 80%;
        color: white;
    `;
    const Text = styled.span`
        font-size: 1.2rem;
        color: black;
    `;

    const content = <>
        <Position>
            { position === 'previous' && <><PreviousIcon /> Prev</>}
            { position === 'next' && <>Next <NextIcon /></>}
        </Position>
        <Text>{text}</Text>
    </>;

    if (position === 'previous') {
        return <PreviousLink onClick={onClick}>{content}</PreviousLink>;
    } else { // next
        return <NextLink onClick={onClick}>{content}</NextLink>;
    }
}
NavigationLink.propTypes = {
    /**
     * The link text.
     */
    text: PropTypes.string.isRequired,
    /**
     * Link to previous or next page?
     */
    position: PropTypes.oneOf(['previous', 'next']).isRequired,
    /**
     * Called when the user clicks on the link.
     * The callback receives no argument.
     */
    onClick: PropTypes.func.isRequired,
};

/**
 * Screen presenting the application tutorial.
 *
 * @param {Object} props The component properties.
 */
function Tutorial({ onDone }) {

    const [step, setStep] = useState(0);
    const [displayScale, setDisplayScale] = useState(100);

    const handleDone = () => {
        if (window && window.document && displayScale !== 100) {
            document.documentElement.style.setProperty('--scale', displayScale / 100.0);
        }
        onDone();
    };

    const handleStep8Change = (displayScale) => {
        setDisplayScale(displayScale);
    };

    const handlePrevious = () => {
        if (step === 0) {
            return;
        }
        setStep(step - 1);
    };

    const handleNext = () => {
        if (step === 8) {
            handleDone();
        }
        setStep(step + 1);
    };

    const sectionColors = ["var(--home-color-1)", "var(--theme-color-vision-span)", "var(--home-color-8)"];

    const steps = [
        {
            title: "Welcome",
            section: 1,
            component: <Step0 />,
        },
        {
            title: "Why Learn Speed Reading?",
            section: 1,
            component: <Step1 />,
        },
        {
            title: "How to Use?",
            section: 2,
            component: <Step2 />,
        },
        {
            title: "Why The Bookworm is free?",
            section: 2,
            component: <Step3 />,
        },
        {
            title: "The Drills",
            section: 2,
            component: <Step4 />,
        },
        {
            title: "Peripheral Vision?",
            section: 2,
            component: <Step5 />,
        },
        {
            title: "Chunking",
            section: 2,
            component: <Step6 />,
        },
        {
            title: "The Library",
            section: 2,
            component: <Step7 />,
        },
        {
            title: "Configuration",
            section: 3,
            component: <Step8 onChange={handleStep8Change} />,
        },
    ];

    const goToSection = (section) => {
        for (let i = 0; i < steps.length; i++) {
            if (steps[i].section === section) {
                setStep(i);
                return;
            }
        }
    };

    const isStepActive = (section) => {
        return steps[step].section === section;
    };

    const isLastStep = (section) => {
        let lastStep = 0;
        for (let i = 0; i < steps.length; i++) {
            if (steps[i].section === section) {
                lastStep = i;
            }
        }
        return step > lastStep;
    };

    const color = sectionColors[steps[step].section - 1];
    const firstStep = step === 0;
    const lastStep = step === steps.length - 1;

    const Centered = styled.div`
        text-align: center;
    `;

    const TutorialContent = styled.div`
        max-width: 40rem;
        margin: 2rem auto;
        text-align: left;
        font-size: 1.1rem;
        line-height: 1.8rem;
        padding-bottom: 5rem;

        h1, h2 {
            text-align: center;
        }
        h1 { font-size: 2rem; }
        h2 {
            font-size: 1.8rem;
            font-weight: bold;
            font-style: italic;
            letter-spacing: -1px;
        }

        p {
            margin: 2rem 0;
            line-height: 2rem;
        }
        p.alignCenter {
            text-align: center;
        }

        ul {
            list-style-type: disc;
            list-style-position: inside;
            margin-left: 1rem;

            li {
                margin: 0.5rem;
            }
        }

        strong {
            font-weight: bold;
        }
        em {
            background: rgba(0, 0, 0, 0.2);
            padding: 0.3rem;
            border-radius: 5px;
            color: white;
        }
        a {
            position: relative;
            color: white !important;
            padding: 0.25rem;
            border-radius: 2px;
            text-decoration: none;
        }

        /* Based on https://codepen.io/johnfinkdesign/pen/gRvEGq */
        blockquote {
            border-left: 3px solid white;
            color: #1a1a1a;
            font-style: italic;
            line-height: 1.8em;
            margin: 1em 0;
            padding: 1em 2em;
            position: relative;
            z-index: 0;
        }
        blockquote:before {
            content: "";
            position: absolute;
            top: 50%;
            left: -4px;
            height: 2em;
            background-color: ${color};
            width: 5px;
            margin-top: -1em;
        }
        blockquote:after {
            content: '"';
            position: absolute;
            top: 50%;
            left: -0.5em;
            color: white;
            font-family: 'Fredoka One',serif;
            font-size: 3rem;
            line-height: 3rem;
            text-align: center;
            text-indent: -1rem;
            width: 1em;
            margin-top: -0.3em;
        }
    `;

    const Actions = styled.div`
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        backdrop-filter: blur(4px);
        background: ${color};
    `;

    return (
        <Screen
            centered={false}
            colored
            color={color}
            scrollable
            onClose={handleDone}
            style={{ textAlign: "center" }}>
            <Centered>
                <Stepper activeStep={step} alternativeLabel>
                    <Step active={isStepActive(1)} completed={isLastStep(1)}>
                        <StepButton disabled={false} onClick={() => goToSection(1)}>Welcome</StepButton>
                    </Step>
                    <Step active={isStepActive(2)} completed={isLastStep(2)}>
                        <StepButton disabled={false} onClick={() => goToSection(2)}>How to use</StepButton>
                    </Step>
                    <Step active={isStepActive(3)} completed={isLastStep(3)}>
                        <StepButton disabled={false} onClick={() => goToSection(3)}>Configure</StepButton>
                    </Step>
                </Stepper>
                <TutorialContent>
                    {steps[step].component}
                </TutorialContent>
                <Actions>
                    {!lastStep && <LargeButton text="Skip Tutorial" colorText="white" colorBackground="#111" onClick={handleDone} />}
                    {lastStep  && <LargeButton text="Let's Go"      colorText="white" colorBackground="#111" onClick={handleDone} />}
                </Actions>
                {!firstStep && <NavigationLink position="previous" onClick={handlePrevious} text={steps[step-1].title} />}
                {!lastStep  && <NavigationLink position="next"     onClick={handleNext}     text={steps[step+1].title} />}
            </Centered>
        </Screen>
    );
}
Tutorial.propTypes = {
    /**
     * Called when the user ends the tutorial by reaching the last page or by skipping it.
     * The callback receives no argument.
     */
    onDone: PropTypes.func,
};
Tutorial.defaultProps = {
    onDone: () => {},
};

export default Tutorial;

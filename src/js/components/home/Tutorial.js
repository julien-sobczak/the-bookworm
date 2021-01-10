import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import Screen from '../toolbox/Screen';
import LargeButton from '../toolbox/LargeButton';
import { Manuscript } from '../toolbox/Text';

import { ReactComponent as Logo } from '../../../images/logo-outlined.svg';

import Tooltip from '@material-ui/core/Tooltip';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import InfoIcon from '@material-ui/icons/Info';
import PreviousIcon from '@material-ui/icons/NavigateBefore';
import NextIcon from '@material-ui/icons/NavigateNext';
import ExternalLinkIcon from '@material-ui/icons/ExitToAppOutlined';

import DesktopIcon from '@material-ui/icons/DesktopMac';
import TabletIcon from '@material-ui/icons/TabletMac';
import PhoneIcon from '@material-ui/icons/Smartphone';
import CompatibleIcon from '@material-ui/icons/CheckCircle';
import IncompatibleIcon from '@material-ui/icons/Cancel';

import CircleEngine from '../vision-span/circle/Engine';
import CircleViewer from '../vision-span/circle/Viewer';
import ChunkViewer from '../chunking/chunk/Viewer';
import FormCalibration from '../settings/FormCalibration';

const colorStep0 = "var(--home-color-1)";
const colorStep1 = "var(--theme-color-vision-span)";
const colorStep2 = "var(--home-color-8)";

const Step0 = ({ onDone, onNext }) => {
    return (
        <TutorialScreen
            color={colorStep0}
            step={0}
            lastStep={false}
            nextText="Why learn speed reading?"
            onNext={onNext}
            onClose={onDone}>
            <h1><Manuscript>Welcome to</Manuscript></h1>
            <p className="alignCenter"><Logo style={{ width: "30rem", margin: "-1rem auto 1rem" }} /></p>

            <p><em>The Bookworm</em> will help you become a <a href="https://en.wikipedia.org/wiki/Speed_reading" target="_blank" rel="noreferrer">speed reader <ExternalLinkIcon size="small" /></a>.</p>

            <p>Speed reading encompasses <a href="https://www.wikihow.com/Learn-Speed-Reading" target="_blank" rel="noreferrer">several techniques <ExternalLinkIcon size="small" /></a>, not all require an application to practice them:&nbsp;
                <strong>minimize subvocalization<Tooltip title="Suppress the inner speech that often occurs when you read silently."><InfoIcon size="small" /></Tooltip></strong>,&nbsp;
                <strong>minimize eye movements<Tooltip title="Read more words in a single eye fixation."><InfoIcon size="small" /></Tooltip></strong>,&nbsp;
                <strong>read with a pacer<Tooltip title="Follow a pointer (like a finger, a pen) moving over the page at a constant speed."><InfoIcon size="small" /></Tooltip></strong>,&nbsp;
                <strong>preview content<Tooltip title="Read titles, section headings, or the first and last sentences of each paragraph."><InfoIcon size="small" /></Tooltip></strong>,&nbsp;
                <strong>skimming<Tooltip title="Search for clues to the main ideas."><InfoIcon size="small" /></Tooltip></strong>,&nbsp;
                <strong>avoid distractions<Tooltip title="Create a quiet environment to read."><InfoIcon size="small" /></Tooltip></strong>,&nbsp;
                <strong>read purposely<Tooltip title="Determine first why you are reading and what you want to learn."><InfoIcon size="small" /></Tooltip></strong>,&nbsp;
                <strong>reduce regressions<Tooltip title="Break the habit of skipping back to a sentence that you just read to make sure you understood the meaning."><InfoIcon size="small" /></Tooltip></strong>,&nbsp;
                <strong>increase vocabulary<Tooltip title="Become more familiar with the subject your read."><InfoIcon size="small" /></Tooltip></strong>,&nbsp;
                ...
            </p>

            <p className="alignCenter">
                <Manuscript arrow={true} arrowDirection="top" arrowPosition="right">This application focuses on a few of these techniques.</Manuscript>
            </p>

            <p><em>The Bookworm</em> will let you perfect your <strong>peripheral vision</strong> and practice <strong>chunk reading</strong> to minimize eye movements and thus read faster. It does not mean other techniques are less important. It&apos;s simply that you can practice them freely every time you read.</p>

        </TutorialScreen>
    );
};
Step0.propTypes = {
    onDone: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

const Step1 = ({ onDone, onPrevious, onNext }) => {
    const FootnoteDivider = styled.div`
        border-top-style: solid;
        border-top-width: 1px;
        border-color: white;
        width: 4rem;
        margin-top: 3rem;
        margin-bottom: -1rem;
    `;
    const Footnote = styled.p`
        font-size: 75%;
        line-height: 1.5em;
    `;

    const Example = ({ text, wpm }) => {
        const width = "31rem";
        const charactersPerSecond = wpm * 5 / 60.0; // Ex: WPM = 250 => 1250 characters per minute = 20.83 characters per second.
        const durationInMs = parseInt(text.length / charactersPerSecond * 1000);

        useEffect(() => {
            setWpm(wpm);
        }, [wpm]);

        const cursorAnimation = keyframes`
            0% {
                left: 0rem;
            }
            100% {
                left: ${width};
            }
        `;

        const Text = styled.div`
            font-family: 'Source Code Pro', monospace;
            width: ${width};
            min-width: ${width};
            max-width: ${width};
            margin: 1rem auto 2rem;
            background: black;
            padding: 0.5rem;
            font-size: 0.9;
            color: white;
            position: relative;
        `;

        const Cursor = styled.div`
            position: absolute;
            left: 0rem;
            width: 2px;
            background: red;
            top: 0;
            bottom: 0;
            animation-name: ${cursorAnimation};
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            animation-duration: ${durationInMs}ms;
        `;

        return (
            <Text>
                <Cursor />
                {text}
            </Text>
        );
    };
    Example.propTypes = {
        text: PropTypes.string.isRequired,
        wpm: PropTypes.oneOf([150, 250, 500, 1000]),
    };

    const WpmForm = ({ value, onChange }) => {

        // A wrapper around ToggleButtonGroup to select a target WPM
        const WpmSelect = ({ value, onChange }) => {
            return (
                <ToggleButtonGroup value={value} exclusive onChange={onChange}>
                    <ToggleButton value={150}>150</ToggleButton>
                    <ToggleButton value={250}>250</ToggleButton>
                    <ToggleButton value={500}>500</ToggleButton>
                    <ToggleButton value={1000}>1000</ToggleButton>
                </ToggleButtonGroup>
            );
        };
        WpmSelect.propTypes = {
            value: PropTypes.number.isRequired,
            onChange: PropTypes.func.isRequired,
        };

        const Container = styled.div`
            text-align: center;

            label {
                display: inline-block;
                font-size: 0.7rem;
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 50vh;
                padding: 0.25rem 0.5rem;
                color: white;
                font-weight: bold;
                margin-right: 0.7rem;
            }
        `;

        return (
            <Container>
                <label htmlFor="wpm">WPM</label>
                <WpmSelect name="wpm" value={value} onChange={(event, newValue) => onChange(newValue) } />
            </Container>
        );
    };
    WpmForm.propTypes = {
        value: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    const [wpm, setWpm] = useState(250);

    return (
        <TutorialScreen
            color={colorStep0}
            step={0}
            lastStep={false}
            previousText="Welcome"
            onPrevious={onPrevious}
            nextText="How to use?"
            onNext={onNext}
            onClose={onDone}>

            <h2>Why Learn Speed Reading?</h2>

            <p>There has always been controversies about speed reading<sup><small>1</small></sup>, in particular, how speed affects your comprehension. The truth is you may read slowly and not understand better. <strong>Learning speed reading is learning to adapt your reading speed based on the content.</strong> You will not read Shakespeare like you read your emails.</p>

            <WpmForm value={wpm} onChange={setWpm} />
            <Example text={"This text illustrates various reading speeds."} wpm={wpm} />

            <p>Yet, most readers read at 250 words per minute (wpm). This is very close to our ability to speak at 150 words per minute. This is not surprising if we consider we learned to read by reading aloud first and thus never really learn silent reading. <em>The Bookworm</em> will help you remediate.</p>

            <blockquote>The superpower of speed reading is not to read fast, but to be able to read fast when you need it, and to read slow when you have to. It&apos;s finding the right balance between speed and comprehension.<cite>— Julien Sobczak, creator of <em>The Bookworm</em></cite></blockquote>

            <FootnoteDivider />
            <Footnote><sup>[1]</sup> I recommend a comprehensive and recent study of the subject, titled <a href="https://journals.sagepub.com/doi/pdf/10.1177/1529100615623267" target="_blank" rel="noreferrer"><i>&quot;So Much to Read, So Little Time: How Do We Read, and Can Speed Reading Help?&quot;</i></a>. The study does not conclude necessary in favor of speed reading applications but it is important to make your own opinion.</Footnote>

        </TutorialScreen>
    );
};
Step1.propTypes = {
    onDone: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

const Step2 = ({ onDone, onPrevious, onNext }) => {

    const Device = ({ title, icon, compatible }) => {
        const Container = styled.div`
            position: relative;
            margin: 2rem;

            .compatibility {
                position: absolute;
                bottom: -1rem;
                left: 75%;

                svg > path {
                    stroke: white;
                    stroke-width: 3px;
                    stroke-linejoin: round;
                }
            }
        `;
        return (
            <Container>
                <Tooltip title={title}>{icon}</Tooltip>
                {compatible && <CompatibleIcon fontSize="large" className="compatibility" style={{ color: "green" }} />}
                {!compatible && <IncompatibleIcon fontSize="large" className="compatibility" style={{ color: "black" }} />}
            </Container>
        );
    };
    Device.propTypes = {
        title: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired,
        compatible: PropTypes.bool.isRequired,
    };

    const DeviceList = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: center;
    `;

    return (
        <TutorialScreen
            color={colorStep0}
            step={0}
            lastStep={false}
            previousText="Why learning speed reading?"
            onPrevious={onPrevious}
            nextText="Why The Bookworm is free?"
            onNext={onNext}
            onClose={onDone}>

            <h2>How to Use The Bookworm?</h2>

            <p><em>The Bookworm</em> is a web application meaning <strong>you only need a web browser to use it</strong>. The application has been tested on Google Chrome running on Android, MacOs, and Windows but web standards make it likely that the application will work great on other modern browsers.</p>

            <DeviceList>
                <Device title="Desktop" icon={<DesktopIcon fontSize="large" />} compatible={true} />
                <Device title="Tablet"  icon={<TabletIcon fontSize="large" />} compatible={true} />
                <Device title="Phone"   icon={<PhoneIcon fontSize="large" />} compatible={false} />
            </DeviceList>

            <p className="alignCenter">
                <Manuscript arrow={true} arrowDirection="top" arrowPosition="right"><InfoIcon/> The application can be installed on your home screen<br/>to practice in a more focused way!</Manuscript>
            </p>

        </TutorialScreen>
    );
};
Step2.propTypes = {
    onDone: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

const Step3 = ({ onDone, onPrevious, onNext }) => {
    return (
        <TutorialScreen
            color={colorStep0}
            step={0}
            lastStep={false}
            previousText="How to use?"
            onPrevious={onPrevious}
            nextText="The drills"
            onNext={onNext}
            onClose={onDone}>

            <h2>Why The Bookworm is free?</h2>

            <p><strong>Because it costs me nothing</strong> (except a lot of free time to develop it).</p>

            <p><em>The Bookworm</em> is a static web application, which means it does not interact with a database to collect your data. There are many popular services to host such applications freely. I use <a href="https://firebase.google.com/"target="_blank" rel="noreferrer">Firebase <ExternalLinkIcon size="small" /></a>, a service offered by Google. This also has the advantage that your data is yours. <em>The Bookworm</em> runs locally on your device.</p>

        </TutorialScreen>
    );
};
Step3.propTypes = {
    onDone: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

const Step4 = ({ onDone, onPrevious, onNext }) => {
    return (
        <TutorialScreen
            color={colorStep1}
            step={1}
            lastStep={false}
            previousText="Why The Bookworm is free?"
            onPrevious={onPrevious}
            nextText="Peripheral vision"
            onNext={onNext}
            onClose={onDone}>

            <h2>The Drills</h2>

            <p><em>The Bookworm</em> integrates <strong>10 drills</strong>. These drills are divided into <strong>3 categories</strong>:</p>

            <ul>
                <li><strong>Peripheral vision</strong>: Expand your vision by trying to read letters on screen, arranged in multiple shapes: line, circle, pyramid or the famous Schulte table.</li>
                <li><strong>Chunking</strong>: Read books or custom texts, chunk by chunk, trying to catch up with the pacer. Content can be presented in pages, as chunks, and spreaded in several columns.</li>
                <li><strong>Practice</strong>: Same as chunking but reading speed is not controller by the pacer. A great way to test your progression.</li>
            </ul>

            <p className="alignCenter">
                <Manuscript arrow={true} arrowDirection="top" arrowPosition="left">All drills are entirely configurable.</Manuscript>
            </p>

            <p>All drills come with ready-to-use presets to help you get started, but expose all settings so that <strong>you can create your own drills</strong>.</p>

        </TutorialScreen>
    );
};
Step4.propTypes = {
    onDone: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

const Step5 = ({ onDone, onPrevious, onNext }) => {

    // List of spans that fit in a tutorial screen
    const spans = ["0.5in", "0.75in", "1in"];

    const [span, setSpan] = useState("0.5in");

    useEffect(() => {
        const interval = setInterval(() => {
            const index = spans.indexOf(span);
            let newSpan = undefined;
            if (index === spans.length - 1) { // cycle over spans
                newSpan = spans[0];
            } else {
                newSpan = spans[index+1];
            }
            setSpan(newSpan);
        }, 1000);
        return () => clearInterval(interval);
    });

    const drill = new CircleEngine().getDrill();
    const viewer = <CircleViewer span={span} drill={drill} />;

    const DrillViewport = styled.div`
        position: relative;
        height: 15rem;
    `;

    return (
        <TutorialScreen
            color={colorStep1}
            step={1}
            lastStep={false}
            previousText="The drills"
            onPrevious={onPrevious}
            nextText="Chunking"
            onNext={onNext}
            onClose={onDone}>

            <h2>Peripheral Vision?</h2>

            <p><strong>Peripheral vision, or indirect vision, occurs outside the point of fixation</strong>, i.e. away from the center of gaze. The objective of the drills is to train your eyes to grasp more text and thus diminish the number of required fixations.</p>

            <DrillViewport>
                {viewer}
            </DrillViewport>

            <p className="alignCenter">
                <Manuscript arrow={true} arrowDirection="top" arrowPosition="left">Peripheral vision is essential to the next technique: chunking.</Manuscript>
            </p>

        </TutorialScreen>
    );
};
Step5.propTypes = {
    onDone: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

const Step6 = ({ onDone, onPrevious, onNext }) => {

    const makeChunk = (text) => {
        return {
            text: text,
            startingChunk: false,
            endingChunk: false,
        };
    };

    const example = ["to be", "or not", "to be"];
    let [previousChunk, setPreviousChunk] = useState(makeChunk(example[0]));
    let [currentChunk, setCurrentChunk] = useState(makeChunk(example[1]));
    let [nextChunk, setNextChunk] = useState(makeChunk(example[2]));

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentChunk.text === "or not") {
                setPreviousChunk(makeChunk("or not"));
                setCurrentChunk(makeChunk("to be"));
                setNextChunk(makeChunk("or not"));
            } else {
                setPreviousChunk(makeChunk("to be"));
                setCurrentChunk(makeChunk("or not"));
                setNextChunk(makeChunk("to be"));
            }
        }, 500);
        return () => clearInterval(interval);
    });

    const DrillViewport = styled.div`
        position: relative;
        height: 11rem;

        --chunk-color: black;
    `;

    return (
        <TutorialScreen
            color={colorStep1}
            step={1}
            lastStep={false}
            previousText="Peripheral vision"
            onPrevious={onPrevious}
            nextText="The Library"
            onNext={onNext}
            onClose={onDone}>

            <h2>Chunking</h2>

            <p><strong>Chunking involves reading a group of words to limit the number of eye fixations</strong>. The objective of the drills is to train your eyes to read larger chunks, faster.</p>

            <DrillViewport>
                <ChunkViewer neighborChunksPosition={'vertical'}
                    showPreviousChunk={true}
                    showNextChunk={true}
                    fontStyle={"bold"}
                    previousChunk={previousChunk}
                    currentChunk={currentChunk}
                    nextChunk={nextChunk} />
            </DrillViewport>

        </TutorialScreen>
    );
};
Step6.propTypes = {
    onDone: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

const Step7 = ({ onDone, onPrevious, onNext }) => {
    return (
        <TutorialScreen
            color={colorStep1}
            step={1}
            lastStep={false}
            previousText="Chunking"
            onPrevious={onPrevious}
            nextText="Configure"
            onNext={onNext}
            onClose={onDone}>

            <h2>The Library</h2>

            <p><em>The Bookworm</em> integrates a small library of books based on the <a href="https://www.gutenberg.org/" target="_blank" rel="noreferrer">Project Gutenberg</a> initiative. <strong>Epub books can be uploaded</strong> to the application and custom texts can also be copied-pasted. You are free to practice on the books that interest you.</p>

        </TutorialScreen>
    );
};
Step7.propTypes = {
    onDone: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

const Step8 = ({ onDone, onPrevious }) => {

    let [displayScale, setDisplayScale] = useState(1);

    const onChange = (settings) => {
        setDisplayScale(settings.displayScale);
    };

    const onClose = () => {
        onDone({
            displayScale: displayScale,
        });
    };

    return (
        <TutorialScreen
            color={colorStep2}
            step={2}
            lastStep={true}
            previousText="The Library"
            onPrevious={onPrevious}
            onClose={onClose}>

            <p><em>The Bookworm</em> needs to know the real size of your screen. Indeed, web applications don&apos;t know how to display a text that measures exactly 1inch or 1cm on your screen. Web applications use pixels and there are huge variations between devices about the effective size of a pixel on screen. Therefore, grab a ruler, and scale the following table so that every cell is perfectly measuring 1 inch (= 2.54 cm).</p>

            <FormCalibration displayScale={displayScale} onChange={onChange} />

            <p><Manuscript>Congratulations!</Manuscript> You have finished the tutorial. <strong>Ready to start?</strong></p>

        </TutorialScreen>
    );
};
Step8.propTypes = {
    onDone: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
};

////////////////////////////////////

function PreviewScreen({ text, position, onClick }) {
    const Link = styled.a`
        display: block;
        border: 1px solid white;
        border-radius: 0.25em;
        padding: 1rem;
        cursor: pointer;
        backdrop-filter: blur(4px);
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
PreviewScreen.propTypes = {
    text: PropTypes.string.isRequired,
    position: PropTypes.oneOf(['previous', 'next']).isRequired,
    onClick: PropTypes.func.isRequired,
};

function TutorialScreen({ step, lastStep, color, onClose, previousText, nextText, onPrevious, onNext, children }) {
    const stepProps = {};
    const labelProps = {};

    const Centered = styled.div`
        text-align: center;
    `;

    const TutorialContent = styled.div`
        max-width: 40rem;
        margin: 2rem auto;
        text-align: left;
        font-size: 1.1rem;
        line-height: 1.8rem;

        h1, h2 {
            text-align: center;
        }
        h1 { font-size: 2rem; }
        h2 { font-size: 1.8rem; }

        p {
            margin: 2rem 0;
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

    return (
        <Screen centered={false} colored={true} color={color} scrollable={true} onClose={onClose} style={{ textAlign: "center" }}>
            <Centered>
                <Stepper activeStep={step} alternativeLabel>
                    <Step {...stepProps}>
                        <StepButton {...labelProps}>Welcome</StepButton>
                    </Step>
                    <Step {...stepProps}>
                        <StepButton {...labelProps}>How to use</StepButton>
                    </Step>
                    <Step {...stepProps}>
                        <StepButton {...labelProps}>Configure</StepButton>
                    </Step>
                </Stepper>
                <TutorialContent>
                    {children}
                </TutorialContent>
                {previousText && <PreviewScreen position="previous" onClick={onPrevious} text={previousText} />}
                {nextText     && <PreviewScreen position="next"     onClick={onNext}     text={nextText}     />}
                <div className="Actions">
                    {!lastStep && <LargeButton text="Skip Tutorial" colorText="white" colorBackground="#111" onClick={onClose} />}
                    {lastStep  && <LargeButton text="Let's Go" colorText="white" colorBackground="#111" onClick={onClose} />}
                </div>
            </Centered>
        </Screen>
    );
}
TutorialScreen.propTypes = {
    step: PropTypes.number.isRequired,
    lastStep: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    previousText: PropTypes.string,
    nextText: PropTypes.string,
    onPrevious: PropTypes.func,
    onNext: PropTypes.func,
    children: PropTypes.node,
};

function Tutorial({ onDone }) {

    const [step, setStep] = useState(0);

    const handleDone = (settings) => {
        if (window && window.document && settings.displayScale) {
            document.documentElement.style.setProperty('--scale', settings.displayScale);
        }
        onDone();
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

    return (
        <>
            {step === 0 && <Step0 onDone={handleDone} onNext={handleNext} />}
            {step === 1 && <Step1 onDone={handleDone} onPrevious={handlePrevious} onNext={handleNext} />}
            {step === 2 && <Step2 onDone={handleDone} onPrevious={handlePrevious} onNext={handleNext} />}
            {step === 3 && <Step3 onDone={handleDone} onPrevious={handlePrevious} onNext={handleNext} />}
            {step === 4 && <Step4 onDone={handleDone} onPrevious={handlePrevious} onNext={handleNext} />}
            {step === 5 && <Step5 onDone={handleDone} onPrevious={handlePrevious} onNext={handleNext} />}
            {step === 6 && <Step6 onDone={handleDone} onPrevious={handlePrevious} onNext={handleNext} />}
            {step === 7 && <Step7 onDone={handleDone} onPrevious={handlePrevious} onNext={handleNext} />}
            {step === 8 && <Step8 onDone={handleDone} onPrevious={handlePrevious} />}
        </>
    );
}

Tutorial.propTypes = {
    onDone: PropTypes.func,
};
Tutorial.defaultProps = {
    onDone: () => {},
};

export default Tutorial;

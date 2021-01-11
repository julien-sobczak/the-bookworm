import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

function Step1() {

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
            width: 4px;
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
        <>
            <h2>Why Learn Speed Reading?</h2>

            <p>There has always been controversies about speed reading<sup><small>1</small></sup>, in particular, how speed affects your comprehension. The truth is you may read slowly and not understand better. <strong>Learning speed reading is learning to adapt your reading speed based on the content.</strong> You will not read Shakespeare like you read your emails.</p>

            <WpmForm value={wpm} onChange={setWpm} />
            <Example text={"This text illustrates various reading speeds."} wpm={wpm} />

            <p>Most readers read at 250 words per minute (wpm). This is very close to our ability to speak at 150 words per minute. This is not surprising if we consider we learned to read by reading aloud first and thus never really learn silent reading. <em>The Bookworm</em> will help you remediate it.</p>

            <blockquote>The superpower of speed reading is not to read fast, but to be able to read fast when you need it, and to read slow when you have to. It&apos;s finding the right balance between speed and comprehension.<cite>— Julien Sobczak, creator of <em>The Bookworm</em></cite></blockquote>

            <FootnoteDivider />
            <Footnote><sup>[1]</sup> I recommend a comprehensive and recent study of the subject, titled <a href="https://journals.sagepub.com/doi/pdf/10.1177/1529100615623267" target="_blank" rel="noreferrer"><i>&quot;So Much to Read, So Little Time: How Do We Read, and Can Speed Reading Help?&quot;</i></a>. The study does not conclude necessary in favor of speed reading applications but it is important to make your own opinion.</Footnote>
        </>
    );
}

export default Step1;

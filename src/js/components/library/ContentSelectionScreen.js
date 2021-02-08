import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as library from '../../functions/library';

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import Text from '../toolbox/Text';
import Screen from '../core/Screen';
import LargeButton from "../toolbox/LargeButton.js";
import LargeButtonGroup from '../toolbox/LargeButtonGroup';

const ColoredLinearProgress = withStyles({
    root: {
        height: 10,
        margin: "1rem",
    },
    colorPrimary: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    barColorPrimary: {
        backgroundColor: 'black',
    }
})(props => <LinearProgress {...props} />);


const ColoredRadio = withStyles({
    root: {
        color: 'var(--theme-color)',
        '&$checked': {
            color: 'var(--theme-color)',
        },
    },
    checked: {},
})((props) => <Radio color="default" {...props} />);

const ColoredSelect = withStyles({
    root: {
        color: 'var(--theme-color)',
        fontWeight: 'bold',
    },
    icon: {
        color: 'white',
    },
})((props) => <Select {...props} />);

/**
 * Component to select the next content to read.
 */
function ContentSelectionScreen({ reading, content, onStart }) {

    const [mode, setMode] = useState('nextChapter');
    const [duration, setDuration] = useState(5);

    const text = new library.Text(content);
    text.seekPosition(reading.position);

    const handleJump = () => {

    };

    const handleModeChange = (event) => {
        setMode(event.target.value);
    };

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    };

    const handleClick = () => {
        const extract = text.nextContent();
        onStart(extract);
    };

    const Status = styled.div`
        margin: 3rem 0;
        width: 80%;
        text-align: center;
    `;
    const SectionTitle = styled.span`
        display: inline-block;
        margin-bottom: 0.5em;
    `;
    const Form = styled.div`
        margin: 3rem 0;
        display: inline-block;
        color: white;
        background: black;
        padding: 1rem;
    `;

    return (
        <Screen colored>

            <Status>
                <SectionTitle>Chapter 1</SectionTitle>
                <ColoredLinearProgress variant="determinate" value={40} />
                <Button variant="contained" color="primary" onClick={handleJump}>Jump to another section</Button>
            </Status>

            <p><Text manuscript arrow arrowDirection="bottom" arrowPosition="left" arrowVariant="primary">Select what to read</Text></p>

            <Form>
                <div>
                    <ColoredRadio
                        checked={mode === 'nextChapter'}
                        onChange={handleModeChange}
                        value="nextChapter"
                        name="mode"
                        id="mode-nextChapter"
                    /> <label htmlFor="mode-nextChapter">Read the next chapter</label>
                </div>
                <div>
                    <ColoredRadio
                        checked={mode === 'duration'}
                        onChange={handleModeChange}
                        value="duration"
                        name="mode"
                        id="mode-duration"
                    />
                    <label htmlFor="mode-duration">Read for</label>&nbsp;
                    <ColoredSelect
                        value={duration}
                        onChange={handleDurationChange}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                    </ColoredSelect>
                    &nbsp;<label htmlFor="mode-duration">minutes</label>
                </div>
            </Form>

            <LargeButtonGroup>
                <LargeButton text="Let's go" colorText="white" colorBackground="#111" onClick={handleClick} />
            </LargeButtonGroup>
        </Screen>
    );
}

ContentSelectionScreen.propTypes = {
    /**
     * The content to filter in the standard format.
     */
    content: PropTypes.object.isRequired,
    /**
     * The current reading.
     */
    reading: PropTypes.object.isRequired,
    /**
     * Called when the user has finished selecting the content and is ready to start the reading.
     * The callback received the extract to read.
     */
    onStart: PropTypes.func,
};

ContentSelectionScreen.defaultProps = {
    onStart: function() {},
};

export default ContentSelectionScreen;

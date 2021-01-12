import React from 'react';

import Text from '../toolbox/Text';

import { ReactComponent as Logo } from '../../../images/logo-outlined.svg';

import Tooltip from '@material-ui/core/Tooltip';

import InfoIcon from '@material-ui/icons/Info';
import ExternalLinkIcon from '@material-ui/icons/ExitToAppOutlined';

function Step0() {
    return (
        <>
            <h1><Text manuscript>Welcome to</Text></h1>
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
                <Text manuscript arrow arrowDirection="top" arrowPosition="right">This application focuses on a few of these techniques.</Text>
            </p>

            <p><em>The Bookworm</em> will let you perfect your <strong>peripheral vision</strong> and practice <strong>chunk reading</strong> to minimize eye movements and thus read faster. It does not mean other techniques are less important. It&apos;s simply that you can practice them freely every time you read.</p>
        </>
    );
}

export default Step0;

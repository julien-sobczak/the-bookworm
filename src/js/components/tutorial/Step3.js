import React from 'react';

import ExternalLinkIcon from '@material-ui/icons/ExitToAppOutlined';

function Step3() {
    return (
        <>
            <h2>Why The Bookworm is free?</h2>

            <p><strong>Because it costs me nothing</strong> (except a lot of free time to develop it).</p>

            <p><em>The Bookworm</em> is a <strong>static web application</strong>, which means it does not interact with a database to collect your data. There are many popular services to host such applications freely. I use <a href="https://firebase.google.com/" target="_blank" rel="noreferrer">Firebase <ExternalLinkIcon size="small" /></a>, a service offered by Google. This also has the advantage that your data is yours. <em>The Bookworm</em> runs locally on your device.</p>

            <p><em>The Bookworm</em> is an <a href="https://en.wikipedia.org/wiki/Open-source_software" target="_blank" rel="noreferrer">Open Source project <ExternalLinkIcon size="small" /></a>, meaning the code is freely available on <a href="https://github.com/julien-sobczak/the-bookworm" target="_blank" rel="noreferrer">GitHub <ExternalLinkIcon size="small" /></a> and contributions are welcome.</p>
        </>
    );
}

export default Step3;

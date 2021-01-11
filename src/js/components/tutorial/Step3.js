import React from 'react';

import ExternalLinkIcon from '@material-ui/icons/ExitToAppOutlined';

function Step3() {
    return (
        <>
            <h2>Why The Bookworm is free?</h2>

            <p><strong>Because it costs me nothing</strong> (except a lot of free time to develop it).</p>

            <p><em>The Bookworm</em> is a static web application, which means it does not interact with a database to collect your data. There are many popular services to host such applications freely. I use <a href="https://firebase.google.com/"target="_blank" rel="noreferrer">Firebase <ExternalLinkIcon size="small" /></a>, a service offered by Google. This also has the advantage that your data is yours. <em>The Bookworm</em> runs locally on your device.</p>
        </>
    );
}

export default Step3;

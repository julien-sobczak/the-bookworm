import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

// Size of the window
const windowWidth = "30rem";
const windowHeight = "20rem";

/**
 * Static UI component displayed a screen frame.
 *
 * @param {Object} props The component properties.
 */
function Window({ content, showPanes, callouts }) {

    const Centered = css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;

    const Dialog = styled.div`
        background: black;
        width: ${windowWidth};
        height: ${windowHeight};
        border-radius: 0.5rem;
        margin: 1rem auto;
        position: relative;

        /* Simulate Icons in the window bar */
        ::after {
            content: '';
            background: var(--theme-color);
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            position: absolute;
            top: 0.5rem;
            left: 1rem;
            box-shadow: 2rem 0 0  0 var(--theme-color),
                        4rem 0 0  0 var(--theme-color);
        }
    `;

    const Viewport = styled.div`
        background: var(--theme-color);
        border-radius: 0.5rem;
        top: 2rem;
        left: 0.25rem;
        right: 0.25rem;
        bottom: 0.25rem;
        position: absolute;
        padding: 0.5rem;
        ${Centered}
    `;

    const Pane = styled.div`
        background: var(--theme-color);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.2);
    `;
    const LeftPane = styled(Pane)`
        right: 66%;
    `;
    const RightPane = styled(Pane)`
        left: 66%;
    `;

    const Callout = styled.span`
        font-size: 1rem;
        font-weight: bold;
        color: white;
        background: black;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.25rem;
    `;
    const AbsoluteCallout = styled(Callout)`
        position: absolute;
        box-shadow: 0.25rem 0.25rem 0.25rem rgba(0, 0, 0, 0.5);
    `;

    const CalloutTable = styled.table`
        width: ${windowWidth};
        margin: 1rem auto;
    `;

    return (
        <>
            <Dialog>
                <Viewport>
                    {showPanes && <LeftPane/>}
                    {showPanes && <RightPane/>}
                    {content}
                    {callouts.map((c, index) => {
                        const styles = {};
                        if (c.top) styles.top = c.top;
                        if (c.left) styles.left = c.left;
                        if (c.right) styles.right = c.right;
                        if (c.bottom) styles.bottom = c.bottom;
                        return <AbsoluteCallout key={index} style={styles}>{c.text}</AbsoluteCallout>;
                    })}
                </Viewport>
            </Dialog>
            {callouts.length > 0 && <CalloutTable>
                <tbody>
                    {callouts.map((c, index) => {
                        return (
                            <tr key={index}>
                                <td><Callout>{c.text}</Callout></td><td>{c.description}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </CalloutTable>}
        </>
    );
}

Window.propTypes = {
    /**
     * Enable to show panes. Useful when special actions are assigned to screen parts.
     * Ex: When a user click on the left side of the screen.
     */
    showPanes: PropTypes.bool,
    /**
     * A React component to display inside the viewport of the window.
     */
    content: PropTypes.node.isRequired,
    /**
     * An optional list of callouts to provide additional explanations.
     */
    callouts: PropTypes.arrayOf(PropTypes.object),
};

Window.defaultProps = {
    showPanes: false,
    callouts: [],
};

export default Window;

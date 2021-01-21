import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Large button to reserve for the main actions on a given screen.
 *
 * @param {Object} props The component properties.
 */
function LargeButton({ text, className, disabled, colorText, colorBackground, onClick }) {

    // Inspired by https://codepen.io/andreasstorm/pen/oqKbLq

    const Button = styled.button`
        color: ${colorText};
        position: relative;
        margin: 1em auto;
        padding: 19px 22px;
        transition: all .2s ease;

        :before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            border-radius: 28px;
            background: ${colorBackground};
            width: 56px;
            height: 56px;
            transition: all .3s ease;
        }
    `;

    const ActiveButton = styled(Button)`
        :hover:before {
            width: 100%;
            background: ${colorBackground};
        }
        :active {
            transform: scale(.96);
        }
    `;

    const InactiveButton = styled(Button)`
        opacity: 0.5;
        cursor: default !important;
    `;

    const Text = styled.span `
        position: relative;
        font-size: 16px;
        line-height: 18px;
        font-weight: 900;
        letter-spacing: .25em;
        text-transform: uppercase;
        vertical-align: middle;
    `;

    const innerText = <Text>{text}</Text>;

    if (disabled) {
        return (
            <InactiveButton>
                {innerText}
            </InactiveButton>
        );
    }

    return (
        <ActiveButton className={className} onClick={onClick}>
            {innerText}
        </ActiveButton>
    );
}

LargeButton.propTypes = {
    /**
     * Text of the button.
     */
    text: PropTypes.string,
    /**
     * Optional CSS class to add on the button.
     */
    className: PropTypes.string,
    /**
     * Color of the text.
     * Must be A valid CSS color value.
     */
    colorText: PropTypes.string,
    /**
     * Color of the background.
     * Must be A valid CSS color value.
     */
    colorBackground: PropTypes.string,
    /**
     * Disable the button.
     */
    disabled: PropTypes.bool,
    /**
     * Called when the user clicks on the button.
     * The callback receives no argument.
     */
    onClick: PropTypes.func,
};

LargeButton.defaultProps = {
    className: "",
    text: 'Click me',
    disabled: false,
    colorText: '#111',
    colorBackground: 'var(--mdc-theme-background)',
    onClick: function() {},
};

export default LargeButton;

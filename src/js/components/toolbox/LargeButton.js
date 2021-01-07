import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// We use https://www.styled-components.com/docs/basics to scope CSS declarations and animations!
// Inspired by https://codepen.io/andreasstorm/pen/oqKbLq
function LargeButton({ text, className, colorText, colorBackground, onClick }) {

    // font-family: Avenir, sans-serif
    // https://fonts.google.com/?query=Avenir

    const Button = styled.button `
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
        :hover:before {
            width: 100%;
            background: ${colorBackground};
        }
        :active {
            transform: scale(.96);
        }
    `;

    const Text = styled.span `
        position: relative;
        font-size: 16px;
        line-height: 18px;
        font-weight: 900;
        letter-spacing: .25em;
        text-transform: uppercase;
        vertical-align: middle;
    }
    `;

    return (
        <Button className={className} onClick={ () => onClick() }>
            <Text>{text}</Text>
        </Button>
    );
}

LargeButton.propTypes = {
    text: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    colorText: PropTypes.string,
    colorBackground: PropTypes.string,
};

LargeButton.defaultProps = {
    className: "",
    text: 'Click me',
    colorText: '#111',
    colorBackground: 'var(--mdc-theme-background)',
    onClick: function() {},
};

export default LargeButton;

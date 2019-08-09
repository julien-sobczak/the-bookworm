import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// We use https://www.styled-components.com/docs/basics to scope CSS declarations and animations!
// Inspired by https://codepen.io/andreasstorm/pen/oqKbLq
function MainButton({ text, onClick }) {

    const colorText = '#111';
    const colorBackground = 'var(--mdc-theme-background)';

    // font-family: Avenir, sans-serif
    // https://fonts.google.com/?query=Avenir

    const Button = styled.button `
        color: ${colorText};
        color: ;
        position: relative;
        margin: auto;
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
            opacity: 0.5;
            width: 56px;
            height: 56px;
            transition: all .3s ease;
        }
        :hover:before {
            width: 100%;
            background: ${colorBackground};
            opacity: 1;
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
        <Button onClick={ () => onClick() }>
            <Text>{text}</Text>
        </Button>
    );
}

MainButton.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
};

MainButton.defaultProps = {
    text: 'Click me',
    onClick: undefined,
};

export default MainButton;

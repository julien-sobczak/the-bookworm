import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


// Inspired by https://codepen.io/nw/pen/zvQVWM

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: black;
    z-index: 999;
`;

const CountdownElement = styled.div`
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Oswald', sans-serif;
    font-weight: 400;
    font-size: 50vmin;
    border-radius: 0;
    overflow: hidden;
    cursor: pointer;
    transition: width, height, border-radius, font-size;
    transition-duration: 0.2s;
`;

const CountdownFill = styled.div`
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background: var(--mdc-theme-background);
    opacity: 1;
`;

const CountdownDigit = styled.div`
    width: 100%;
    color: var(--mdc-theme-background);
    text-align: center;
    mix-blend-mode: difference;
    pointer-events: none;
    user-select: none;
`;

class Countdown extends React.Component {

    constructor(props) {
        super(props);

        // this.element = React.createRef();
        this.ticker = React.createRef();
        this.seconds = React.createRef();
    }

    render() {
        return (
            <Container>
                <CountdownElement ref={this.element}>
                    <CountdownFill ref={this.ticker}></CountdownFill>
                    <CountdownDigit data-testid="count" ref={this.seconds}>00</CountdownDigit>
                </CountdownElement>
            </Container>
        );
    }

    componentDidMount() {
        let start = null;
        let remainingSeconds = this.props.duration / 1000;
        this.seconds.current.textContent = remainingSeconds;

        const draw = (now) => {
            if (!start) start = now;

            var diff = now - start;
            var newSeconds = Math.ceil((this.props.duration - diff) / 1000);

            if (diff <= this.props.duration) {
                this.ticker.current.style.height = 100 - (diff / this.props.duration * 100) + '%';

                if (newSeconds !== remainingSeconds) {
                    this.seconds.current.textContent = newSeconds;
                    remainingSeconds = newSeconds;
                }

                this.frameReq = window.requestAnimationFrame(draw);
            } else {
                this.props.onTimesUp();
            }
        };
        this.frameReq = window.requestAnimationFrame(draw);
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.frameReq);
    }

}

Countdown.propTypes = {
    duration: PropTypes.number,
    onTimesUp: PropTypes.func,
};

Countdown.defaultProps = {
    duration: 3000,
    onTimesUp: function() {},
};

export default Countdown;

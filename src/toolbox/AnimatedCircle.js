import React from 'react';

import styled, { keyframes } from 'styled-components';

// We use https://www.styled-components.com/docs/basics to scope CSS declarations and animations!
class AnimatedCircle extends React.Component {

    render() {

        const diameterOuter = this.props.diameter
        const thickness = this.props.thickness
        const diameterInner = `calc(${diameterOuter} - ${thickness})`
        const animationDuration = this.props.animationDuration + 'ms';
        const animationDurationHalf = this.props.animationDuration / 2 + 'ms';

        const Wrapper = styled.div`
            width: ${diameterOuter};
            height: ${diameterOuter};
            overflow: hidden;
            position: relative;
            margin-top:  calc(-1 * ${diameterOuter} / 2);
            margin-left: calc(-1 * ${diameterOuter} / 2);
        `

        const rotaRight = keyframes`
            0%   { transform:rotate(-225deg); }
            100% { transform: rotate(-45deg); }
        `
        const Right = styled.div`
            border: ${this.props.color} solid ${thickness};
            height: ${diameterInner};
            width: ${diameterInner};
            border-radius: calc(${diameterInner} + ${thickness});
            border-top-color: transparent;
            border-left-color: transparent;
            position: absolute;
            transform: rotate(-45deg);
            animation: ${rotaRight} ${animationDurationHalf} linear;
        `

        const rotaLeft = keyframes`
            0%   { transform: rotate(-45deg); }
            100% { transform: rotate(315deg); }
        `
        const Left = styled.div`
            border: ${this.props.color} solid ${thickness};
            height: ${diameterInner};
            width: ${diameterInner};
            border-radius: ${diameterInner};
            border-bottom-color: transparent;
            border-right-color: transparent;
            position: absolute;
            transform: rotate(315deg);
            animation: ${rotaLeft} ${animationDuration} linear;
        `

        const Middle = styled.div`
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: ${diameterInner};
            height: ${diameterInner};
            left: 0;
            top: 0;
            border-radius: calc(${diameterOuter} - ${thickness});
            position: relative;
            z-index: 10;
        `

        const popover = keyframes`
            0%   { opacity: 1; }
            99%  { opacity: 1; }
            100% { opacity: 0; }
        `
        const Popover = styled.div`
            background: white;
            width: calc(calc(${diameterOuter}) / 2);
            height: ${diameterOuter};
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            z-index: 2;
            animation: ${popover} ${animationDurationHalf} linear;
        `

        return (
            <div className={this.props.className}>
                <Wrapper>
                    <Right/>
                    <Left/>
                    <Middle>
                        {this.props.children}
                    </Middle>
                    <Popover/>
                </Wrapper>
            </div>
        );
    }

}

Paper.defaultProps = {
    className: '',
    color: 'green',
    diameter: '30px',
    thickness: '3px',
    animationDuration: 1000,
};

export default Paper;

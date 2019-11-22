import React from 'react';
import styled, { keyframes, css } from 'styled-components';

// We use https://www.styled-components.com/docs/basics to scope CSS declarations and animations!
// Inspired by https://codepen.io/Roboe/pen/wymVwO

/*
 * Variables
 */

// Default color
// const colorWhite =  '#e2e8e7';
// const colorYellow = '#f6c574';
// const colorBlue =   '#00aacf';
// const colorGreen =  '#00b3a0';
// const colorRed =    '#fc5652';

// Theme color
const colorWhite =  'var(--theme-color-home)';
const colorYellow = 'var(--theme-color-vision-span)';
const colorBlue =   'var(--theme-color-chunking)';
const colorGreen =  'var(--theme-color-practice)';
const colorRed =    'var(--theme-color-about)';

const fullAnimationDuration = `1s`;

/*
 * Animations
 */

const step1FrontToUp = keyframes`
  0% {
    transform: rotateX(0deg);
  }
  25%, 100% {
    transform: rotateX(90deg);
  }
`;

const step1DownToFront = keyframes`
  0% {
    transform: rotateX(-90deg);
  }
  25%, 100% {
    transform: rotateX(0deg);
  }
`;

const step2FrontToLeft = keyframes`
  25% {
    transform: rotateY(0deg);
  }
  50%, 100% {
    transform: rotateY(-90deg);
  }
`;

const step2RightToFront = keyframes`
  25% {
    transform: rotateY(90deg);
  }
  50%, 100% {
    transform: rotateY(0deg);
  }
`;

const step3FrontToDown = keyframes`
  50% {
    transform: rotateX(0deg);
  }
  75%, 100% {
    transform: rotateX(-90deg);
  }
`;

const step23RightToFrontToDown = keyframes`
  25% {
    transform: rotateY(90deg);
  }
  50% {
    transform: rotateX(0deg);
  }
  75%, 100% {
    transform: rotateX(-90deg);
  }
`;

const step3UpToFront = keyframes`
  50% {
    transform: rotateX(90deg);
  }
  75%, 100% {
    transform: rotateX(0deg);
  }
`;

const step4FrontToRight = keyframes`
  75% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(90deg);
  }
`;

const step14DownToFrontToRight = keyframes`
  0% {
    transform: rotateX(-90deg);
  }
  25% {
    transform: rotateX(0deg);
  }
  75% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(90deg);
  }
`;

const step34UpToFrontToRight = keyframes`
  50% {
    transform: rotateX(90deg);
  }
  75% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(90deg);
  }
`;

const step4LeftToFront = keyframes`
  75% {
    transform: rotateY(-90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
`;


/*
 * CSS mixins
 */

const piece = css`
  display: inline-block;
  width: 30px;
  height: 30px;
  position: absolute;
  backface-visibility: hidden;
  animation-duration: ${fullAnimationDuration};
  animation-iteration-count: infinite;
`;


const yellow = css`
  background-color: ${colorYellow};
`;
const blue = css`
  background-color: ${colorBlue};
`;
const green = css`
  background-color: ${colorGreen};
`;
const white = css`
  background-color: ${colorWhite};
`;
const red = css`
  background-color: ${colorRed};
`;


const faceFront = css`
`;
const faceRight = css`
  transform: rotateY(90deg);
`;
const faceLeft = css`
  transform: rotateY(-90deg);
`;
const faceUp = css`
  transform: rotateX(90deg);
`;
const faceDown = css`
  transform: rotateX(-90deg);
`;


const rowTop = css`
  top: 10px;
`;
const rowCenter = css`
  top: 50px;
`;
const rowBottom = css`
  top: 90px;
`;
const colLeft = css`
  left: 10px;
`;
const colCenter = css`
  left: 50px;
`;
const colRight = css`
  left: 90px;
`;



const rowTopColLeft = css`
  transform-origin: 55px 55px -55px;
`;
const rowTopColCenter = css`
  transform-origin: 15px 55px -55px;
`;
const rowTopColRight = css`
  transform-origin: -25px 55px -55px;
`;
const rowCenterColLeft = css`
  transform-origin: 55px 15px -55px;
`;
const rowCenterColCenter = css`
  transform-origin: 15px 15px -55px;
`;
const rowCenterColRight = css`
  transform-origin: -25px 15px -55px;
`;
const rowBottomColLeft = css`
  transform-origin: 55px -25px -55px;
`;
const rowBottomColCenter = css`
  transform-origin: 15px -25px -55px;
`;
const rowBottomColRight = css`
  transform-origin: -25px -25px -55px;
`;


/*
 * Elements
 */

const Rubiks = styled.div`
  width: 130px;
  height: 130px;
  position: relative;
  perspective: 130px;
`;

const Cube = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  font-size: 0;
  transform-style: preserve-3d;
`;


const PieceFaceFrontRowTopColLeft = styled.div`
  ${piece}
  ${faceFront}
  ${rowTop}
  ${colLeft}
  ${rowTopColLeft}
  ${yellow}
  animation-name: ${step3FrontToDown};
`;
const PieceFaceFrontRowTopColCenter = styled.div`
  ${piece}
  ${faceFront}
  ${rowTop}
  ${colCenter}
  ${rowTopColCenter}
  ${green}
  animation-name: ${step1FrontToUp};
`;
const PieceFaceFrontRowTopColRight = styled.div`
  ${piece}
  ${faceFront}
  ${rowTop}
  ${colRight}
  ${rowTopColRight}
  ${white}
`;
const PieceFaceFrontRowCenterColLeft = styled.div`
  ${piece}
  ${faceFront}
  ${rowCenter}
  ${colLeft}
  ${rowCenterColLeft}
  ${blue}
  animation-name: ${step2FrontToLeft};
`;
const PieceFaceFrontRowCenterColCenter = styled.div`
  ${piece}
  ${faceFront}
  ${rowCenter}
  ${colCenter}
  ${rowCenterColCenter}
  ${green}
  animation-name: ${step1FrontToUp};
`;
const PieceFaceFrontRowCenterColRight = styled.div`
  ${piece}
  ${faceFront}
  ${rowCenter}
  ${colRight}
  ${rowCenterColRight}
  ${blue}
  animation-name: ${step2FrontToLeft};
`;
const PieceFaceFrontRowBottomColLeft = styled.div`
  ${piece}
  ${faceFront}
  ${rowBottom}
  ${colLeft}
  ${rowBottomColLeft}
  ${green}
  animation-name: ${step3FrontToDown};
`;
const PieceFaceFrontRowBottomColCenter = styled.div`
  ${piece}
  ${faceFront}
  ${rowBottom}
  ${colCenter}
  ${rowBottomColCenter}
  ${yellow}
  animation-name: ${step1FrontToUp};
`;
const PieceFaceFrontRowBottomColRight = styled.div`
  ${piece}
  ${faceFront}
  ${rowBottom}
  ${colRight}
  ${rowBottomColRight}
  ${red}
  animation-name: ${step4FrontToRight};
`;
const PieceFaceDownRowTopColCenter = styled.div`
  ${piece}
  ${faceDown}
  ${rowTop}
  ${colCenter}
  ${rowTopColCenter}
  ${green}
  animation-name: ${step1DownToFront};
`;
const PieceFaceDownRowCenterColCenter = styled.div`
  ${piece}
  ${faceDown}
  ${rowCenter}
  ${colCenter}
  ${rowCenterColCenter}
  ${red}
  animation-name: ${step2FrontToLeft};
`;
const PieceFaceDownRowBottomColCenter = styled.div`
  ${piece}
  ${faceDown}
  ${rowBottom}
  ${colCenter}
  ${rowBottomColCenter}
  ${white}
  animation-name: ${step14DownToFrontToRight};
`;
const PieceFaceRightRowCenterColLeft = styled.div`
  ${piece}
  ${faceRight}
  ${rowCenter}
  ${colLeft}
  ${rowCenterColLeft}
  ${yellow}
  animation-name: ${step23RightToFrontToDown};
`;
const PieceFaceRightRowCenterColCenter = styled.div`
  ${piece}
  ${faceRight}
  ${rowCenter}
  ${colCenter}
  ${rowCenterColCenter}
  ${green}
  animation-name: ${step2RightToFront};
`;
const PieceFaceRightRowCenterColRight = styled.div`
  ${piece}
  ${faceRight}
  ${rowCenter}
  ${colRight}
  ${rowCenterColRight}
  ${blue}
  animation-name: ${step2RightToFront};
`;
const PieceFaceUpRowTopColLeft = styled.div`
  ${piece}
  ${faceUp}
  ${rowTop}
  ${colLeft}
  ${rowTopColLeft}
  ${yellow}
  animation-name: ${step3UpToFront};
`;
const PieceFaceUpRowCenterColLeft = styled.div`
  ${piece}
  ${faceUp}
  ${rowCenter}
  ${colLeft}
  ${rowCenterColLeft}
  ${blue}
  animation-name: ${step3UpToFront};
`;
const PieceFaceUpRowBottomColLeft = styled.div`
  ${piece}
  ${faceUp}
  ${rowBottom}
  ${colLeft}
  ${rowBottomColLeft}
  ${green}
  animation-name: ${step34UpToFrontToRight};
`;
const PieceFaceLeftRowBottomColLeft = styled.div`
  ${piece}
  ${faceLeft}
  ${rowBottom}
  ${colLeft}
  ${rowBottomColLeft}
  ${green}
  animation-name: ${step4LeftToFront};
`;
const PieceFaceLeftRowBottomColCenter = styled.div`
  ${piece}
  ${faceLeft}
  ${rowBottom}
  ${colCenter}
  ${rowBottomColCenter}
  ${yellow}
  animation-name: ${step4LeftToFront};
`;
const PieceFaceLeftRowBottomColRight = styled.div`
  ${piece}
  ${faceLeft}
  ${rowBottom}
  ${colRight}
  ${rowBottomColRight}
  ${red}
  animation-name: ${step4LeftToFront};
`;

function Loader() {

    return (
        <div className="FullScreen Centered">
            <Rubiks data-testid="rubik">
                <Cube>
                    <PieceFaceFrontRowTopColLeft />
                    <PieceFaceFrontRowTopColCenter />
                    <PieceFaceFrontRowTopColRight />
                    <PieceFaceFrontRowCenterColLeft />
                    <PieceFaceFrontRowCenterColCenter />
                    <PieceFaceFrontRowCenterColRight />
                    <PieceFaceFrontRowBottomColLeft />
                    <PieceFaceFrontRowBottomColCenter />
                    <PieceFaceFrontRowBottomColRight />
                    <PieceFaceDownRowTopColCenter />
                    <PieceFaceDownRowCenterColCenter />
                    <PieceFaceDownRowBottomColCenter />
                    <PieceFaceRightRowCenterColLeft />
                    <PieceFaceRightRowCenterColCenter />
                    <PieceFaceRightRowCenterColRight />
                    <PieceFaceUpRowTopColLeft />
                    <PieceFaceUpRowCenterColLeft />
                    <PieceFaceUpRowBottomColLeft />
                    <PieceFaceLeftRowBottomColLeft />
                    <PieceFaceLeftRowBottomColCenter />
                    <PieceFaceLeftRowBottomColRight />
                </Cube>
            </Rubiks>
        </div>
    );
}

export default Loader;

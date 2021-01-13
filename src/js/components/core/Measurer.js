import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';

import Styled from './Styled';
import * as engine from '../../functions/engine';

class Measurer extends React.Component {

    removeOld() {
        if (Measurer.element && Measurer.element.parentNode) {
            Measurer.element.parentNode.removeChild(Measurer.element);
        }
    }

    render() {
        this.removeOld();

        // Manage an element outside this component to append text word by word to find chunks.
        // This avoid having this component to re-render continuously.
        const chunkElement = React.createElement(
            Styled,
            {
                id: this.props.elementId,
                fontFamily: this.fontFamily,
                fontSize: this.fontSize,
                fontStyle: this.fontStyle,
            }
        );
        const chunkHTML = ReactDOMServer.renderToStaticMarkup(chunkElement);

        const rootMeasurer = document.createElement("DIV");
        rootMeasurer.innerHTML = chunkHTML;
        document.body.appendChild(rootMeasurer);
        //document.getElementById('root-chunker').innerHTML = chunkHTML;

        Measurer.element = document.getElementById(this.props.elementId);
        Measurer.element.style.display = "inline-block"; // We want to measure the width (display: block by default)

        // Nothing to render by React
        return null;
    }

    componentDidMount() {
        const measurements = {};

        engine.SPANS.forEach(s => {
            Measurer.element.style.width = s;
            let [width, height] = Measurer._measure();
            measurements[s] = {
                width: width,
                height: height,
            };
        });
        Measurer.element.style.width = "";

        if (this.props.onChange) {
            this.props.onChange(measurements);
        }
    }

    /**
    * Measure the effective width and height of a given text.
    * @param {string} text The text to measure
    * @returns {number[]} The effective width in pixels
    */
    static measure(text) {
        if (!Measurer.element) return undefined;

        Measurer.element.innerHTML = text;

        const dimensions = Measurer._measure();
        return dimensions;
    }

    /**
    * Measures the effective width and height of the current inner element.
    * @returns {number[]} The effective width in pixels
    */
    static _measure() {
        if (!Measurer.element.offsetWidth) return Measurer._measureTestMode();
        const computedStyle = getComputedStyle(Measurer.element);
        let width = Measurer.element.offsetWidth;   // width with padding
        let height = Math.ceil(parseFloat(computedStyle.lineHeight));
        width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);  // width without padding
        height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom); // height without padding

        return [width, height];
    }

    /**
     * Same as _measure but called when testing in Node environment (Jest) where real dimentions cannot be determined.
     * This method uses a fixed-character formula to determine the value.
     */
    static _measureTestMode() {
        const pixelsPerCharacter = 10;
        const pixelsPerEm = 16;
        const charactersPerInch = 10; // Based on 12pt Courier font

        if (Measurer.element.style.width !== "") {
            // We measure the element width
            const elementWidthPixels = Math.round(parseFloat(Measurer.element.style.width) * charactersPerInch * pixelsPerCharacter);
            return [elementWidthPixels, pixelsPerEm];
        } else {
            // We measure the text width
            const textWidthPixels = Measurer.element.innerHTML.length * pixelsPerCharacter;
            return [textWidthPixels, pixelsPerEm];
        }
    }

}

Measurer.propTypes = {
    elementId: PropTypes.string,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.string,
    fontStyle: PropTypes.string,
    onChange: PropTypes.func,
};

Measurer.defaultProps = {
    elementId: 'chunker',
    fontFamily: 'Roboto',
    fontSize: '14pt',
    fontStyle: 'normal',
};

export default Measurer;

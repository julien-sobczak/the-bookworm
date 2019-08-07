import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import Styled from '../toolbox/Styled';

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
                id: this.props.id,
                fontFamily: this.fontFamily,
                fontSize: this.fontSize,
                fontStyle: this.fontStyle,
            }
        );
        const chunkHTML = ReactDOMServer.renderToStaticMarkup(chunkElement);
        document.getElementById('root-chunker').innerHTML = chunkHTML;
        Measurer.element = document.getElementById(this.props.id);
        Measurer.element.style.display = "inline-block"; // We want to measure the width (display: block by default)

        // Nothing to render by React
        return null;
    }

    componentDidMount() {
        const measurements = {};

        Measurer.SPANS.forEach(s => {
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

        return Measurer._measure();
    }

   /**
    * Measure the effective width and height of the current inner element.
    * @returns {number[]} The effective width in pixels
    */
    static _measure() {
        const computedStyle = getComputedStyle(Measurer.element);
        let width = Measurer.element.offsetWidth;   // width with padding
        let height = Math.ceil(parseFloat(computedStyle.lineHeight));
        width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);  // width without padding
        height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom); // height without padding

        return [width, height];
    }

    static nextSpan(span) {
        const index = Measurer.SPANS.indexOf(span);
        const indexMax = Measurer.SPANS.length-1;
        if (index === -1) return undefined;
        return Measurer.SPANS[Math.min(index+1, indexMax)];
    }

}

// Only these span values are supported (by proceed by 0.25 increment as encountered in the book Triple Your Reading Speed by Wade E. Cutler)
Measurer.SPANS = ['0in', '0.25in', '0.5in', '0.75in', '1in', '1.25in', '1.5in', '1.75in', '2in', '2.25in', '2.5in', '2.75in', '3in', '3.25in', '3.5in', '3.75in', '4in'];


Measurer.propTypes = {
    id: PropTypes.string,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.string,
    fontStyle: PropTypes.string,
    onChange: PropTypes.func,
};

Measurer.defaultProps = {
    id: 'chunker',
    fontFamily: 'Roboto',
    fontSize: '14pt',
    fontStyle: 'normal',
};

export default Measurer;

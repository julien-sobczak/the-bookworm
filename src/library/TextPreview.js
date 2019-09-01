import React from 'react';
import PropTypes from 'prop-types';

import ContentSelector from "./ContentSelector";

class TextPreview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            content: TextPreview.convertText(props.text),
        };

        this.handleValidation = this.handleValidation.bind(this);
    }

    static convertText(text) {
        const blocks = [];

        const lines = text.split('\n');
        for (let l = 0; l < lines.length; l++) {

            const line = lines[l];

            if (line.trim() === '') {
                continue;
            }

            blocks.push({ tag: "p", content: line })
        }

        return {
            type: 'clipboard',
            text: blocks,
        };
    }

    handleValidation(selection) {
        this.props.onSelect(selection);
    }

    render() {
        return (
            <div className="TextPreview FullScreen Centered">
                {this.state.content &&
                    <ContentSelector content={this.state.content} onSelect={this.handleValidation} />
                }
            </div>
        );
    }

}

TextPreview.propTypes = {
    text: PropTypes.string,
    onSelect: PropTypes.func,
};

TextPreview.defaultProps = {
    onSelect: function() {},
};

export default TextPreview;
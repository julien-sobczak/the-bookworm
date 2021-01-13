import React from 'react';
import PropTypes from 'prop-types';

import { ScreenPreviewContent } from '../core/UI';
import ContentSelector from "./ContentSelector";

class PreviewText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            content: PreviewText.convertText(props.text),
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

            blocks.push({ tag: "p", content: line });
        }

        return {
            type: 'clipboard',
            blocks: blocks,
        };
    }

    handleValidation(selection) {
        this.props.onSelect(selection);
    }

    render() {
        return (
            <ScreenPreviewContent>
                {this.state.content &&
                    <ContentSelector content={this.state.content} onSelect={this.handleValidation} />
                }
            </ScreenPreviewContent>
        );
    }

}

PreviewText.propTypes = {
    text: PropTypes.string,
    onSelect: PropTypes.func,
};

PreviewText.defaultProps = {
    onSelect: function() {},
};

export default PreviewText;

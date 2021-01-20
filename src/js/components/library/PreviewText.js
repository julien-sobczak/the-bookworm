import React from 'react';
import PropTypes from 'prop-types';

import { PreviewContentScreen } from '../core/UI';
import ContentSelector from "./ContentSelector";

/**
 * Preview a copy/paste text to allow the user to edit it.
 */
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
            <PreviewContentScreen>
                {this.state.content &&
                    <ContentSelector content={this.state.content} onSelect={this.handleValidation} />
                }
            </PreviewContentScreen>
        );
    }

}

PreviewText.propTypes = {
    /**
     * The content in the standard format to preview.
     */
    text: PropTypes.string,
    /**
     * Called when the user has finished filtered the content.
     * The callback received the new content filtered in the same format.
     */
    onSelect: PropTypes.func,
};

PreviewText.defaultProps = {
    onSelect: function() {},
};

export default PreviewText;

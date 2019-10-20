import React from 'react';
import PropTypes from 'prop-types';

import { DEMO_CONTENT } from '../../../constants';
import Button from "../toolbox/Button.js";

class ContentSelector extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Memorize the selection
            startBlock: undefined, // 0-based inclusive index
            endBlock: undefined, // 0-based inclusive index
        };

        this.handleBlockSelected = this.handleBlockSelected.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }

    handleBlockSelected(event) {
        const blockIndex = parseInt(event.target.dataset.index);
        if (blockIndex === this.state.startBlock) {
            this.setState({ startBlock: undefined, endBlock: undefined });
        } else if (blockIndex < this.state.startBlock) {
            this.setState({ startBlock: blockIndex });
        } else if (!this.state.startBlock) {
            this.setState({ startBlock: blockIndex });
        } else {
            this.setState({ endBlock: blockIndex });
        }
    }

    handleValidation() {
        const newContent = {
            ...this.props.content,
            blocks: this.props.content.text.slice(this.state.startBlock, this.state.endBlock + 1),
        };
        this.props.onSelect(newContent);
    }

    render() {
        return (
            <>
                <div className="ContentSelector">
                    {this.props.content && this.props.content.text.map((block, index) => {
                        const attributes = {
                            key: index,
                            "data-index": index,
                        };

                        attributes.onClick = this.handleBlockSelected;

                        // Add various CSS classes to customize the style
                        if (this.state.startBlock === undefined) {
                            // Nothing is selected
                            attributes.className = 'Add';
                        } else if (this.state.startBlock >= 0 && index < this.state.startBlock) {
                            // Expand select at the top
                            attributes.className = 'ExpandTop';
                        } else if (this.state.startBlock >= 0 && index >= this.state.startBlock) {
                            // Inside the selection
                            if (!this.state.endBlock || index <= this.state.endBlock) {
                                attributes.className = 'Selected';
                                if (this.state.startBlock === index) attributes.className += ' First';
                                if (this.state.endBlock === index) attributes.className += ' Last';
                            }
                        } else if (this.state.endBlock && index > this.state.endBlock) {
                            attributes.className = 'ExpandBottom';
                        }

                        attributes.dangerouslySetInnerHTML = {__html: block.content}

                        return React.createElement(block.tag, attributes, null);
                    })}
                </div>
                <div className="ButtonValidate">
                    <Button text="Read" colorText="black" colorBackground="var(--theme-color)" onClick={this.handleValidation} />
                </div>
            </>
        );
    }

    componentDidMount() {
        if (this.props.selectAll) {
            this.setState({
                ...this.state,
                startBlock: 0,
                endBlock: this.props.content.text.length - 1,
            })
        }
    }

}

ContentSelector.propTypes = {
    content: PropTypes.object,
    onSelect: PropTypes.func,
    selectAll: PropTypes.bool,
};

ContentSelector.defaultProps = {
    content: DEMO_CONTENT,
    selectAll: true,
    onSelect: function() {},
};

export default ContentSelector;
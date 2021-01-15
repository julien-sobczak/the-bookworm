import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { DEMO_CONTENT } from '../../../constants';
import LargeButton from "../toolbox/LargeButton.js";
import LargeButtonGroup from '../toolbox/LargeButtonGroup';

const Preview = styled.div`
    max-width: 50vw;
    max-height: 85vh;
    margin: 0 auto;
    line-height: 1.5em;

    h2 {
        font-size: 1.5em;
        margin: 2em;
    }
    p {
        margin: 1em;
    }

    > * {
        cursor: n-resize;
        position: relative;
    }

    /* Add a green mark for selected blocks */
    > *.Selected::after {
        content: "\2714";
        position: absolute;
        top: 0.1em;
        width: 25px;
        text-align: center;
        left: -2.5em;
        color: white;
    }
    > *.Selected::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: -2.5em;
        border-left: 25px solid var(--theme-color);
    }

    /* Turn the mark red for the first selected block as clicking on it unselect the whole selection. */
    > *.Selected.First {
        cursor: no-drop;
    }
    > *.Selected.First:hover::before {
        border-left: 25px solid darkred;
    }
    > *.Selected.First:hover::after {
        content: '\00D7';
        color: white;
    }

    /* Turn the mark orange on hover as clicking on a block unselect the following blocks. */
    > *.Selected:hover::before {
        border-left: 25px solid darkgoldenrod;
    }
    > *.Selected:hover::after {
        content: '\2702';
        color: white;
    }

    > *.Add {
        cursor: copy;
    }
    > *.ExpandTop {
        cursor: n-resize;
    }
    > *.ExpandBottom {
        cursor: s-resize;
    }
`;

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
                <Preview>
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

                        attributes.dangerouslySetInnerHTML = {__html: block.content};

                        return React.createElement(block.tag, attributes, null);
                    })}
                </Preview>
                <LargeButtonGroup>
                    <LargeButton text="Read" colorText="black" colorBackground="var(--theme-color)" onClick={this.handleValidation} />
                </LargeButtonGroup>
            </>
        );
    }

    componentDidMount() {
        if (this.props.selectAll) {
            this.setState({
                ...this.state,
                startBlock: 0,
                endBlock: this.props.content.text.length - 1,
            });
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

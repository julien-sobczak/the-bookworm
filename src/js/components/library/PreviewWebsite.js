import React from 'react';
import PropTypes from 'prop-types';

import Loader from "../toolbox/Loader.js";
import { PreviewContentScreen } from './UI.js';

/**
 * Preview a web page to let the user select the node in the DOM
 * to use to extract the content.
 *
 * Note: This component is not used for now, as most websites block
 * Ajax requests coming from cross origins.
 */
class PreviewWebsite extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // HTML body of the URL response
            html: undefined,
        };

        this.handleValidation = this.handleValidation.bind(this);
    }

    handleValidation(selection) {
        this.props.onSelect(selection);
    }

    render() {
        return (
            <PreviewContentScreen>

                {!this.state.text && !this.state.metadata &&
                    <Loader />
                }

                {this.state.statusCode && this.state.statusCode !== 200 &&
                    <h4>{this.state.statusCode} - {this.state.statusText}</h4>
                }

                {this.state.html &&
                    <div>
                        {this.state.html.subtring(0, 10)}
                    </div>
                }
            </PreviewContentScreen>
        );
    }

    componentDidMount() {
        console.log(`Downloading ${this.props.url}...`);
        fetch(this.props.url)
            .then(response => {
                if (response.status !== 200) {
                    this.setState({
                        statusCode: response.status,
                        statusMessage: response.statusText,
                    });
                } else {
                    response.text().then(text => {
                        this.setState({
                            html: text,
                            statusCode: 200,
                            statusMessage: 'OK',
                        });
                    });
                }
            });
    }
}

PreviewWebsite.propTypes = {
    /**
     * The URL to preview.
     */
    url: PropTypes.string,
    /**
     * Called when the user has finished filtered the content.
     * The callback received the new content filtered in the standard format.
     */
    onSelect: PropTypes.func,
};

PreviewWebsite.defaultProps = {
    onSelect: function() {},
};

export default PreviewWebsite;

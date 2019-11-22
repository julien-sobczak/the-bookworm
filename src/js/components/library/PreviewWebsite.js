import React from 'react';
import PropTypes from 'prop-types';

//import ContentSelector from "./ContentSelector";
import Loader from "../toolbox/Loader.js";

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
            <div className="PreviewContent PreviewWebsite FullScreen Centered">

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
            </div>
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
    url: PropTypes.string,
    onSelect: PropTypes.func,
};

PreviewWebsite.defaultProps = {
    onSelect: function() {},
};

export default PreviewWebsite;
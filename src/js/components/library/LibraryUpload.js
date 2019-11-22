import React from 'react';
import PropTypes from 'prop-types';
import PreviewEpub from './PreviewEpub';

class LibraryUpload extends React.Component {

    // Files were alreadly uploaded on the next screen.
    // We just delegate to the Preview component.
    render() {
        return (
            <div className="LibraryUpload Centered">
                {this.props.filetype === 'application/epub+zip' &&
                    <PreviewEpub epub={this.props.file} onSelect={(selection) => this.props.onSelect(selection) } />
                }
            </div>
        );
    }

}

LibraryUpload.propTypes = {
    filetype: PropTypes.string.isRequired,
    file: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default LibraryUpload;
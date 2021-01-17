import React from 'react';
import PropTypes from 'prop-types';

import PreviewEpub from './PreviewEpub';
import { LibraryScreen } from '../core/UI';

class LibraryUpload extends React.Component {

    // Files were alreadly uploaded on the next screen.
    // We just delegate to the Preview component.
    render() {
        return (
            <LibraryScreen className="LibraryUpload">
                {this.props.filetype === 'application/epub+zip' &&
                    <PreviewEpub epub={this.props.file} onSelect={(selection) => this.props.onSelect(selection) } />
                }
            </LibraryScreen>
        );
    }

}

LibraryUpload.propTypes = {
    filetype: PropTypes.string.isRequired, // Only application/epub+zip is supported
    file: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default LibraryUpload;

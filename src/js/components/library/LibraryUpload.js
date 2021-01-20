import React from 'react';
import PropTypes from 'prop-types';

import PreviewEpub from './PreviewEpub';
import { LibraryScreen } from '../core/UI';

/**
 * TODO This component is not used currently. Why?
 *
 * @param {Object} props The component properties.
 */
function LibraryUpload({ filetype, file, onSelect }) {

    // Files were alreadly uploaded on the previous screen.
    // We just delegate to the Preview component.
    return (
        <LibraryScreen>
            {filetype === 'application/epub+zip' &&
                <PreviewEpub content={file} onSelect={(content) => onSelect(content) } />
            }
        </LibraryScreen>
    );
}

LibraryUpload.propTypes = {
    /**
     * The MIME filetype.
     * Note that only application/epub+zip is supported
     */
    filetype: PropTypes.string.isRequired,
    /**
     * The file content in the standard format.
     */
    file: PropTypes.object.isRequired,
    /**
     * Called when the user has finished filtered the chapters content.
     * The callback receives the new content in the standard format.
     */
    onSelect: PropTypes.func.isRequired,
};

export default LibraryUpload;

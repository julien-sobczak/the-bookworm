import React, { useState } from 'react';
import PropTypes from 'prop-types';

import RadioButtons from '../toolbox/RadioButtons';

const FormChunk = (props) => {

    const [chunkStyle, setChunkStyle] = useState(props.chunkStyle);
    const onChange = props.onChange;

    const handleChunkStyleClick = (event) => {
        const newChunkStyle = event.target.value;
        if (chunkStyle === newChunkStyle) return;
        setChunkStyle(newChunkStyle);
        onChange({
            chunkStyle: newChunkStyle,
        });
    };

    return (
        <table className="Setting">
            <tbody>
                <tr>
                    <th><label>Style</label>:</th>
                    <td>
                        <RadioButtons 
                            options={[
                                { value: 'highlight', className: 'ChunkHighlight' },
                                { value: 'color', className: 'ChunkColor' },
                                { value: 'underline', className: 'ChunkUnderline' },
                            ]} 
                            onChange={handleChunkStyleClick} 
                            value={chunkStyle} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

FormChunk.propTypes = {
    chunkStyle: PropTypes.string,
    onChange: PropTypes.func,
};

FormChunk.defaultProps = {
    chunkStyle: "highlight",
};

export default FormChunk;
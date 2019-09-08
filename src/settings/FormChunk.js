import React, { useState } from 'react';

const FormChunk = (props) => {

    const [chunkStyle, setChunkStyle] = useState(props.chunkStyle);
    const onChange = props.onChange;

    const handleChunkStyleClick = (event) => {
        const newChunkStyle = event.target.dataset.value;
        if (chunkStyle === newChunkStyle) return;
        setChunkStyle(newChunkStyle)
        onChange({
            chunkStyle: newChunkStyle,
        });
    }

    return (
        <table className="Setting">
            <tbody>
                <tr>
                    <th>Style:</th>
                    <td>
                        <span onClick={handleChunkStyleClick} className={"GraphicOption ChunkHighlight " + (chunkStyle === 'highlight' ? 'selected' : '')} data-value="highlight">
                            <span>Highlight</span>
                        </span>
                        <span onClick={handleChunkStyleClick} className={"GraphicOption ChunkColor "     + (chunkStyle === 'color' ? 'selected' : '')} data-value="color">
                            <span>Color</span>
                        </span>
                        <span onClick={handleChunkStyleClick} className={"GraphicOption ChunkUnderline " + (chunkStyle === 'underline' ? 'selected' : '')} data-value="underline">
                            <span>Underline</span>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default FormChunk;
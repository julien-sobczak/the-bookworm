import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function Toc({ chapters, selectedIndex, onSelect }) {

    const Container = styled.div`
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 2000;
        overflow: scroll;

        li {
            position: relative; /* Used to position the :before and :arrow squares and form an arrow */
            max-width: 3in;
            height: 2em;
            line-height: 1.5em;
            vertical-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0.5em 1.5em 0.5em 2.5em;
            color: black;
            cursor: pointer;
        }
        li.Selected {
            background-color: var(--theme-color);
            font-weight: 600;
        }
        /* Arrow style */
        li.Selected::before {
            content: '';
            position: absolute;
            height: 3em;
            width: 3em;
            top: -2em;
            left: -2em;
            z-index: 10;
            background-color: white;
            transform: rotate(45deg);
        }
        li.Selected::after {
            content: '';
            position: absolute;
            height: 3em;
            width: 3em;
            bottom: -2em;
            left: -2em;
            z-index: 10;
            background-color: white;
            transform: rotate(45deg);
        }
    `;

    const handleClick = (event) => {
        const chapterIndex = parseInt(event.target.dataset.index);
        const chapter = chapters[chapterIndex];
        onSelect({
            chapterIndex: chapterIndex,
            chapter: chapter,
        });
    };

    return (
        <div className="Toc">
            <ul>
                {chapters && chapters.map((chapter, index) => {
                    return (
                        <li
                            key={index}
                            data-index={index}
                            className={classnames({'Selected': index === selectedIndex})}
                            onClick={handleClick}>
                                {chapter.title}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
Toc.propTypes = {
    chapters: PropTypes.arrayOf(PropTypes.object),
    selectedIndex: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
};

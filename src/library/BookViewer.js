import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Pager from '../chunking/Pager';

class BookViewer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pages: undefined,
            pageNumber: 0,
        };

        this.onPagerDone = this.onPagerDone.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }

    onPagerDone(pages) {
        console.log(pages);
        this.setState(state => ({
            ...state,
            pages: pages,
            pageNumber: 1,
        }));
    }

    previousPage() {
        if (!this.state.pages) return;
        if (this.state.pageNumber === 1) return;
        this.setState(state => ({
            ...state,
            pageNumber: state.pageNumber-1,
        }));
    }

    nextPage() {
        if (!this.state.pages) return;
        if (this.state.pageNumber === this.state.pages.length) return;
        this.setState(state => ({
            ...state,
            pageNumber: state.pageNumber+1,
        }));
    }

    cssPaperSize() {
        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }
        return 'Paper' + capitalize(this.props.paperSize)
    }

    render() {
        return (
            <div className="FullScreen BookViewer">

                <Link to="/" className="ButtonClose"><i className="material-icons">close</i></Link>

                <Pager content={this.props.content} onDone={this.onPagerDone} />

                <section className="PageControls">
                    <ul>
                        <li><button onClick={this.previousPage}><i className="material-icons">chevron_left</i></button></li>
                        <li><button onClick={this.nextPage}><i className="material-icons">chevron_right</i></button></li>
                    </ul>
                </section>

                <section className="DrillArea">
                    {this.state.pageNumber > 0 && <div className={"Paper " + this.cssPaperSize()}>
                        <div className="PaperContent" ref={this.paperElement}>
                            {this.state.pages[this.state.pageNumber - 1].blocks.map((block, index) => React.createElement(
                                block.tag,
                                {key: index, className: (block.continuation ? 'Continuation' : '')},
                                block.chunks.map((chunk, iChunk) => {
                                    return <span className={(chunk.trim() !== '' ? 'Chunk' : 'Space')}
                                                  key={iChunk}
                                                  dangerouslySetInnerHTML={{__html: chunk}} />
                                })
                            ))}
                        </div>
                    </div>}
                </section>
            </div>
        );
    }

}

BookViewer.propTypes = {
    content: PropTypes.object,

    // See DESIGN.md
    paperSize: PropTypes.string,
    chunkWidth: PropTypes.string,
    chunkAccuracy: PropTypes.number,
}

BookViewer.defaultProps = {
    // See DESIGN.md
    paperSize: 'A5',
    chunkWidth: '2in',
    chunkAccuracy: 0.9,
};

export default BookViewer;

import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Pager from '../chunking/Pager';
import Paper from "../toolbox/Paper";
import PageContent from "../toolbox/PageContent";
import { capitalize } from "../functions/string";

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
        console.log('Received', pages);
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
        return 'Paper' + capitalize(this.props.paperSize)
    }

    render() {
        return (
            <div className="FullScreen BookViewer">

                <Link to="/" className="ButtonClose"><i className="material-icons">close</i></Link>

                <Pager content={this.props.content} onDone={this.onPagerDone}
                       {...this.props} />

                <section className="DrillControls">
                    <ul>
                        <li><button onClick={this.previousPage}><i className="material-icons">chevron_left</i></button></li>
                        <li><button onClick={this.nextPage}><i className="material-icons">chevron_right</i></button></li>
                    </ul>
                </section>

                <section className="DrillArea">
                    {this.state.pageNumber > 0 &&
                        <Paper {...this.props}>
                            <PageContent page={this.state.pages[this.state.pageNumber - 1]} />
                        </Paper>
                    }
                </section>
            </div>
        );
    }

}

BookViewer.propTypes = {
    ...Paper.propTypes,

    content: PropTypes.object,

    chunkWidth: PropTypes.string,
    chunkAccuracy: PropTypes.number,
}

BookViewer.defaultProps = {
    ...Paper.defaultProps,

    chunkWidth: '2in',
    chunkAccuracy: 0.9,
};

export default BookViewer;

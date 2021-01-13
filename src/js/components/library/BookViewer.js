import React from 'react';
import PropTypes from 'prop-types';

import PreviousIcon from '@material-ui/icons/ChevronLeft';
import NextIcon from '@material-ui/icons/ChevronRight';

import Pager from '../chunking/Pager';
import Paper from "../core/Paper";
import PageContent from "../core/PageContent";

import * as string from "../../functions/string";
import { SPANS } from '../../functions/engine';

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
        return 'Paper' + string.capitalize(this.props.paperSize);
    }

    render() {
        return (
            <div className="FullScreen BookViewer">

                <Pager content={this.props.content} onDone={this.onPagerDone}
                    {...this.props} />

                <section className="DrillControls">
                    <ul>
                        <li><button onClick={this.previousPage}><PreviousIcon /></button></li>
                        <li><button onClick={this.nextPage}><NextIcon /></button></li>
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

    chunkWidth: PropTypes.oneOf(SPANS),
    chunkAccuracy: PropTypes.number,
};

BookViewer.defaultProps = {
    ...Paper.defaultProps,

    chunkWidth: '2in',
    chunkAccuracy: 0.9,
};

export default BookViewer;

import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import PreviousIcon from '@material-ui/icons/ChevronLeft';
import NextIcon from '@material-ui/icons/ChevronRight';

import Pager from '../chunking/Pager';
import Paper from "../core/Paper";
import Screen from "../core/Screen";
import PageContent from "../core/PageContent";
import { DrillControlGroup, DrillArea} from "../core/UI";

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
            <Screen centered={false}>

                <Pager content={this.props.content} onDone={this.onPagerDone}
                    {...this.props} />

                <DrillControlGroup>
                    <Tooltip title="Previous page"><Button onClick={this.previousPage}><PreviousIcon /></Button></Tooltip>
                    <Tooltip title="Next page"><Button onClick={this.nextPage}><NextIcon /></Button></Tooltip>
                </DrillControlGroup>

                <DrillArea>
                    {this.state.pageNumber > 0 &&
                        <Paper {...this.props}>
                            <PageContent page={this.state.pages[this.state.pageNumber - 1]} />
                        </Paper>
                    }
                </DrillArea>
            </Screen>
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

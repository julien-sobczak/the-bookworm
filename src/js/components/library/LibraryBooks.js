import React from 'react';
import { connect } from "react-redux";

import Button from "../toolbox/Button";
import Loader from "../toolbox/Loader";

import * as library from "../../functions/library";

const mapStateToProps = state => {
    return { readings: state.readings };
};

class LibraryBooks extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading:  true,
            catalog: [],
        };

        this.handleBookSelected = this.handleBookSelected.bind(this);
    }

    handleBookSelected(event) {
        const slug = event.target.dataset.slug;
        for (let i = 0; i < this.state.catalog.length; i++) {
            const entry = this.state.catalog[i];
            if (entry.slug === slug) {
                // Found the content to download
                this.setState({
                    loading: true
                });
                library.downloadContent(entry).then(content => this.props.onSelect(content));
                break
            }
        }
    }

    render() {
        return (
            <div className="LibraryBooks Centered">
                {this.state.loading && <Loader />}

                {!this.state.loading && this.state.catalog.length > 0 &&
                    <>
                        <h3>Choose a book</h3>
                        {/* TODO Add filters by language, by kind, search box */}
                        <div className="Bookshelf Scrollbar">
                            <table>
                                <tbody>
                                    {this.state.catalog.map((book, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="BookTitle">
                                                    <button data-slug={book.slug} onClick={this.handleBookSelected}>
                                                        {book.title}
                                                    </button>
                                                </td>
                                                <td className="BookAuthor">
                                                    {book.author}
                                                </td>
                                                <td>
                                                    {book.slug in this.props.readings &&
                                                        <span className="ProgressBar">Yes</span>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="Buttons">
                            <Button text="Back" colorText="white" colorBackground="#111" onClick={() => this.props.onCancel()} />
                        </div>
                    </>
                }

            </div>
        );
    }

    componentDidMount() {
        console.log(`Downloading ${this.CATALOG_URL}...`);
        library.downloadCatalog.then(data => {
            this.setState({
                loading: false,
                catalog: data
            });
        });
    }
}

export default connect(mapStateToProps)(LibraryBooks);
import React from 'react';
import { connect } from "react-redux";

import PreviewBook from './PreviewBook';

import MainButton from "../toolbox/MainButton";
import Loader from "../toolbox/Loader";

const mapStateToProps = state => {
    return { readings: state.readings };
};

class LibraryBooks extends React.Component {

    CATALOG_URL = "https://open-library-books.firebaseapp.com/catalog.json";

    constructor(props) {
        super(props);

        this.state = {
            entry: undefined,
            catalog: [],
        };

        this.handleBookSelected = this.handleBookSelected.bind(this);
    }

    handleBookSelected(event) {
        const slug = event.target.dataset.slug;
        for (let i = 0; i < this.state.catalog.length; i++) {
            const entry = this.state.catalog[i];
            if (entry.slug === slug) {
                this.setState({
                    entry: entry,
                });
                break
            }
        }
    }

    render() {
        return (
            <div className="LibraryBooks Centered">
                {this.state.catalog.length === 0 && <Loader />}

                {!this.state.entry &&
                    <>
                        <h3>Choose a book</h3>
                        {/* TODO Add filters by language, by kind, search box */}
                        <div className="Bookshelf">
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
                            <MainButton text="Back" colorText="white" colorBackground="#111" onClick={() => this.props.onCancel()} />
                        </div>
                    </>
                }

                {this.state.entry &&
                    <PreviewBook entry={this.state.entry} onSelect={(selection) => this.props.onSelect(selection) } />
                }

            </div>
        );
    }

    componentDidMount() {
        console.log(`Downloading ${this.CATALOG_URL}...`);
        fetch(this.CATALOG_URL)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.setState({ catalog: data });
            });
    }
}

export default connect(mapStateToProps)(LibraryBooks);
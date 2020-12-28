import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import Button from "../toolbox/Button";
import Loader from "../toolbox/Loader";

import * as library from "../../functions/library";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

function LanguageIcon({name}) {
    return (
        <>
            {name === 'English' && <>🇬🇧&nbsp;</>}
            {name === 'French' && <>🇫🇷&nbsp;</>}
            {name === 'German' && <>🇩🇪&nbsp;</>}
            {name === 'Italian' && <>🇮🇹&nbsp;</>}
            {name === 'Spanish' && <>🇪🇸&nbsp;</>}
            {name === 'Portuguese' && <>🇵🇹&nbsp;</>}
        </>
    );
}
LanguageIcon.propTypes = {
    name: PropTypes.string.isRequired,
};


class LibraryBooks extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Does the catalog is currently being downloading?
            loading:  true,
            // The catalog retrieved from open-library-books.web.app
            catalog: [],
            // The filtered books
            books: [],
            // The custom text filter
            filterRegex: "",
            // Which letter is currently selected by the user to filter books?
            filterLetter: "*",
            // The type of books
            filterType: "all",
            // Which language is currently selected by the user?
            filterLanguage: props.preferencesLanguage.native,
        };

        this.filterByRegex = this.filterByRegex.bind(this);
        this.filterByLanguage = this.filterByLanguage.bind(this);
        this.filterByType = this.filterByType.bind(this);
        this.filterByLetter = this.filterByLetter.bind(this);
        this.filterByAuthor = this.filterByAuthor.bind(this);
        this.handleBookSelected = this.handleBookSelected.bind(this);
    }

    /* Selection management */

    handleBookSelected(event) {
        const slug = event.target.dataset.slug;
        for (let i = 0; i < this.state.catalog.length; i++) {
            const entry = this.state.catalog[i];
            if (entry.slug === slug) {
                // Found the content to download
                this.setState({
                    loading: true,
                });
                library.downloadContent(entry).then(content => this.props.onSelect(content));
                break;
            }
        }
    }

    /* Filters management */

    filterBooks() {
        const letterCount = new Array(letters.length).fill(0);
        const matchFilters = book => {
            if (this.state.filterLanguage !== '' && book.language !== this.state.filterLanguage) {
                return false;
            }

            if (this.state.filterLetter !== '*' && book.title[0] !== this.state.filterLetter) {
                return false;
            }

            if (this.state.filterRegex !== '') {
                const regex = new RegExp(this.state.filterRegex, 'g');
                if (book.title.match(regex)) return true;
                if (book.author.match(regex)) return true;
                return false;
            }

            if (this.state.filterType !== 'all') {
                if (book.type !== this.state.filterType) return false;
            }

            const firstLetter = book.title[0].toUpperCase();
            const indexFirstLetter = letters.indexOf(firstLetter);
            if (indexFirstLetter !== -1) {
                letterCount[indexFirstLetter] = letterCount[indexFirstLetter]+1;
            }
            return true;
        };
        const books = this.state.catalog.filter(matchFilters);
        this.setState({
            books: books,
            letterCount: letterCount,
        });
    }

    filterByRegex(event) {
        this.setState({
            filterRegex: event.target.value,
        }, this.filterBooks);
    }

    filterByType(event) {
        let newType = event.target.dataset.type;
        if (newType === this.state.filterType) {
            newType = 'all';
        }
        this.setState({
            filterType: newType,
        }, this.filterBooks);
    }

    filterByLanguage(event) {
        let newLanguage = event.target.dataset.language;
        if (newLanguage === this.state.filterLanguage) {
            newLanguage = '';
        }
        this.setState({
            filterLanguage: newLanguage,
        }, this.filterBooks);
    }

    filterByLetter(event) {
        this.setState({
            filterLetter: event.target.dataset.letter,
        }, this.filterBooks);
    }

    filterByAuthor(event) {
        const author = event.target.dataset.author;
        this.setState({
            filterLetter: '*',
            filterRegex: author,
        }, this.filterBooks);
    }

    render() {
        return (
            <div className="LibraryBooks Centered">
                {this.state.loading && <Loader />}

                {!this.state.loading && this.state.catalog.length > 0 &&
                    <>
                        <h3>Choose a book</h3>

                        <div className="LibraryFilters">

                            {/* Filter by regex */}
                            {this.state.filterRegex}
                            <input type="text" placeholder="Search..." value={this.state.filterRegex} onChange={this.filterByRegex} />

                            {/* Filter by language */}
                            <ul>
                                {this.state.popularLanguages.map((language, index) => {
                                    const selected = this.state.filterLanguage === language.name;
                                    return (
                                        <li key={index} className={selected ? 'Selected' : ''}>
                                            <button onClick={this.filterByLanguage} className="Clickable" data-language={language.name}>
                                                <LanguageIcon name={language.name} />
                                                {language.name}&nbsp;
                                                {!selected && <sup>{language.count}</sup>}
                                                {selected && <i className="material-icons md-small">backspace</i>}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Filter by type */}
                            <ul>
                                <li className={this.state.filterType === 'fiction' ? 'Selected' : ''}>
                                    <button onClick={this.filterByType} className="Clickable" data-type="fiction">
                                        Fiction
                                        {this.state.type === 'fiction' && <i className="material-icons md-small">backspace</i>}
                                    </button>
                                </li>
                                <li className={this.state.filterType === 'nonfiction' ? 'Selected' : ''}>
                                    <button onClick={this.filterByType} className="Clickable" data-type="nonfiction">
                                        Nonfiction
                                        {this.state.type === 'nonfiction' && <i className="material-icons md-small">backspace</i>}
                                    </button>
                                </li>
                            </ul>

                            {/* Filter by first letter */}
                            <ul>
                                <li key={0} className={this.state.filterLetter === '*' ? 'Selected' : ''}>
                                    <button onClick={this.filterByLetter} data-letter="*">All</button>
                                </li>
                                {letters.map((letter, index) => {
                                    const countLetter = this.state.letterCount && this.state.letterCount[letters.indexOf(letter)];
                                    return (
                                        <li key={index+1} className={this.state.filterLetter === letter ? 'Selected' : ''}>
                                            {countLetter > 0 && <button onClick={this.filterByLetter} data-letter={letter}>{letter}</button>}
                                            {countLetter === 0 && <button disabled={true}>{letter}</button>}
                                        </li>
                                    );
                                })}
                            </ul>

                        </div>

                        <div className="Bookshelf Scrollbar">
                            <table>
                                <tbody>
                                    {this.state.books.map((book, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="BookTitle">
                                                    <button data-slug={book.slug} onClick={this.handleBookSelected}>
                                                        {book.title}
                                                    </button>
                                                </td>
                                                <td className="BookMetadata">
                                                    <button onClick={this.filterByAuthor} data-author={book.author}>{book.author}</button>
                                                </td>
                                                <td className="BookMetadata">
                                                    <LanguageIcon name={book.language} />
                                                </td>
                                                <td className="BookMetadata">
                                                    {book.numberPages} pages
                                                </td>
                                                <td>
                                                    {book.slug in this.props.readings &&
                                                        <span className="ProgressBar">Yes</span>
                                                    }
                                                </td>
                                            </tr>
                                        );
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

    static getPopularLanguages(books) {
        // Keep only the first most present languages
        const keepLanguages = 5;

        const languageNames = [];
        const languageCount = [];
        books.forEach(book => {
            const index = languageNames.indexOf(book.language);
            if (index === -1) {
                languageNames.push(book.language);
                languageCount.push(0);
            } else {
                languageCount[index]++;
            }
        });

        // Zip arrays
        const popularLanguages = languageNames.map(function(name, i) {
            return {
                name: name,
                count: languageCount[i],
            };
        });

        return popularLanguages.slice(0, Math.min(popularLanguages.length, keepLanguages));
    }

    componentDidMount() {
        console.log(`Downloading ${this.CATALOG_URL}...`);
        library.downloadCatalog().then(data => {
            const popularLanguages = LibraryBooks.getPopularLanguages(data);
            this.setState({
                loading: false,
                catalog: data,
                popularLanguages: popularLanguages,
            }, this.filterBooks);
        });
    }
}

LibraryBooks.propTypes = {
    // Redux State
    readings: PropTypes.array.isRequired,
    preferencesLanguage: PropTypes.object.isRequired,
    // Callbacks
    onSelect: PropTypes.func,
    onCancel: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        readings: state.readings,
        preferencesLanguage: state.preferences.language,
    };
};

export default connect(mapStateToProps)(LibraryBooks);

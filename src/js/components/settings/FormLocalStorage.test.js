import React from 'react';
import { render, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormLocalStorage from './FormLocalStorage';

class LocalStorageMock {
    constructor() {
        this.store = {};
    }
  
    clear() {
        this.store = {};
    }
  
    getItem(key) {
        return this.store[key] || null;
    }
  
    setItem(key, value) {
        this.store[key] = value.toString();
    }
  
    removeItem(key) {
        delete this.store[key];
    }
}
  
beforeEach(() => {
    global.localStorage = new LocalStorageMock();
});
afterEach(cleanup);

it('retrieves books from the localStorage', () => {
    var util = require('util');
    global.TextEncoder = util.TextEncoder;

    global.localStorage.setItem("content-book-en-The-Adventures-of-Sherlock-Holmes", `
{
    "id": "content-book-en-The-Adventures-of-Sherlock-Holmes",
    "type": "book",
    "description": {
        "type": "literature",
        "origin": "gutenberg",
        "title": "The Adventures of Sherlock Holmes",
        "author": "Arthur Conan Doyle",
        "slug": "The-Adventures-of-Sherlock-Holmes",
        "url": "https://www.gutenberg.org/ebooks/1661",
        "file": "http://www.gutenberg.org/cache/epub/1661/pg1661.txt",
        "language": "English"
    },
    "content": {
        "sections": [
            {
                "title": "I. A SCANDAL IN BOHEMIA",
                "blocks": [
                    { "tag": "p", "content": "To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name."}
                ]
            }
        ]
    }
}`);
    global.localStorage.setItem("content-book-en-Pride-and-Prejudice", `
{
    "id": "content-book-en-Pride-and-Prejudice",
    "type": "book",
    "description": {
        "type": "literature",
        "origin": "gutenberg",
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "slug": "Pride-and-Prejudice",
        "url": "https://www.gutenberg.org/ebooks/1342",
        "file": "https://www.gutenberg.org/files/1342/1342-0.txt",
        "language": "English"
    },
    "content": {
        "sections": [
            {
                "title": "Chapter 1",
                "blocks": [
                    { "tag": "p", "content": "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife." }
                ]
            }
        ]
    }
}`);

    const { getByTestId } = render(<FormLocalStorage />);
    const table = getByTestId('table');
    let utils = within(table);

    // Check all books are present 
    expect(utils.getByText("Pride and Prejudice")).toBeInTheDocument();
    expect(utils.getByText("The Adventures of Sherlock Holmes")).toBeInTheDocument();
    
    // Check properties for a given book
    const trSherlock = utils.getByText("The Adventures of Sherlock Holmes").closest("tr");
    utils = within(trSherlock);
    expect(utils.getByText("Arthur Conan Doyle")).toBeInTheDocument();
    expect(utils.getByText("811 bytes")).toBeInTheDocument();

    // Try to delete the book
    trSherlock.querySelector("button").click();
    expect(global.localStorage.getItem("content-book-en-The-Adventures-of-Sherlock-Holmes")).toBeNull();
    expect(global.localStorage.getItem("content-book-en-Pride-and-Prejudice")).not.toBeNull();
});

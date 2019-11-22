/**
 * List of inspiring quotes found in the Internet or in books.
 */
const quotes = [
    { author: "George R.R. Martin", text: "A reader lives a thousand lives before he dies... The man who never reads lives only one.", },
    { author: "Lemony Snicket", text: "Never trust anyone who has not brought a book with them.", },
    { author: "C.S. Lewis", text: "You can never get a cup of tea large enough or a book long enough to suit me.", },
    { author: "Groucho Marx", text: "I find television very educating. Every time somebody turns on the set, I go into the other room and read a book.", },
    { author: "Fran Lebowitz", text: "Think before you speak. Read before you think.", },
    { author: "Lena Dunham", text: "Let’s be reasonable and add an eighth day to the week that is devoted exclusively to reading.", },
    { author: "Descartes", text: "The reading of all good books is like conversation with the finest (people) of the past centuries.", },
    { author: "Mortimer J. Adler", text: "In the case of good books, the point is not to see how many of them you can get through, but rather how many can get through to you.", },
    { author: "Dr. Seuss", text: "The more that you read, the more things you will know. The more that you learn, the more places you’ll go.", },
    { author: "Orhan Pamuk", text: "I read a book one day and my whole life was changed.", },
    { author: "Logan Pearsall Smith", text: "People say that life is the thing, but I prefer reading.", },
    { author: "Honoré de Balzac", text: "Reading brings us unknown friends", },
    { author: "Benjamin Franklin", text: "The person who deserves most pity is a lonesome one on a rainy day who doesn’t know how to read.", },
    { author: "Walt Disney", text: "There is more treasure in books than in all the pirate's loot on Treasure Island.", },
    { author: "Carl Sagan", text: "One glance at a book and you hear the voice of another person, perhaps someone dead for 1,000 years. To read is to voyage through time.", },
    { author: "Jane Smiley", text: "Many people, myself among them, feel better at the mere sight of a book.", },
    { author: "Henry David Thoreau", text: "Read the best books first, or you may not have a chance to read them at all.", },
    { author: "Abraham Lincoln", text: "Books serve to show a man that those original thoughts of his aren’t very new after all.", },
    { author: "C.S. Lewis", text: "I can’t imagine a man really enjoying a book and reading it only once.", },
    { author: "Paul Sweeney", text: "You know you’ve read a good book when you turn the last page and feel a little as if you have lost a friend.", },
    { author: "Frederick Douglas", text: "Once you learn to read, you will be forever free.", },
    { author: "Mark Twain", text: "The man who does not read good books is no better than the man who can’t.", },
    { author: "Victor Hugo", text: "To learn to read is to light a fire; every syllable that is spelled out is a spark.", },
    { author: "Garrison Keillor", text: "A book is a gift you can open again and again.", },
    { author: "Mary Schmich", text: "Reading is a discount ticket to everywhere.", },
    { author: "Roald Dahl", text: "If you are going to get anywhere in life you have to read a lot of books.", },
    { author: "Bill Watterson", text: "Rainy days should be spent at home with a cup of tea and a good book.", },
    { author: "John Steinbeck", text: "I guess there are never enough books.", },
    { author: "J.K. Rowling", text: "If you don’t like to read, you haven’t found the right book.", },
    { author: "Anne Herbert", text: "Libraries will get you through times of no money better than money will get you through times of no libraries.", },
    { author: "Henry Ward Beecher", text: "Books are not made for furniture, but there is nothing else that so beautifully furnishes a house.", },
    { author: "Joseph Brodsky", text: "There are worse crimes than burning books. One of them is not reading them.", },
    { author: "Mortimer J. Adler", text: "Reading is a basic tool in the living of a good life.", },
    { author: "Arthur Conan Doyle", text: "It is a great thing to start life with a small number of really good books which are your very own.", },
    { author: "Gustave Flaubert", text: "What better occupation, really, than to spend the evening at the fireside with a book, with the wind beating on the windows and the lamp burning bright.", },
    { author: "Wisława Szymborska", text: "I’m old-fashioned and think that reading books is the most glorious pastime that humankind has yet devised.", },
    { author: "Holbrook Jackson", text: "Never put off till tomorrow the book you can read today.", },
    // Add new quote in this array to print them on the homepage
];

/**
 * List of speed reading tips.
 */
const tips = [
    { text: "Faster reading speed leads to more concentration, which leads to more comprehension, which leads to stronger retention.", },
    { text: "Having a broad vocabulary is so important for learning to read faster.", },
    { text: "12pt is the ideal font size to speed read", author: "Abby Marks Beale", source: "The Complete Idiot's Guide to Speed Reading" },
    { text: "You have to consciously make time for the important things. If reading is one of your “important things,” you’ll find time for it.", },
    { text: "Just because you learn how to speed read, doesn’t mean you’ll automatically speed read everything. You probably know how to run, but you don’t run everywhere, do you? Most likely you walk much more often than you run. The same is true for speed reading.", },
    // Add new tip in this array to print them on the homepage
];

/**
 * Returns a random element present in the given array.
 *
 * @param {Array} array A list of elements to chose from
 * @return {Object} The selected item
 */
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a randomly chosen quote.
 *
 * @return {Object} A quote
 */
export function getQuoteOfTheDay() {
    return randomElement(quotes);
}

/**
 * Returns a randomly chose tip.
 *
 * @return {Object} A tip
 */
export function getTipOfTheDay() {
    return randomElement(tips);
}

/**
 * Returns the message of the day based on a list of predefined contents.
 * Checks the type attribute to determine the kind of message.
 *
 * @return {Object} The message.
 */
export function getMessageOfTheDay() {
    const types = ["quote", "tip"];
    const selectedType = randomElement(types);
    const quoteToday = getQuoteOfTheDay();
    const tipToday = getTipOfTheDay();
    switch (selectedType) {
        case "quote":
            return {
                type: "quote",
                ...quoteToday,
            };
        case "tip":
            return {
                type: "tip",
                ...tipToday,
            };
        default:
            throw new Error(`Something went wrong. Type ${selectedType} is unknown.`);
    }
}

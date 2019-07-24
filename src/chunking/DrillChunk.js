import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Pager from './Pager'
import { capitalize } from "../toolbox/Fn";

class BookParser {

    constructor(book) {
        this.book = book
        const startBook = this.book.text.indexOf('CHAPTER I')
        const endBook = this.book.text.indexOf('CONCLUSION')
        this.subtext = this.book.text.substring(startBook, endBook) // TODO immutable
        this.i = 0;
    }

    nextWord() {
        const j = this.subtext.indexOf(' ', this.i)
        const word = this.subtext.substring(this.i, j);
        this.i = j + 1;
        return word
    }
}

class DrillChunk extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wpm: this.props.wpm, // WPM to start with

            // The content to read
            pages: this.dummyPages(),

            // Extract chunks from raw text
            parser: undefined,

            // The chunks to display on screen
            previousChunk: undefined,
            currentChunk: undefined,
            nextsChunk: undefined,
        };

        this.increaseWpm = this.increaseWpm.bind(this);
        this.reduceWpm = this.reduceWpm.bind(this);
        this.initReader = this.initReader.bind(this);
        this.advanceChunk = this.advanceChunk.bind(this);
    }

    cssPaperSize() {
        return 'Paper' + capitalize(this.props.paperSize)
    }

    render() {
        const styles = {
            "display": "grid",
            "height": "100vh",
            "placeItems": "center center",
        }
        let i = 0;
        return (
            <div className="FullScreen ChunkingDrill" style={styles}>

                <section className="DrillControls">
                    <ul>
                        {this.props.speedControls && <li><button onClick={this.increaseWpm}><i className="material-icons">chevron_left</i></button></li>}
                        {this.props.speedControls && <li><button onClick={this.reduceWpm}><i className="material-icons">chevron_right</i></button></li>}
                        <li><Link to="/chunking/" className="ButtonClose"><i className="material-icons">close</i></Link></li>
                    </ul>
                </section>

                <Pager content={this.state.content} onDone={this.onPagerDone}
                       fontFamily={this.props.fontFamily}
                       fontSize={this.props.fontSize}
                       fontStyle={this.props.fontStyle}
                       backgroundColor={this.props.backgroundColor}
                       color={this.props.color}
                />

                {this.state.readingMode === 'chunk' && this.state.currentChunk &&
                    <section className="DrillArea">
                        {this.state.previousChunk}
                        {this.state.currentChunk}
                        {this.state.nextChunk}
                    </section>}

                {this.props.readingMode === 'paper' &&

                    <div className={"Paper " + this.cssPaperSize()}>
                        <div className="PaperContent">
                            {this.state.content.text.map((block, index) => React.createElement(
                                block.tag,
                                {key: index},
                                block.content.split(' ').map((word, iWord) => {
                                    return <span key={iWord}><span className="Word" id={'w' + i++}  dangerouslySetInnerHTML={{__html: word}}></span> </span>
                                })
                            ))}
                        </div>
                    </div>
                }
            </div>
        );
    }

    increaseWpm() {
        this.setState(state => ({
            ...state,
            wpm: state.wpm + 20,
        }));
    }

    reduceWpm() {
        this.setState(state => ({
            ...state,
            wpm: state.wpm - 20,
        }));
    }

    componentDidMount() {
        // TODO NEXT
        // Measure the .PaperContent height on screen
        // Iterate over elements w+${index}:
        // - Find the first element to be off screen => determine the page limit and the start of the next page.
        // - split the entry in 2 and add the attribute `continuation`
        // Iterate over elements again:
        // - When `elt.offsetTop` changes => new line, chunks = []
        // - If `elt.offsetLeft` - `currentChunk.offsetLeftStart` < chunkWidth * tolerance => currentChunk.text += ' ' + elt.innerHTML
        // - Else chunks.push(currentChunk.text); currentChunk = undefined

        // TODO check `elt.getClientRects[0].width`

        /*
        fetch('/books/gutenberg-74-0.txt')
            .then(response => response.text())
            .then(data => this.setState(state =>  ({
                ...state,
                content: {
                    "type": "book",
                    "author": "Mark Twain",
                    "bookTitle": "The Adventures of Tom Sawyer",
                    "text": data,
                }
            }))).then(this.initReader);
        */
    }

    advanceChunk() {
        if (!this.state.parser) return
        const word = this.state.parser.nextWord()
        this.setState(state => ({
            ...state,
            currentChunk: word,
        }));
    }

    initReader() {

        let parser = undefined;

        if (this.state.content.type === 'book') {
            parser = new BookParser(this.state.content);
            this.setState(state =>  ({
                ...state,
                parser: parser,
            }));
        }

        const delay = 1000;
        let start = new Date().getTime()
        let handle = undefined;
        let loop = () => {
            handle = window.requestAnimationFrame(loop);
            const current = new Date().getTime()
            const delta = current - start
            if (delta >= delay) {
              this.advanceChunk();
              start = new Date().getTime();
            }
        }
        handle = window.requestAnimationFrame(loop);

        this.setState(state =>  ({
            ...state,
            handle: handle,
        }));
    }

    componentWillUnmount() {
        // Housekeeping
        clearInterval(this.state.handle);
    }

    generatePages() {
        return [
            {
                "number": 1,
                "lines": [
                    { tag: "h2", content: "Chapter 3",
                                 chunks: ["Chapter 3"] },
                    { tag: "p", content: "TOM presented himself before Aunt Polly, who was sitting by an open window in a pleasant rearward apartment, which was bedroom, breakfast-room, dining-room, and library, combined. The balmy summer air, the restful quiet, the odor of the flowers, and the drowsing murmur of the bees had had their effect, and she was nodding over her knitting--for she had no company but the cat, and it was asleep in her lap. Her spectacles were propped up on her gray head for safety. She had thought that of course Tom had deserted long ago, and she wondered at seeing him place himself in her power again in this intrepid way. He said: “Mayn't I go and play now, aunt?”",
                                chunks: ["TOM presented", "himself before", "Aunt Polly,"] },
                    { tag: "p", content: "“What, a'ready? How much have you done?”" },
                    { tag: "p", content: "“It's all done, aunt.”" },
                    { tag: "p", content: "“Tom, don't lie to me--I can't bear it.”" },
                    { tag: "p", content: "“I ain't, aunt; it <i>is</i> all done.”" },
                    { tag: "p", content: "Aunt Polly placed small trust in such evidence. She went out to see for herself; and she would have been content to find twenty per cent. of Tom's statement true. When she found the entire fence white-washed, and not only whitewashed but elaborately coated and recoated, and even a streak added to the ground, her astonishment was almost unspeakable. She said:" },
                ]
            },
            {
                "number": 2,
                "lines": [
                    { tag: "p", content: "“Well, I never! There's no getting round it, you can work when you're a mind to, Tom.” And then she diluted the compliment by adding, “But it's powerful seldom you're a mind to, I'm bound to say. Well, go 'long and play; but mind you get back some time in a week, or I'll tan you.”" },
                    { tag: "p", content: "She was so overcome by the splendor of his achievement that she took him into the closet and selected a choice apple and delivered it to him, along with an improving lecture upon the added value and flavor a treat took to itself when it came without sin through virtuous effort. And while she closed with a happy Scriptural flourish, he “hooked” a doughnut." },
                    { tag: "p", content: "Then he skipped out, and saw Sid just starting up the outside stairway that led to the back rooms on the second floor. Clods were handy and the air was full of them in a twinkling. They raged around Sid like a hail-storm; and before Aunt Polly could collect her surprised faculties and sally to the rescue, six or seven clods had taken personal effect, and Tom was over the fence and gone. There was a gate, but as a general thing he was too crowded for time to make" },
                ]
            },
            {
                "number": 3,
                "lines": [
                    { tag: "p", continuation: true, content: "use of it. His soul was at peace, now that he had settled with Sid for calling attention to his black thread and getting him into trouble."},
                    { tag: "p", content: "Tom skirted the block, and came round into a muddy alley that led by the back of his aunt's cow-stable. He presently got safely beyond the reach of capture and punishment, and hastened toward the public square of the village, where two “military” companies of boys had met for conflict, according to previous appointment. Tom was General of one of these armies, Joe Harper (a bosom friend) General of the other. These two great commanders did not condescend to fight in person--that being better suited to the still smaller fry--but sat together on an eminence and conducted the field operations by orders delivered through aides-de-camp. Tom's army won a great victory, after a long and hard-fought battle. Then the dead were counted, prisoners exchanged, the terms of the next disagreement agreed upon, and the day for the necessary battle appointed; after which the armies fell into line and marched away, and Tom turned homeward alone." },
                    { tag: "p", content: "As he was passing by the house where Jeff Thatcher lived, he saw a new girl in the garden--a lovely little blue-eyed creature with yellow hair plaited into two long-tails, white summer frock and embroidered pan-talettes. The fresh-crowned hero fell without firing a shot. A certain Amy Lawrence vanished out of his heart and left not even a memory of herself behind. He had thought he loved her to distraction; he had regarded his passion as adoration; and behold it was only a poor little evanescent partiality. He had been months winning her; she had confessed hardly a week ago; he had been the happiest and the proudest boy in the world only seven short days, and here in one instant of time she had gone out of his heart like a casual stranger whose visit is done." },
                    { tag: "p", content: "He worshipped this new angel with furtive eye, till he saw that she had discovered him; then he pretended he did not know she was present, and began to “show off” in all sorts of absurd boyish ways, in order to win her admiration. He kept up this grotesque foolishness for some time; but by-and-by, while he was in the midst of some dangerous gymnastic performances, he glanced aside and saw that the little girl was wending her way toward the house. Tom came up to the fence and leaned on it, grieving, and hoping she would tarry yet awhile longer. She halted a moment on the steps and then moved toward the door. Tom heaved a great sigh as she put her foot on the threshold. But his face lit up, right away, for she tossed a pansy over the fence a moment before she disappeared." },
                    { tag: "p", content: "The boy ran around and stopped within a foot or two of the flower, and then shaded his eyes with his hand and began to look down street as if he had discovered something of interest going on in that direction. Presently he picked up a straw and began trying to balance it on his nose, with his head tilted far back; and as he moved from side to side, in his efforts, he edged nearer and nearer toward the pansy; finally his bare foot rested upon it, his pliant toes closed upon it, and he hopped away with the treasure and disappeared round the corner. But only for a minute--only while he could button the flower inside his jacket, next his heart--or next his stomach, possibly, for he was not much posted in anatomy, and not hypercritical, anyway." },
                ]
            },
            // ...
        ]
    }

    generateChunks() {
        // We ignore the book layout (line height, margin, title size, letter cap, etc) when speed reading in chunk mode.
        const BREAK = "__BREAK__";
        return [
            "Chapter 3", BREAK,
            "TOM presented himself", "before Aunt Polly,", "who was sitting", "by an open window", "in a pleasant rearward apartment,", "which was bedroom,", "breakfast-room, dining-room,", "and library, combined.", "The balmy summer air,", "the restful quiet,", "the odor of the flowers,", "and the drowsing murmur", "of the bees had", "had their effect,", "and she was nodding over", "her knitting--for", "she had no company", "but the cat, and it was", "asleep in her lap.", "He said: “Mayn't I go", "and play now, aunt?”", BREAK,
            "“What, a'ready? How", "much have you done?”", BREAK,
            // ...
        ]
    }

    dummyContent() {
        return {
            title: "The Adventures of Tom Sawyer",
            author: "Mark Twain",
            subtitle: "Chapter 3",
            text: [
              { tag: "h2", content: "Chapter 3" },
              { tag: "p", content: "TOM presented himself before Aunt Polly, who was sitting by an open window in a pleasant rearward apartment, which was bedroom, breakfast-room, dining-room, and library, combined. The balmy summer air, the restful quiet, the odor of the flowers, and the drowsing murmur of the bees had had their effect, and she was nodding over her knitting--for she had no company but the cat, and it was asleep in her lap. Her spectacles were propped up on her gray head for safety. She had thought that of course Tom had deserted long ago, and she wondered at seeing him place himself in her power again in this intrepid way. He said: “Mayn't I go and play now, aunt?”" },
              { tag: "p", content: "“What, a'ready? How much have you done?”" },
              { tag: "p", content: "“It's all done, aunt.”" },
              { tag: "p", content: "“Tom, don't lie to me--I can't bear it.”" },
              { tag: "p", content: "“I ain't, aunt; it <i>is</i> all done.”" },
              { tag: "p", content: "Aunt Polly placed small trust in such evidence. She went out to see for herself; and she would have been content to find twenty per cent. of Tom's statement true. When she found the entire fence white-washed, and not only whitewashed but elaborately coated and recoated, and even a streak added to the ground, her astonishment was almost unspeakable. She said:" },
              { tag: "p", content: "“Well, I never! There's no getting round it, you can work when you're a mind to, Tom.” And then she diluted the compliment by adding, “But it's powerful seldom you're a mind to, I'm bound to say. Well, go 'long and play; but mind you get back some time in a week, or I'll tan you.”" },
              { tag: "p", content: "She was so overcome by the splendor of his achievement that she took him into the closet and selected a choice apple and delivered it to him, along with an improving lecture upon the added value and flavor a treat took to itself when it came without sin through virtuous effort. And while she closed with a happy Scriptural flourish, he “hooked” a doughnut." },
              { tag: "p", content: "Then he skipped out, and saw Sid just starting up the outside stairway that led to the back rooms on the second floor. Clods were handy and the air was full of them in a twinkling. They raged around Sid like a hail-storm; and before Aunt Polly could collect her surprised faculties and sally to the rescue, six or seven clods had taken personal effect, and Tom was over the fence and gone. There was a gate, but as a general thing he was too crowded for time to make use of it. His soul was at peace, now that he had settled with Sid for calling attention to his black thread and getting him into trouble." },
              { tag: "p", content: "Tom skirted the block, and came round into a muddy alley that led by the back of his aunt's cow-stable. He presently got safely beyond the reach of capture and punishment, and hastened toward the public square of the village, where two “military” companies of boys had met for conflict, according to previous appointment. Tom was General of one of these armies, Joe Harper (a bosom friend) General of the other. These two great commanders did not condescend to fight in person--that being better suited to the still smaller fry--but sat together on an eminence and conducted the field operations by orders delivered through aides-de-camp. Tom's army won a great victory, after a long and hard-fought battle. Then the dead were counted, prisoners exchanged, the terms of the next disagreement agreed upon, and the day for the necessary battle appointed; after which the armies fell into line and marched away, and Tom turned homeward alone." },
              { tag: "p", content: "As he was passing by the house where Jeff Thatcher lived, he saw a new girl in the garden--a lovely little blue-eyed creature with yellow hair plaited into two long-tails, white summer frock and embroidered pan-talettes. The fresh-crowned hero fell without firing a shot. A certain Amy Lawrence vanished out of his heart and left not even a memory of herself behind. He had thought he loved her to distraction; he had regarded his passion as adoration; and behold it was only a poor little evanescent partiality. He had been months winning her; she had confessed hardly a week ago; he had been the happiest and the proudest boy in the world only seven short days, and here in one instant of time she had gone out of his heart like a casual stranger whose visit is done." },
              { tag: "p", content: "He worshipped this new angel with furtive eye, till he saw that she had discovered him; then he pretended he did not know she was present, and began to “show off” in all sorts of absurd boyish ways, in order to win her admiration. He kept up this grotesque foolishness for some time; but by-and-by, while he was in the midst of some dangerous gymnastic performances, he glanced aside and saw that the little girl was wending her way toward the house. Tom came up to the fence and leaned on it, grieving, and hoping she would tarry yet awhile longer. She halted a moment on the steps and then moved toward the door. Tom heaved a great sigh as she put her foot on the threshold. But his face lit up, right away, for she tossed a pansy over the fence a moment before she disappeared." },
              { tag: "p", content: "The boy ran around and stopped within a foot or two of the flower, and then shaded his eyes with his hand and began to look down street as if he had discovered something of interest going on in that direction. Presently he picked up a straw and began trying to balance it on his nose, with his head tilted far back; and as he moved from side to side, in his efforts, he edged nearer and nearer toward the pansy; finally his bare foot rested upon it, his pliant toes closed upon it, and he hopped away with the treasure and disappeared round the corner. But only for a minute--only while he could button the flower inside his jacket, next his heart--or next his stomach, possibly, for he was not much posted in anatomy, and not hypercritical, anyway." },
              { tag: "p", content: "He returned, now, and hung about the fence till nightfall, “showing off,” as before; but the girl never exhibited herself again, though Tom comforted himself a little with the hope that she had been near some window, meantime, and been aware of his attentions. Finally he strode home reluctantly, with his poor head full of visions." },
              { tag: "p", content: "All through supper his spirits were so high that his aunt wondered “what had got into the child.” He took a good scolding about clodding Sid, and did not seem to mind it in the least. He tried to steal sugar under his aunt's very nose, and got his knuckles rapped for it. He said:" },
              { tag: "p", content: "“Aunt, you don't whack Sid when he takes it.”" },
              { tag: "p", content: "“Well, Sid don't torment a body the way you do. You'd be always into that sugar if I warn't watching you.”" },
              { tag: "p", content: "Presently she stepped into the kitchen, and Sid, happy in his immunity, reached for the sugar-bowl--a sort of glorying over Tom which was wellnigh unbearable. But Sid's fingers slipped and the bowl dropped and broke. Tom was in ecstasies. In such ecstasies that he even controlled his tongue and was silent. He said to himself that he would not speak a word, even when his aunt came in, but would sit perfectly still till she asked who did the mischief; and then he would tell, and there would be nothing so good in the world as to see that pet model “catch it.” He was so brimful of exultation that he could hardly hold himself when the old lady came back and stood above the wreck discharging lightnings of wrath from over her spectacles. He said to himself, “Now it's coming!” And the next instant he was sprawling on the floor! The potent palm was uplifted to strike again when Tom cried out:" },
              { tag: "p", content: "“Hold on, now, what 'er you belting _me_ for?--Sid broke it!”" },
              { tag: "p", content: "Aunt Polly paused, perplexed, and Tom looked for healing pity. But when she got her tongue again, she only said:" },
              { tag: "p", content: "“Umf! Well, you didn't get a lick amiss, I reckon. You been into some other audacious mischief when I wasn't around, like enough.”" },
              { tag: "p", content: "Then her conscience reproached her, and she yearned to say something kind and loving; but she judged that this would be construed into a confession that she had been in the wrong, and discipline forbade that. So she kept silence, and went about her affairs with a troubled heart. Tom sulked in a corner and exalted his woes. He knew that in her heart his aunt was on her knees to him, and he was morosely gratified by the consciousness of it. He would hang out no signals, he would take notice of none. He knew that a yearning glance fell upon him, now and then, through a film of tears, but he refused recognition of it. He pictured himself lying sick unto death and his aunt bending over him beseeching one little forgiving word, but he would turn his face to the wall, and die with that word unsaid. Ah, how would she feel then? And he pictured himself brought home from the river, dead, with his curls all wet, and his sore heart at rest. How she would throw herself upon him, and how her tears would fall like rain, and her lips pray God to give her back her boy and she would never, never abuse him any more! But he would lie there cold and white and make no sign--a poor little sufferer, whose griefs were at an end. He so worked upon his feelings with the pathos of these dreams, that he had to keep swallowing, he was so like to choke; and his eyes swam in a blur of water, which overflowed when he winked, and ran down and trickled from the end of his nose. And such a luxury to him was this petting of his sorrows, that he could not bear to have any worldly cheeriness or any grating delight intrude upon it; it was too sacred for such contact; and so, presently, when his cousin Mary danced in, all alive with the joy of seeing home again after an age-long visit of one week to the country, he got up and moved in clouds and darkness out at one door as she brought song and sunshine in at the other." },
            ]
        }
    }

    dummyPages() {
        return [
            {
                "number": 1,
                "lines": [
                    { tag: "h2", content: "Chapter 3",
                                chunks: ["Chapter 3"] },
                    { tag: "p", content: "TOM presented himself before Aunt Polly, who was sitting by an open window in a pleasant rearward apartment, which was bedroom, breakfast-room, dining-room, and library, combined. The balmy summer air, the restful quiet, the odor of the flowers, and the drowsing murmur of the bees had had their effect, and she was nodding over her knitting--for she had no company but the cat, and it was asleep in her lap. Her spectacles were propped up on her gray head for safety. She had thought that of course Tom had deserted long ago, and she wondered at seeing him place himself in her power again in this intrepid way. He said: “Mayn't I go and play now, aunt?”",
                                chunks: ["TOM presented", "himself before", "Aunt Polly,"] },
                    { tag: "p", content: "“What, a'ready? How much have you done?”" },
                    { tag: "p", content: "“It's all done, aunt.”" },
                    { tag: "p", content: "“Tom, don't lie to me--I can't bear it.”" },
                    { tag: "p", content: "“I ain't, aunt; it <i>is</i> all done.”" },
                    { tag: "p", content: "Aunt Polly placed small trust in such evidence. She went out to see for herself; and she would have been content to find twenty per cent. of Tom's statement true. When she found the entire fence white-washed, and not only whitewashed but elaborately coated and recoated, and even a streak added to the ground, her astonishment was almost unspeakable. She said:" },
                ]
            },
            {
                "number": 2,
                "lines": [
                    { tag: "p", content: "“Well, I never! There's no getting round it, you can work when you're a mind to, Tom.” And then she diluted the compliment by adding, “But it's powerful seldom you're a mind to, I'm bound to say. Well, go 'long and play; but mind you get back some time in a week, or I'll tan you.”" },
                    { tag: "p", content: "She was so overcome by the splendor of his achievement that she took him into the closet and selected a choice apple and delivered it to him, along with an improving lecture upon the added value and flavor a treat took to itself when it came without sin through virtuous effort. And while she closed with a happy Scriptural flourish, he “hooked” a doughnut." },
                    { tag: "p", content: "Then he skipped out, and saw Sid just starting up the outside stairway that led to the back rooms on the second floor. Clods were handy and the air was full of them in a twinkling. They raged around Sid like a hail-storm; and before Aunt Polly could collect her surprised faculties and sally to the rescue, six or seven clods had taken personal effect, and Tom was over the fence and gone. There was a gate, but as a general thing he was too crowded for time to make" },
                ]
            },
            {
                "number": 3,
                "lines": [
                    { tag: "p", continuation: true, content: "use of it. His soul was at peace, now that he had settled with Sid for calling attention to his black thread and getting him into trouble."},
                    { tag: "p", content: "Tom skirted the block, and came round into a muddy alley that led by the back of his aunt's cow-stable. He presently got safely beyond the reach of capture and punishment, and hastened toward the public square of the village, where two “military” companies of boys had met for conflict, according to previous appointment. Tom was General of one of these armies, Joe Harper (a bosom friend) General of the other. These two great commanders did not condescend to fight in person--that being better suited to the still smaller fry--but sat together on an eminence and conducted the field operations by orders delivered through aides-de-camp. Tom's army won a great victory, after a long and hard-fought battle. Then the dead were counted, prisoners exchanged, the terms of the next disagreement agreed upon, and the day for the necessary battle appointed; after which the armies fell into line and marched away, and Tom turned homeward alone." },
                    { tag: "p", content: "As he was passing by the house where Jeff Thatcher lived, he saw a new girl in the garden--a lovely little blue-eyed creature with yellow hair plaited into two long-tails, white summer frock and embroidered pan-talettes. The fresh-crowned hero fell without firing a shot. A certain Amy Lawrence vanished out of his heart and left not even a memory of herself behind. He had thought he loved her to distraction; he had regarded his passion as adoration; and behold it was only a poor little evanescent partiality. He had been months winning her; she had confessed hardly a week ago; he had been the happiest and the proudest boy in the world only seven short days, and here in one instant of time she had gone out of his heart like a casual stranger whose visit is done." },
                    { tag: "p", content: "He worshipped this new angel with furtive eye, till he saw that she had discovered him; then he pretended he did not know she was present, and began to “show off” in all sorts of absurd boyish ways, in order to win her admiration. He kept up this grotesque foolishness for some time; but by-and-by, while he was in the midst of some dangerous gymnastic performances, he glanced aside and saw that the little girl was wending her way toward the house. Tom came up to the fence and leaned on it, grieving, and hoping she would tarry yet awhile longer. She halted a moment on the steps and then moved toward the door. Tom heaved a great sigh as she put her foot on the threshold. But his face lit up, right away, for she tossed a pansy over the fence a moment before she disappeared." },
                    { tag: "p", content: "The boy ran around and stopped within a foot or two of the flower, and then shaded his eyes with his hand and began to look down street as if he had discovered something of interest going on in that direction. Presently he picked up a straw and began trying to balance it on his nose, with his head tilted far back; and as he moved from side to side, in his efforts, he edged nearer and nearer toward the pansy; finally his bare foot rested upon it, his pliant toes closed upon it, and he hopped away with the treasure and disappeared round the corner. But only for a minute--only while he could button the flower inside his jacket, next his heart--or next his stomach, possibly, for he was not much posted in anatomy, and not hypercritical, anyway." },
                ]
            },
            // ...
        ]
    }

}

DrillChunk.propTypes = {
    // WPM
    wpm: PropTypes.number,
    // Displays controls to vary the span between columns
    speedControls: PropTypes.bool,
    // Adjust level according the number of errors
    autoLevel: PropTypes.bool,

    // See DESIGN.md
    readingMode: PropTypes.string,
    paperSize: PropTypes.string,
}

DrillChunk.defaultProps = {
    wpm: 100,
    speedControls: true,
    autoLevel: true,

    // See DESIGN.md
    readingMode: 'paper',
    paperSize: 'A5',
};

export default DrillChunk;

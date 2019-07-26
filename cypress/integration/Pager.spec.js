import Pager from '../../src/chunking/Pager.js'
import Paper from '../../src/toolbox/Paper.js'
import React from 'react'

import '../../src/App.css';


const tomSawyerExtract = {
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
    ]
};


describe('Pager component', () => {
    it('works', () => {
        cy.viewport(1024, 798);
        // <Pager content={tomSawyerExtract} />
        const done = cy.spy().as('done')
        cy.mount(<Pager content={tomSawyerExtract} onDone={done} debug={true} />)
        cy.get('@done').should('have.been.calledOnce')
        // cy.get('@done').should('be.calledWith', 'Hi Test Aficionado')

    });
})
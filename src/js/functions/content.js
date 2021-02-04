
const STARTING_POSITION = {
    section: 0,
    block: 0,
}

export class Content {

    constructor(content) {
        this.content = content;
        this.position = {
            section: 0,
            block: 0,
        };
    }

    seekPosition(position) {
        this.position = position;
    }

    currentSection() {
        const currentSection = this.content.content[this.position.section];
    }
}


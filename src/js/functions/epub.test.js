import { EpubParser } from './epub';
import fs from 'fs';

describe('EpubParser', () => {

    test('12factor.epub', async () => {
        const data = await fs.readFileSync('fixtures/12factor.epub');
        const epub = await new EpubParser({
            skipImages: true,
        }).parse(Buffer.from(data));
        console.log(epub);
    });

    test('epub30-spec.epub', async () => {
        const data = await fs.readFileSync('fixtures/epub30-spec.epub');
        const epub = await new EpubParser({
            skipImages: true,
        }).parse(Buffer.from(data));
        console.log(epub);
    });

});



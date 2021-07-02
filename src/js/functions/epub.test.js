import { EpubParser, HTMLParser } from './epub';
import fs from 'fs';

describe('HTMLParser', () => {

    test('basic', () => {
        const html = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8"/>
        <title>Basic document</title>
        <link rel="stylesheet" type="text/css" href="../css/epub-spec.css"/>
    </head>
    <body>
        <img src="../img/earth.jpg" alt="The Earth"/>
        <h1>Basic</h1>
        <p>This first chapter uses the minimal HTML structure.</p>
        <p>This is the second paragraph.</p>
        <p>And this is the last one of this section.</p>
    </body>
</html>`;

        const parser = new HTMLParser();
        const tags = parser.parseText(html);
        console.log(formatHTML(tags));
    });
});

describe.skip('EpubParser', () => {

    test.skip('12factor.epub', async () => {
        const data = await fs.readFileSync('fixtures/12factor.epub');
        const epub = await new EpubParser({
            skipImages: true,
        }).parse(Buffer.from(data));
        console.log(JSON.stringify(epub, null, 2));
    });

    test.skip('epub30-spec.epub', async () => {
        const data = await fs.readFileSync('fixtures/epub30-spec.epub');
        const epub = await new EpubParser({
            skipImages: true,
        }).parse(Buffer.from(data));
        console.log(JSON.stringify(epub, null, 2));
    });

    test('demo.epub', async () => {
        const data = await fs.readFileSync('fixtures/demo.epub');
        const epub = await new EpubParser({
            skipImages: true,
        }).parse(Buffer.from(data));
        console.log(JSON.stringify(epub, null, 2));
    });
});

/* Test Helpers */

function formatHTML(nodes) {
    let div = document.createElement("div");
    nodes.forEach(node => {
        div.appendChild(node);
    });

    // Basic code to beautify HTML
    // https://stackoverflow.com/questions/3913355/how-to-format-tidy-beautify-in-javascript
    const tab = '\t';
    let result = '';
    let indent= '';

    div.innerHTML.split(/>\s*</).forEach(element => {
        if (element.match( /^\/\w/ )) {
            indent = indent.substring(tab.length);
        }

        result += indent + '<' + element + '>\r\n';

        if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("input")) {
            indent += tab;
        }
    });

    return result.substring(1, result.length-3);
}

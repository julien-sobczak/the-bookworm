import { extractChapters, parseToc, parseFile } from './EpubReader';

test('parseToc extracts chapters from the TOC file', () => {
    const content = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en">
    <head>
    <meta name="dtb:uid" content="p9781473554719" />
    <meta name="dtb:depth" content="1" />
    <meta name="dtb:totalPageCount" content="368" />
    <meta name="dtb:maxPageNumber" content="368" />
    </head>
    <docTitle>
    <text>My New Book</text>
    </docTitle>
    <docAuthor>
    <text>Julien Sobczak</text>
    </docAuthor>
    <navMap>
        <navPoint id="navpoint-1" playOrder="1">
            <navLabel>
                <text>Contents</text>
            </navLabel>
            <content src="pages/contents.xhtml" />
        </navPoint>
        <navPoint id="navpoint-2" playOrder="2">
            <navLabel>
                <text>About the Author</text>
            </navLabel>
            <content src="pages/about_author.xhtml" />
        </navPoint>
        <navPoint id="navpoint-3" playOrder="3">
            <navLabel>
                <text>Introduction</text>
            </navLabel>
            <content src="pages/introduction.xhtml" />
        </navPoint>
        <navPoint id="navpoint-4" playOrder="4">
            <navLabel>
                <text>Part I</text>
            </navLabel>
            <content src="pages/part01.xhtml" />
            <navPoint id="navpoint-5" playOrder="5">
                <navLabel>
                    <text>The Beginning</text>
                </navLabel>
                <content src="pages/chapter01.xhtml" />
            </navPoint>
            <navPoint id="navpoint-6" playOrder="6">
                <navLabel>
                    <text>The Following</text>
                </navLabel>
                <content src="pages/chapter02.xhtml" />
            </navPoint>
            <navPoint id="navpoint-7" playOrder="7">
                <navLabel>
                    <text>The End</text>
                </navLabel>
                <content src="pages/chapter03.xhtml" />
            </navPoint>
        </navPoint>
        <navPoint id="navpoint-8" playOrder="8">
            <navLabel>
                <text>Index</text>
            </navLabel>
            <content src="pages/index.xhtml" />
        </navPoint>
    </navMap>
</ncx>
`
    const toc = parseToc(content)
    const expected = [
        {"filename": "pages/contents.xhtml", "title": "Contents"},
        {"filename": "pages/about_author.xhtml", "title": "About the Author"},
        {"filename": "pages/introduction.xhtml", "title": "Introduction"},
        {"filename": "pages/part01.xhtml", "title": "Part I"},
        {"filename": "pages/chapter01.xhtml", "title": "The Beginning"},
        {"filename": "pages/chapter02.xhtml", "title": "The Following"},
        {"filename": "pages/chapter03.xhtml", "title": "The End"},
        {"filename": "pages/index.xhtml", "title": "Index"},
    ];
    expect(toc).toEqual(expected);
});

test('parseFile extracts the text from HTML content', () => {
    const content = `<?xml version='1.0' encoding='utf-8'?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>A Brief Book</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <link href="stylesheet.css" rel="stylesheet" type="text/css"/>
        <link href="page_styles.css" rel="stylesheet" type="text/css"/>
    </head>
    <body class="calibre">
        <p class="calibre_2"><span class="calibre1"></span></p>
        <p id="filepos160606" class="calibre_3"><a href="index_split_002.html#filepos1051"><span class="calibre1">2</span></a></p>
        <p class="calibre_4"><a href="index_split_002.html#filepos1051"><span class="calibre1">The Chapter Title</span></a></p>
        <p class="calibre_15">A basic sentence without any HTML tags.</p>
        <p class="calibre_16">Another sentence ending with a footnote.<sup class="calibre3"><small id="ref1" class="calibre4"><a href="#ref1"><span class="calibre5">1</span></a></small></sup></p>
    </body>
</html>
`;
    const text = parseFile(content);
    const expected = [
        { tag: 'p', content: "2" },
        { tag: 'p', content: "The Chapter Title" },
        { tag: 'p', content: "A basic sentence without any HTML tags." },
        { tag: 'p', content: "Another sentence ending with a footnote." },
    ];
    expect(text).toEqual(expected);
});

test('extractChapters determines the list of chapters based on the TOC', () => {
    const files = [
        {
            filename: "toc.ncx",
            content: `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en">
    <docTitle>
        <text>My New Book</text>
    </docTitle>
    <docAuthor>
        <text>Julien Sobczak</text>
    </docAuthor>
    <navMap>
        <navPoint id="navpoint-1" playOrder="1">
            <navLabel>
                <text>Cover</text>
            </navLabel>
            <content src="pages/cover.xhtml" />
        </navPoint>
        <navPoint id="navpoint-2" playOrder="2">
            <navLabel>
                <text>The Beginning</text>
            </navLabel>
            <content src="pages/chapter01.xhtml" />
        </navPoint>
        <navPoint id="navpoint-3" playOrder="3">
            <navLabel>
                <text>The End</text>
            </navLabel>
            <content src="pages/chapter02.xhtml" />
        </navPoint>
    </navMap>
</ncx>
`,
        },
        {
            filename: "pages/cover.xhtml",
            content: `<?xml version='1.0' encoding='utf-8'?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <body class="calibre">
        <p class="calibre_2"><span class="calibre1"></span></p>
        <img src="files/cover.png" />
    </body>
</html>
`,
        },
        {
            filename: "pages/chapter01.xhtml",
            content: `<?xml version='1.0' encoding='utf-8'?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <body class="calibre">
        <p class="calibre_2"><span class="calibre1"></span></p>
        <p id="filepos160606" class="calibre_3"><a href="index_split_002.html#filepos1051"><span class="calibre1">2</span></a></p>
        <p class="calibre_4"><a href="index_split_002.html#filepos1051"><span class="calibre1">The Beginning</span></a></p>
        <p class="calibre_15">A basic sentence without any HTML tags.</p>
    </body>
</html>
`,
        },
        {
            filename: "pages/chapter02.xhtml",
            content: `<?xml version='1.0' encoding='utf-8'?>
<html xmlns="http://www.w3.org/1999/xhtml">
    <body class="calibre">
        <p class="calibre_2"><span class="calibre1"></span></p>
        <p class="calibre_4"><a href="index_split_002.html#filepos1051"><span class="calibre1">The End</span></a></p>
        <p class="calibre_15">A sentence with HTML tags.<sup class="calibre3"><small id="ref1" class="calibre4"><a href="#ref1"><span class="calibre5">1</span></a></small></sup></p>
    </body>
</html>
`,
        },
    ];

    const chapters = extractChapters(files);
    const expected = [
        // Should filter the cover as there is no content
        {
            title: "The Beginning",
            blocks: [
                // Should remove the first empty paragraph
                { "tag": "p", content: "2" },
                { "tag": "p", content: "The Beginning" },
                { "tag": "p", content: "A basic sentence without any HTML tags." },
            ],
        },
        {
            title: "The End",
            blocks: [
                { "tag": "p", content: "The End" },
                { "tag": "p", content: "A sentence with HTML tags." },
            ],
        },
    ]

    expect(chapters).toEqual(expected);
});
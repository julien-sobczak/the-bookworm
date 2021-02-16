#!/bin/sh

# https://ebooks.stackexchange.com/questions/257/how-to-repack-an-epub-file-from-command-line
zip -o ../demo.epub -rX mimetype META-INF/ EPUB

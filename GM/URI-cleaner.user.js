// This is a GreaseMonkey user script file.
// It contains only the Metadata Block.
// All JavaScript code is in separate files, to make development more portable and easier.
//
// JS files included using require Key are downloaded only once while version Key here is the same.
// Grease Monkey (and alternatives) will download and cache all included files, joined all in one.
// There is no speed or bandwidth use difference to a method where all JS code is written in this one file.
// And the same is with transparency. Included external files can be inspected in GM (or Tamper Monkey) editor in separate tabs.

// ==UserScript==
// @name         Fix URI and links
// @namespace    https://github.com/paponius/URI-cleaner/
// @description  Removes clutter from links. Like tracking data. description: https://github.com/paponius/URI-cleaner/
// @author       papo
// @version      1.9.1
// @license      GPLv2
//// Sites
//// match can not be http?:// nor http*://
// @match        *://*.imdb.com/*
// @match        *://*.google.com/*
// @match        *://*.google.sk/*
// @match        *://*.twitter.com/*
//// run-at
/// all possible: document-start -> document-end (default) -> document-idle
/// tampermonkey has more, but if used in GreaseMonkey, script will silently fail. e.g. document-body
// @run-at       document-start
// @grant        none
// @require      https://raw.githubusercontent.com/paponius/URI-cleaner/main/src/NormalizeURIandLinks.js#sha256=11d0a39307e577ec8c8ae3f4106c9c2f92ded4eaf4e42528421adc3f6e1258c5
// @require      https://raw.githubusercontent.com/paponius/URI-cleaner/main/src/IMDb.js#md5=838d11defbafc70dd40abf57ca74532a
// @require      https://raw.githubusercontent.com/paponius/URI-cleaner/main/src/google.js#md5=954ef7edc218096a47409d8b369e6562
// @require      https://raw.githubusercontent.com/paponius/URI-cleaner/main/src/twitter.js#md5=8107cba4daf4c89745e55ec0221d5084
// @noframes
// ==/UserScript==

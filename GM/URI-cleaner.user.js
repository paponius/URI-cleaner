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
// @version      2.1
// @license      GPLv2
// @match        *://*.imdb.com/*
// @match        *://*.google.com/*
// @match        *://*.google.sk/*
// @match        *://*.twitter.com/*
// @run-at       document-start
// @grant        none
// @require      https://raw.githubusercontent.com/paponius/URI-cleaner/main/src/NormalizeURIandLinks.js
// @require      https://raw.githubusercontent.com/paponius/URI-cleaner/main/src/IMDb.js
// @require      https://raw.githubusercontent.com/paponius/URI-cleaner/main/src/google.js
// @require      https://raw.githubusercontent.com/paponius/URI-cleaner/main/src/twitter.js
// @noframes
// ==/UserScript==

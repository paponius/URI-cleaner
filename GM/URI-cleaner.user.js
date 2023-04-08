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
// @namespace    http://www.ponius.com/uricl/
// @description  Removes all tracking info and clutter from links. Keeps other parameters intact.
// @author       papo
// @version      1.7
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
// @require      http://www.ponius.com/uricl/src/NormalizeURIandLinks.js?v1.7
// @require      http://www.ponius.com/uricl/src/IMDb.js?v1.7
// @require      http://www.ponius.com/uricl/src/google.js?v1.7
// @require      http://www.ponius.com/uricl/src/twitter.js?v1.7
// ==/UserScript==

// ==UserScript==
// @name         IMDb - fix links
// @namespace    http://www.ponius.com/uricl/
// @description  Removes all tracking info from imdb links. Keeps other parameters intact.
// @author       papo
// @version      1.4
//// Sites
//// match can not be http?:// nor http*://
// @match        http://*.imdb.com/*
// @match        https://*.imdb.com/*
// Xinclude      https://*.imdb.com/*
// Xinclude      http*://*.imdb.com/*
//// run-at
//// all:    document-start -> document-end (default) -> document-idle
//// tampermonkey has more, but script will silently fail using e.g. document-body in GreaseMonkey
// @run-at       document-start
// @grant        none
// @require      http://www.ponius.com/uricl/src/NormalizeURI.js
// ==/UserScript==

// This is GreaseMonkey user script file.
// It contains only the header.
// Main code and other files are generic, not GM specific.
// They are included using @require directive.
//
// Included files are downloaded only once. Then again with new version.
// Grease Monkey (and alternatives) will cache included JS files joined all in one.
// During use, there is no difference if the whole JS code is in this cache file,
// or if parts are included using @require direction.
//
// Included external files can be inspected in GM (or Tamper Monkey) editor in separate tabs.


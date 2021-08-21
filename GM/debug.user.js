// Grease Monkey user script - Development version
// This file is used to allow debugging.
// It's only a header with last 'require' directive chaining the production version GM user script file.
// The production version user script file's header is then ignored by GreaseMonkey.
//
// This development version file loads local files (file://...), they can be edited without need to copy/paste to GM.
// There is no need to update ...?v=1.1 for these file://... pseudo links.
// To make it work, you need to allow local access for Tamper Monkey extension.
// Add to browser: file:///C:/Users/Papo/Documents/GitHub/xxxx/GM/


// ==UserScript==
// @name           DEBUG - IMDb - fix links
// Xnamespace      XXXXXX
// Xdescription    XXXXXX
// @author         papo
// Xversion        XXXXXX.XXXXXX.XXXXXX
// Xlicense        XXXXXX
// @match          *://*.imdb.com/*
// @run-at       document-body
//// Just grant everything in development version
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          GM.getResourceUrl
// @grant          GM.deleteValue
// @grant          GM.listValues
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest

//// Frameworks
// Xrequire        https://code.jquery.com/jquery-2.2.0.min.js
// Xrequire        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js

//// Project files
// @require        file://C:\Users\Papo\Documents\GitHub\URI-cleaner\src\NormalizeURI.js

//// Chain the production version GM user script
// @require        file://C:\Users\Papo\Documents\GitHub\URI-cleaner\GM\URI-cleaner.user.js

//// Resources. Name could be anything. To keep compatibility with WebExt, use relative path as a name for the resource as it appears in the project. e.g. res/sites.json
// Xresource       extension_pages/options.html file://C:\path\to\file

// Xconnect        *
// Xnoframes
// ==/UserScript==

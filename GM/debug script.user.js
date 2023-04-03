// Metadata Block allowing debug of Greasemonkey compatible scripts.
// There is no JS code here directly, local JS files are included using @require Key.
// Last 'require' will chain the production version GM user script file.
// In the chained file, Metadata Block is ignored by GM.
//
// This development version file loads local files (file://...), they can be edited without need to copy/paste to GM.
// There is no need to update ...?v=1.1 for these file://... pseudo links. "file:" files seems to not be cached in TamperMonkey.
//
//// Install in the browser
// To make it work, you need to allow local access for Tamper Monkey extension.
// Add this script file to browser's GM. Open: file:///C:/Users/Papo/Documents/GitHub/, click *.user.js file.
// Greasemonkey: Seems it can't access "file:" protocol files. There are guides how it is possible, but not since 2017, when extension changed to WebExtension.
//
//// Edit this script file
// Replace all XXXXXX with correct values. (must keep word "DEBUG" somewhere in name, it's presence is detected by a script)
// Optionally replace YYYYYY with values. Enable Keys by replacing YYY with @
// This file itself can be renamed, or not.

// 23-04 compared to version in GM---IMDb-Large-Images from 21-10. This is newer now.

// ==UserScript==
// @name           DEBUG - Fix URI and links
// YYYnamespace      YYYYYY
// YYYdescription    YYYYYY
// @author         papo
// YYYversion        YYYYYY.YYYYYY.YYYYYY
// YYYlicense        YYYYYY
// @match          *://*.imdb.com/*
// @match          *://*.google.*/*
// @match          *://*.twitter.com/*
// @run-at       document-body
//// Granting everything in this development version.
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          GM.getResourceUrl
// @grant          GM.deleteValue
// @grant          GM.listValues
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM.openInTab
// @grant          unsafeWindow
//// In TamperMonkey docs (maybe not supported by GreaseMonkey)
// @grant          window.close
// @grant          window.focus
// @grant          window.onurlchange
//
// GreaseMonkey v4 changed all GM_ objects to one GM object (followed by dot and a property)
// which returns a Promise
// Grant directive must correspond to that, but can also specify both old and new.
// TamperMonkey (v4.13) does not mention GM. or GM object in docs, but it does in "recent changes",
// probably there is support of these new promise oriented functions too.


//// Frameworks
// YYYrequire        https://code.jquery.com/jquery-2.2.0.min.js
// YYYrequire        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// YYYrequire        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js

//// Project files
// @require        file://C:\Users\Papo\Documents\GitHub\URI-cleaner\src\IMDb.js
// @require        file://C:\Users\Papo\Documents\GitHub\URI-cleaner\src\google.js
// @require        file://C:\Users\Papo\Documents\GitHub\URI-cleaner\src\twitter.js
// @require        file://C:\Users\Papo\Documents\GitHub\URI-cleaner\src\NormalizeURIandLinks.js

//// Chain the production version GM user script
// @require        file://C:\Users\Papo\Documents\GitHub\URI-cleaner\GM\URI-cleaner.user.js

//// Resources. Name could be anything. To keep compatibility with WebExt, use relative path as a name for the resource as it appears in the project. e.g. res/sites.json
// YYYresource       extension_pages/options.html file://C:\path\to\file

// YYYconnect        *
// YYYnoframes
// ==/UserScript==

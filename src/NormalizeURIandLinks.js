/* jshint esversion: 6 */

// DESCRIPTION of the project: readme.md

// This is a site-independent JS file.
// this file should be set to run before page loads, or soon as possible.
// It will listen for DOM changes and also fix links, which the page generates and injects later.
// Browser's omnibox (addressbar) is changed, but page is not reloaded.
// While working on links in the web page, this script will stop after MAX_OPERATIONG_TIME milliseconds
// and let other JS code in event loop to process.


// all possible filter functions. null is overloaded in site-specific JS file.
var filterURIArgument = null;
var sortURIArgument = null;
var normURIPath = null;
var normURIHostname = null;

// all possible action functions. called from site-specific js files.
var fixBrowserAddressBox;
var fixLinksOnPage;


(function() {
"use strict";

const MAX_OPERATIONG_TIME = 200;

var initialized = false;
var typeHOSTNAMES_INCLUDE;
var orderOfURIArgs = [];

var DEBUG = ( GM && GM.info.script.name.indexOf('DEBUG') !== -1 );

if (DEBUG) {
	if (document.readyState !== 'interactive' && document.readyState !== 'complete') {
		window.addEventListener('DOMContentLoaded', () => console.log('NormalizeURIandLinks.js: START (from DOMContentLoaded listener)'));
	} else { console.log('NormalizeURIandLinks.js: START, state: ', document.readyState, ' (started already after DOMContentLoaded)'); }
}


// from pparam.js, made more generic
// alt new method: URLSearchParams [https://stackoverflow.com/a/901144/3273963]
function parseURIQuery(uri) {
	var args = {};
	// iterates array of argument pairs (e.g. [arg=value, arg2=value2, ...] )
	uri.search.substr(1).split('&').forEach(item => {
		if (item === '') { return; } // empty query, or two sequential &&
		// var [valname, val] = decodeURIComponent(item).split('='); // see desc in objectToQuery()
		var [valname, val] = item.split('='); // Name-Value pair
		if (val === undefined) { val = true; // missing Value means true 
		} else if ((val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') ||
			       (val.charAt(0) === "'" && val.charAt(val.length - 1) === "'")) {
			val = val.slice(1, -1);
		}

		if (args[valname] !== undefined) {
			console.warn('NormalizeURIandLinks.js: Valuename '+valname+' is defined twice on URI. '+
						'First will be overwritten.');
		}
		// args[valname] = fixValueType(val); // function is in pparam.js, did not need it yet here
		args[valname] = val;
		orderOfURIArgs.push(valname);
	});
	return args;
}


/**
 * Translates an Object to URI query String. Sorting properties using order from orderOfURIArgs Array.
 * Use of encodeURI/decodeURI, or encodeURIComponent/decodeURIComponent:
 * I did try to decode escaped characters when converting to Object in parseURIQuery and then encoding back here,
 * but it was not possible to keep original URI as it was in all cases.
 * encodeURIComponent vs encodeURI, the former also replaces ; / ? : @ & = + $ , #
 * e.g. ':'
 * With *codeURI, ':' entered in Omnibox is passed to Google, which changes the ':' to %3A in the URI,
 *   This script will keep %3A in args Object, but then encode '%3A' to '%253A'
 *   Using *codeURIComponent works fine for ':'. Being changed from %3A to ':' in args Object and back to %3A in URI.
 * e.g. ' ' (Space)
 * When a text with spaces is entered in the Omnibox, Google will replace all spaces with '+' in the URI.
 *   Using *codeURIComponent will keep '+' in Object, but then encodes it to %2B back to URI.
 *   %2B is used in URI by Google when the user enter real '+' (and not a space). So the result is that after a
 *   new page load, Google shows results for text with '+' between words.
 * It's possible to handle Space to '+' cases individually, but the method is site specific
 *  and this JS file is generic.
 * Also, there might be other similar issue with a character being unencoded in URI and then mangled by this.
 * Best solution is to keep characters as they are. And do decoding in site specific functions if needed.
 * https://stackoverflow.com/a/22678417/3273963
 * @method objectToQuery
 * @param  {Object}      obj The Object to be translated.
 * @return {String}          The URI Query including leading '?', or an empty String.
 */
function objectToQuery(obj) {
	function compareFn(a, b) {
		return orderOfURIArgs.indexOf(a) - orderOfURIArgs.indexOf(b);
	}
	var str = Object.keys(obj).sort(compareFn).map(prop => {
		// return [prop, obj[prop]].map(encodeURIComponent).join("="); // with *codeURIComponent (see above desc)
		return [prop, obj[prop]].join("=");
	}).join("&");
	if (str !== '') { return '?' + str; }
	return '';
}


function normURIArguments(args, uri) {
	if (Object.keys(args).length === 0) { return false; }
	var changeDone = false;

	if (filterURIArgument !== null) {
		for (let arg in args) {
			let retFilter = filterURIArgument(arg, args[arg], args, uri);
			if (retFilter === undefined || retFilter === null) { // no change
			} else if (retFilter === false) {
				delete args[arg];
				changeDone = true;
			} else { // modification. else must be an Array of [valuename, value]
				if (arg !== retFilter[0]) { // valuename changed. remove old pair, add new pair.
					delete args[arg];
					args[retFilter[0]] = retFilter[1];
					changeDone = true;
				} else if (args[arg] !== retFilter[1]) { // value changed. replace the value.
					args[arg] = retFilter[1];
					changeDone = true;
				} else {
					console.log('NormalizeURIandLinks.js: normURIArguments(): While replacing an argument, new valuename and value are identical to old. There was no change');
				}
			}
		}
	}

	if (sortURIArgument !== null) {
		let retSort = sortURIArgument(orderOfURIArgs, args);
		if (retSort) {
			orderOfURIArgs = retSort;
			changeDone = true;
		}
	}
	return changeDone;
}


function init() {
	// typeof is slow, do it just once per pageload
	typeHOSTNAMES_INCLUDE = typeof HOSTNAMES_INCLUDE;
	initialized = true;
}

// fix text shown in browser's omnibox
fixBrowserAddressBox = function () {
	if (initialized !== true) { init(); }
	var args = parseURIQuery(window.location);
	if (normURIArguments(args, window.location)) { // true: a fix was made
		// 1st arg: state. Anything to be stored inside the history state.
		// 2nd arg: title. not supported by browsers now, might be later. Keep title unchanged: document.title
		// 3rd arg: whole or partial URI (path + query + hash)
		//   when arg starts with '#', only hash is replaced
		//   when arg starts with '?', query and hash is replaced
		//   when arg starts with 'a char' last part of path is replaced. query and hash is replaced or removed.
		//   when arg starts with '/', everything is replaced after the hostname
		//
		// To clear query. '' can't be used, must replace path with itself (location.pathname)
		history.replaceState(null, document.title, (objectToQuery(args) || location.pathname) + location.hash);
	}
	if (normURIPath !== null) {
		let retNormURIPath = normURIPath(window.location.pathname, window.location);
		if (retNormURIPath !== undefined && retNormURIPath !== null && // no change - explicit
			retNormURIPath !== window.location.pathname) {
			history.replaceState(null, document.title, retNormURIPath + location.search + location.hash);
			// do not: "window.location.pathname = ...", it will reload the opened document
		}
	}
};

function checkHostname(uri) {

	// if HOSTNAMES_INCLUDE is empty or not defined, fix is valid for all hostnames
	if ((typeHOSTNAMES_INCLUDE === 'object' && HOSTNAMES_INCLUDE.length === 0) ||
		typeHOSTNAMES_INCLUDE === 'undefined' || !HOSTNAMES_INCLUDE ) { return true; }

	return HOSTNAMES_INCLUDE.some((value) => {
		return uri.hostname.endsWith(value);
	});
}

function fixL(links, j=0) {
	var debug_cnt;
	if (DEBUG) { debug_cnt = 0; }
	var lnk,
		timeForPause = Date.now() + MAX_OPERATIONG_TIME;
	if (DEBUG) { console.log('NormalizeURIandLinks.js: fixL: START from', j); } /* jshint -W084 */
	for (; lnk=links[j]; j++) {
		if (lnk.isFixed || !lnk.href) { continue; }

		// pause and continue the next event cycle, give browser chance to do stuff 
		if (Date.now() > timeForPause) { /* jshint -W083 */
			setTimeout(() => fixL(links,j)); // alt: queueMicrotask()
			if (DEBUG) { console.log('NormalizeURIandLinks.js: fixL: PAUSED on', j); }
			return;
		}

		if (lnk.protocol && lnk.protocol.startsWith('http') && checkHostname(lnk)) {
			if (lnk.search) {
				let args = parseURIQuery(lnk);
				if (normURIArguments(args, lnk)) { // true: a fix was made
					lnk.search = objectToQuery(args);
					if (DEBUG) { debug_cnt++; }
				}
			}
			if (normURIPath !== null) {
				let retNormURIPath = normURIPath(lnk.pathname, lnk);
				if (retNormURIPath !== null && retNormURIPath !== undefined) {
					lnk.pathname = retNormURIPath;
				}
			}
			if (normURIHostname !== null) {
				let retNormURIHostname = normURIHostname(lnk.hostname, lnk);
				if (retNormURIHostname !== null && retNormURIHostname !== undefined) {
					lnk.hostname = retNormURIHostname;
				}
			}
		}
		if (lnk.pathname !== '/') { lnk.isFixed=1; }  // p: I forgot why did I do if '/'?
		// else { console.log('NormalizeURIandLinks.js: fixL: path is /',lnk); }
	}
	if (DEBUG) { console.log('NormalizeURIandLinks.js: fixL: FINISHES (all, fixed)', j, debug_cnt); }
}


// https://stackoverflow.com/a/11546242/3273963
function regMutationObserver() {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	new MutationObserver(mutations => {
		if (DEBUG) { console.count('NormalizeURIandLinks.js: regMutationObserver: fired'); }

		// m.target is parent, whose child/children were added
		for (let m of mutations) {
			if (m.addedNodes.length === 0) { continue; }

			// Tried three methods of getting "A" elements. mA, mB, mC
			// I used mB, mC together for a year and there were no differences. Did not test speed.
			// But mB and mC are wrong, as they check all elements under parent of the added Node.
			// that means also previously existing siblings of the added Node and all their children.
			// Will now test if mA is working OK, then will remove mB and mC from here.

			// maybe check if not m.target.tagName === "HEAD"
			let elements_mA = [];
			for (let node of m.addedNodes) {
				if (!(node instanceof HTMLElement)) { continue; } // could be #Text and error
				if (node instanceof HTMLStyleElement) { continue; } // Style does not have children
				// if (node.children && node.children.length === 0) { continue; } // no. also node can be <a>
				if (node.tagName === 'A') { elements_mA.push(node); }
				let tmp = node.getElementsByTagName('a');
				let tmp_arr = Array.prototype.slice.call(tmp); // convert to regular Array
				elements_mA = elements_mA.concat(tmp_arr); // merge two Arrays
			}

			if (DEBUG) { // test anyway for a while
				// :scope matches m.target element
				var elements_mC = m.target.querySelectorAll(':scope a');
				// cool, but getElementsByTagName can be used on element and is probably faster
				var elements_mB = m.target.getElementsByTagName('a');

				if (DEBUG && (elements_mA.length !== 0 || elements_mC.length !== 0 || elements_mB.length !== 0)) {
					console.log('NormalizeURIandLinks.js: regMutationObserver: new links:',elements_mA.length, elements_mB.length, elements_mC.length);
				}
			}

			if (elements_mA.length !== 0) { fixL(elements_mA); }
		}
	})
	.observe(document, {
		childList: true,
		subtree: true
	});
}

fixLinksOnPage = function () {
	if (document.readyState !== 'interactive' && document.readyState !== 'complete') {
		window.addEventListener('DOMContentLoaded', fixLinksOnPage);
		return;
	}

	if (DEBUG) { console.log('NormalizeURIandLinks.js: START fixLinksOnPage()'); }
	if (initialized !== true) { init(); }
	fixL(document.links);
	regMutationObserver();
};

})();


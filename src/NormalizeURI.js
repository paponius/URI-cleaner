/* jshint esversion: 6 */

// Removes tracking and other arguments useless for a user from URI.
// Browser will correctly show visited links and 'a star' for bookmarked pages.

// this file should be set to run before page loads, or soon as possible
// It fix URI in address box of the browser,
// all "links" present on a page at DOMContentLoaded,
// then will listen for DOM changes and fix any additional links.


(function() {
"use strict";

var DEBUG = ( GM && GM.info.script.name.indexOf('DEBUG') !== -1 );


if (DEBUG) { console.log('NormalizeURI.js: START, state:', document.readyState); }

// from pparam.js, made more generic
// alt new method: URLSearchParams [https://stackoverflow.com/a/901144/3273963]
function parseURIQuery(uri) {
	var args = {};
	// iterates array of argument pairs (e.g. [arg=value, arg2=value2, ...] )
	uri.search.substr(1).split('&').forEach(item => {
		if (item === '') { return; } // empty query, or two sequential &&
		var [valname, val] = decodeURI(item).split('='); // Name-Value pair
		if (val === undefined) { val = true; // missing Value means true 
		} else if ((val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') ||
			       (val.charAt(0) === "'" && val.charAt(val.length - 1) === "'")) {
			val = val.slice(1, -1);
		}

		if (args[valname] !== undefined) {
			console.warn('Valuename '+valname+' is defined twice on URI. '+
						'First will be overwritten.');
		}
		// args[valname] = fixValueType(val); // function is in pparam.js, did not need it yet here
		args[valname] = val;
	});
	return args;
}


// https://stackoverflow.com/a/22678417/3273963
// plus sort()
// todo: maybe sort is not always desired
// todo: maybe remove '?' from result to be more generic
function objectToQuery(obj) {
	var str = Object.keys(obj).map(prop => {
		return [prop, obj[prop]].map(encodeURIComponent).join("=");
	}).sort().join("&");
	if (str !== '') { return '?' + str; }
	return '';
}


function normalizeLnk(uri) {

	// --- trailing slash
	// was here location on purpose? So only normalize links in a page while on these two pages?
	// if (location.pathname.endsWith('/bio') || location.pathname.startsWith('/title/')) {

	// e.g.
	// https://www.imdb.com/name/nm0123456?ref_=tt_cl_t_6

	if ( uri.pathname.endsWith('/bio') ||
		 uri.pathname.startsWith('/title/') ||
		 uri.pathname.startsWith('/list/') ||
		 uri.pathname.startsWith('/name/')
	   ) {
    	if (uri.pathname.slice(-1) !== '/') { uri.pathname+='/'; }
    }
}


function imdbFix(args) {
	var changed = false;
	for (let arg in args) {
		if (arg === 'ref_') { delete args[arg]; changed = true; }

		// pf_rd, e.g. https://www.imdb.com/whats-on-tv/new-on-netflix-streaming/ls084463446/?pf_rd_m=...&pf_rd_p=...&pf_rd_r=...&pf_rd_s=...&pf_rd_t=...&pf_rd_i=...
		if (arg.startsWith('pf_rd_')) { delete args[arg]; changed = true; }
		// or really need regex for last char?
		// if (/^pf_rd_[a-z]$/.test(arg)) { ... }
	}
	return changed;
}

// fix text shown in browser's omnibox
function fixBrowserAddressBox() {
	var args = parseURIQuery(window.location);
	if (Object.keys(args).length !== 0) {
		if (imdbFix(args)) { // true: a fix was done
			// 2nd arg: title, not implemented now, might be later. Keep title unchanged: document.title
			// 3rd arg: relative/static path + query + hash
			// To clear query '' can't be used, must replace path with itself
			history.replaceState(null, document.title, (objectToQuery(args) || location.pathname) + location.hash);
		}
	}
	normalizeLnk(window.location);
}


function fixL(links, j=0) {
	if (DEBUG) { var cnt = 0; } // ugly syntax, but needed for minimizer (or not if it detects unused)
	var lnk,
		timeForPause = Date.now()+200;
	if (DEBUG) { console.log('NormalizeURI.js: fixL: START from', j); } /* jshint -W084 */
	for (; lnk=links[j]; j++) {
		if (lnk.isFixed || !lnk.href) { continue; }

		// pause and continue the next event cycle, give browser chance to do stuff 
		if (Date.now() > timeForPause) { /* jshint -W083 */
			setTimeout(() => fixL(links,j)); // alt: queueMicrotask()
			if (DEBUG) { console.log('NormalizeURI.js: fixL: PAUSED on', j); }
			return;
		}

		if (lnk.protocol && lnk.protocol.startsWith('http') && lnk.host.endsWith('imdb.com') && lnk.search) {
			let args = parseURIQuery(lnk);
			if (Object.keys(args).length !== 0) {
				if (imdbFix(args)) { // true: a fix was done
					lnk.search = objectToQuery(args);
					if (DEBUG) { cnt++; }
				}
				normalizeLnk(lnk);
			}
		}
		if (lnk.pathname !== '/') { lnk.isFixed=1; }  // p: why?
		// else { console.log('NormalizeURI.js: fixL: path is /',lnk); }
	}
	if (DEBUG) { console.log('NormalizeURI.js: fixL: FINISHES (all, fixed)', j, cnt); }
}


// https://stackoverflow.com/a/11546242/3273963
function regMutationObserver() {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	new MutationObserver(mutations => {
		if (DEBUG) { console.log('NormalizeURI.js: regMutationObserver: fired'); }

		for (let m of mutations) {
			if (m.addedNodes.length === 0) { continue; }

			// todo: but target is only the one whose children were added
			//     we should not check target, but m.addedNodes
			let elements__ = [];
			for (let par of m.addedNodes) {
				if (!(par instanceof HTMLElement)) { continue; } // could be #Text and error
				if (par instanceof HTMLStyleElement) { continue; } // Style does not have children
				if (par.children && par.children.length === 0) { continue; } // will this help?
				let tmp = par.getElementsByTagName('a');
				let tmp_arr = Array.prototype.slice.call(tmp);
				elements__ = elements__.concat(tmp_arr);
			}

			let elements = m.target.querySelectorAll(':scope a');
			// cool, but getElementsByTagName can be used on element and is probably faster
			let elements_ = m.target.getElementsByTagName('a');
			if (DEBUG && (elements.length !== 0 || elements_.length !== 0)) {
				console.log('NormalizeURI.js: regMutationObserver: new links:', elements.length, elements_.length, elements__.length);
			}
			if (elements.length !== elements_.length) { alert('different results'); }
			if (elements.length !== 0) { fixL(elements); }
		}
	})
	.observe(document, {
		childList: true,
		subtree: true
	});
}

function startFixingLinks() {
	regMutationObserver();
	fixL(document.links);
}

// ======

fixBrowserAddressBox();

if (DEBUG) {
	if (document.readyState !== 'interactive' && document.readyState !== 'complete') {
		window.addEventListener('DOMContentLoaded', () => console.log('NormalizeURI.js: DOMContentLoaded'));
	} else { console.log('NormalizeURI.js: started already after DOMContentLoaded'); }
}

if (document.readyState !== 'interactive' && document.readyState !== 'complete') {
	window.addEventListener('DOMContentLoaded', startFixingLinks);
} else { startFixingLinks(); }

})();


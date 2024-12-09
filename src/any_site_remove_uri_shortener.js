/* jshint esversion: 6 */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FILE: any_site_remove_uri_shortener.js
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This is a site-specific JS file. It is used together with NormalizeURIandLinks.js, which should be loaded before.
//
// IMDb.js is considered to be a template. Containing all possible features and description.


// Needed only for GM. WebExt can selectively load this js file.
// I am not sure what is used in GM (in @match metadata directive) or in WebExt to search for web page pattern. It is possible
// to use "*" on specific parts of the URI, but not anywhere. It's not really globs and not regex.
// There are no globs in JS. 
//
// can't use 'return' here, as this script is concatenated with others in a common scope
if (window.location.href.includes('kick')) { // kick4ss.com
// alt: window.location.hostname
// alt: window.location.origin


// Include these Hostnames while fixing links on a page. Try to fix only links which refer to URI
// on these hosts. If none is included, * is assumed (any and all URLs).
var HOSTNAMES_INCLUDE = [
	'mylink.cloud'
];

/* === Filter Functions ===
   These functions are optional. Not all need to be defined. They apply to both Browser Bar and page links.
*/

/**
 * Modify the Hostname in a link.
 * <A>.baseURI will not change. If needed, must also modify uri.baseURI
 * @param  {String}             hostname  path part of the URI
 * @param  {Location (Object)}  uri       Optional. Contains URI object on which path is being fixed. (Do not modify directly)
 * @return {String/null}                  Modified Hostname. null: keep old Hostname.
 */
normURIHostname = function (hostname, uri) {
	return;
	// let t1 = uri.href.split(hostname);
	let parts = uri.href.split('?url=');
	parts[0] = '';
	let realURIraw = parts.join('');
	let realURIdecoded = decodeURIComponent(realURIraw);
	uri.href = realURIdecoded;
	return null;
};


/**
 * Modify the Path part of a URI or link.
 * (Do not modify uri parameter directly. e.g. uri.pathname+='/', the web page will be reloaded and might even loop)
 * @param  {String}             path  path part of the URI
 * @param  {Location (Object)}  uri   Optional. Contains URI object on which path is being fixed. (Do not modify directly)
 * @return {String/null}              Modified path. null: keep old path. '/': To remove the path. ('' will do nothing)
 */
filterURIArgument = function (valuename, value, args, uri) {
	if (valuename !== 'url') { return; } // ignoring unrelevant args
	uri.href = decodeURIComponent(value);
	return null;
};


/* END: === Filter Functions === */


fixLinksOnPage();

} // END: if (window.location.href.includes(...

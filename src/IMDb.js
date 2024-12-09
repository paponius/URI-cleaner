/* jshint esversion: 6 */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FILE: IMDb.js
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This is a site-specific JS file. It is used together with NormalizeURIandLinks.js, which should be loaded before.
//
// IMDb.js is also a template. Containing all possible features and descriptions.


// Needed only for GM. WebExt can selectively load this js file.
// I am not sure what is used in GM (in @match metadata directive) or in WebExt to search for web page pattern. It is possible
// to use "*" on specific parts of the URI, but not anywhere. It's not really globs and not regex.
// There are no globs in JS. 
//
// can't use 'return' here, as this script is concatenated with others in a common scope
if (window.location.href.includes('imdb.com')) {
// alt: window.location.hostname
// alt: window.location.origin


// Include these Hostnames while fixing links on a page. Try to fix only links which refer to URI
// on these hosts. If none is included, * is assumed (any and all URLs).
var HOSTNAMES_INCLUDE = [
	'imdb.com'
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
// normURIHostname = function (hostname, uri) {
// 	if (hostname === 'x.com') { return 'twitter.com'; }
// 	return null;
// };


/**
 * Modify the Path part of a URI or link.
 * (Do not modify uri parameter directly. e.g. uri.pathname+='/', the web page will be reloaded and might even loop)
 * @param  {String}             path  path part of the URI
 * @param  {Location (Object)}  uri   Optional. Contains URI object on which path is being fixed. (Do not modify directly)
 * @return {String/null}              Modified path. null: keep old path. '/': To remove the path. ('' will do nothing)
 */
normURIPath = function (path, uri) {

	// Only normalize links on one of these web pages. (URI of the current web page.)
	// if (location.pathname.endsWith('/bio') || location.pathname.startsWith('/title/')) {

	// Add missing trailing slash
	// e.g.: https://www.imdb.com/name/nm0123456?ref_=tt_cl_t_6
	if ( path.endsWith('/bio') ||
		 path.startsWith('/title/') ||
		 path.startsWith('/list/') ||
		 path.startsWith('/name/')
	   ) {
		if (path.slice(-1) !== '/') {
			path+='/';
			return path;
		}
	}
	return null;
};


/**
 * Removes or modifies an argument from the URI. Browser's Address bar, or in links.
 * This Function is run once per each argument.
 * In case argument is replaced, new text should be sanated. read description in objectToQuery().
 * @param  {String}             valuename Name of an URI argument.
 * @param  {String}             value     Value of an URI argument.
 * @param  {Location (Object)}  args      Optional. All parameters of the URI. To modify other than the current one.
 * @param  {Location (Object)}  uri       Optional. The URI being modified. (Do not modify it directly)
 * @return {false/null/Array}             false: remove the argument
 *                                        null/undefined: Do not modify nor remove the argument
 *                                        Array: Modified [valuename, value]
 */
filterURIArgument = function (valuename, value, args, uri) {
	if (
		valuename === 'ref_' || // remove 'ref_'

		// remove pf_rd, e.g. https://www.imdb.com/whats-on-tv/new-on-netflix-streaming/ls084463446/?pf_rd_m=...&pf_rd_p=...&pf_rd_r=...&pf_rd_s=...&pf_rd_t=...&pf_rd_i=...
		valuename.startsWith('pf_rd_')

		// Example regex:
		// last char can be [a-z], but will not use regex now just for that
		// if (/^pf_rd_[a-z]$/.test(valuename)) { ... }

	   ) { return false; }

	// Example: to modify valuename or value
	// if (valuename === 'a') {
		// valuename='xax'; // Or keep the old valuename. (Keep line disabled)
		// value='xaxvalue'; // Or keep the old value. (Keep line disabled)
		// return [valuename, value]; // must always return both as an Array
	// }

	// use decodeURIComponent(value) or decodeURI(value) instead of just 'value' if required.
	// read description in objectToQuery()
};


/**
 * Order of arguments in URI.
 * Possible use: for Bookmarks. Browser will recognize an URI is already in Bookmarks only if the order of already bookmarked URI is the same.
 * @param  {Array}      orderOfURIArgs  Array of valuenames. Order in the Array will represent the order in the URI query.
 * @param  {Object}     args            Optional. Object with valuename, value pairs. Do not edit it in this function.
 * @return {null/Array}                 null: no change to order, or an array of valuenames.
 */
sortURIArgument = function (orderOfURIArgs, args) {

	// example: sort alphabetically
	// return orderOfURIArgs.sort();

	// return orderOfURIArgs;
	return null;
};

/* END: === Filter Functions === */


/* start point
   enable/disable whichever is required. If all are disabled, this module does nothing.
*/
fixBrowserAddressBox();
fixLinksOnPage();

} // END: if (window.location.href.includes(...

/* jshint esversion: 6 */

// This is a site-specific JS file. It is used together with NormalizeURIandLinks.js, which should be loaded before.
//
// IMDb.js is considered to be a template. Containing all possible features and description.

/* Google Search parameters
oq        Original Query
sxsrf     Previous Page Load Date/Time
ei        Search Session Start Date/Time
ved       Page Load Date/Time
biw,bih   Browser Width/Height
https://stackoverflow.com/questions/69660435/what-are-the-components-of-a-google-com-url-string
*/

if (window.location.href.includes('.google.')) {


// Include these Hostnames while fixing links on a page. Try to fix only links which refer to URI
// on these hosts. If none is included, * is assumed (any and all URLs).
var HOSTNAMES_INCLUDE = [
	'google.com',
	'google.sk'
];


filterURIArgument = function (valuename, value, args, uri) {
	if (
		// client=firefox-b-d
		valuename === 'client' // ||

		// valuename.startsWith('pf_rd_')

		) { return false; }

	// Remove all other parameters, modify order of words in value.
	// Purpose: Maintaining a "Dictionary" as bookmarks.
	// Need unified style, to not create multiple entries for one phrase/word
	// If Google query contains a word "define", the word define will be moved to the front
	// and all other parameters from the URI are removed.
	// As the page loads with parameters as they were and is not reloaded, "Searched text"
	//  in the page will show order of words as they were entered. That is not important for Bookmarks.
	if ( valuename === 'q' && value.includes('define') ) {
		const regex = new RegExp('(.*)(^|[ +])define([ +]|$)(.*)'); // is it a word 'define'
		let found = value.match(regex);
		if (found) {
			let ret = 'define';
			if (found[1]) { ret += '+' + found[1]; }
			if (found[4]) { ret += '+' + found[4]; }
			if (ret === 'define') { return null; } // it's 'define' by itself. weird, but let it be as-is
			Object.keys(args).forEach(key => delete args[key]); // args = {} would create new Object. not good.
			return [valuename, ret];
		}
	}
};

fixBrowserAddressBox();
// fixLinksOnPage();
}


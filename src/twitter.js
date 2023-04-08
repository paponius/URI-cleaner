
// This is a site-specific JS file. It is used together with NormalizeURIandLinks.js, which should be loaded before.
//
// IMDb.js is considered to be a template. Containing all possible features and description.


if (window.location.href.includes('twitter.com')) {


// Include these Hostnames while fixing links on a page. Try to fix only links which refer to URI
// on these hosts. If none is included, * is assumed (any and all URLs).
var HOSTNAMES_INCLUDE = [
	'twitter.com'
];


filterURIArgument = function (valuename, value, uri) {
	if (
		valuename === 's' ||   // source of the link
		valuename === 't'      // tracking 

		// valuename.startsWith('pf_rd_')

		) { return false; }
};

fixBrowserAddressBox();
fixLinksOnPage();
}

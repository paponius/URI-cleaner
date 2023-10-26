
// This is a site-specific JS file. It is used together with NormalizeURIandLinks.js, which should be loaded before.
//
// IMDb.js is considered to be a template. Containing all possible features and description.


if (window.location.href.includes('twitter.com')) {


var HOSTNAMES_INCLUDE = [
	'twitter.com'
];


filterURIArgument = function (valuename, value, args, uri) {
	if (
		valuename === 's' ||   // source of the link
		valuename === 't'      // tracking 

		// valuename.startsWith('pf_rd_')

		) { return false; }
};


normURIHostname = function (hostname, uri) {
	if (hostname === 'x.com') { return 'twitter.com'; }
	return null;
};

fixBrowserAddressBox();
fixLinksOnPage();
}

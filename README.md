# URI cleaner
Can be used to manipulate URI in browser's Address Bar and in links on a web page.

Remove, modify, sort arguments (query like "?param=value&...").  
Modify URI path.

- to maintain visited history and bookmarks
  Browser will correctly show visited links and 'a star' for bookmarked pages.
- Removes tracking and other arguments useless for a user.
- Nicer Address Bar. No tracking and shorter when page link is shared by copying from browser Address Bar.

Changes to the Browser's Address bar will not interfere with loading of the currently opened page.  
Changes are done when page is already being opened with the original URI. The page will not be re-loaded with changed arguments.  
But any JavaScript on a page accessing the page URI will see the modified one.

There is no hash manipulation filter function implemented at this point. Hash part of URI will not be affected.

# Usage
Can be used as-is with Greasemonkey, but to modify and add more sites, JS basic knowledge is required.

This script can be used without GM. Only files in GM are GM specific.

## Install in GreaseMonkey
GM/URI-cleaner.user.js

## Use in own code
load NormalizeURIandLinks.js
See IMDb.js file for description and examples.

### Add a web page
Use IMDb.js as a template to create new JS file.
See IMDb.js file for description and examples.

If used with Greasemonkey/Tampermonky/...
Edit GM/URI-cleaner.user.js, add @match key for the new site.




export default [
	{
		"doctype-first": true,						// Ensures <!DOCTYPE html> is the very first line of the document
		"tag-pair": true,							// Every opening tag must have a corresponding closing tag
		"tagname-lowercase": true,					// All HTML tag names must be in lowercase (e.g., <div> not <DIV>)
		"attr-lowercase": true,						// All attribute names must be in lowercase (e.g., class="myClass" not CLASS="myClass")
		"attr-value-not-empty": true,				// Attributes must always have a value (e.g., class="something")
		"attr-value-double-quotes": true,			// Attribute values must always be wrapped in double quotes (e.g., id="main")
		"attr-value-not-space": true,				// No spaces before or after the '=' in attributes (e.g., class="btn" not class = "btn")
		"require-tags": ["html", "head", "body"],	// Ensures <html>, <head>, and <body> tags exist in the document
		"head-script-disabled": true,				// Disallows <script> tags inside <head>; scripts should go before </body>
		"head-meta-required": true,					// Requires at least one <meta> tag inside <head>
		"title-require": true,						// Requires a <title> tag inside <head>
		"meta-name-content-required": true,			// Ensures every <meta> tag has both 'name' and 'content' attributes
		"html-lang-require": true,					// Requires the <html> tag to have a 'lang' attribute (e.g., <html lang="en">)
		"style-disabled": true,						// Disallows inline <style> blocks in HTML files
		"script-disabled": true,					// Disallows inline <script> blocks; only allows external JS/TS files via src attribute
		"self-closing-style": true,					// Enforce self-closing tags to use <tag /> format (e.g., <img />)
		"img-alt-require": true,					// Every <img> tag must have an alt attribute for accessibility
		"img-width-height-require": true,			// Every <img> tag must specify both width and height attributes
		"max-len": 150,								// Enforce a maximum of 150 characters per line to keep code readable
		"indent-space": 2,							// Enforce 2 spaces per indentation level
		"space-tab-mixed-disabled": "space"			// Disallow tab characters; only spaces are allowed for indentation
	}
]

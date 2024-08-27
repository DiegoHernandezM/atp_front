module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{ico,html,png,json,svg}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};
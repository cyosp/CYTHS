// 2016-10-21 V 1.0.0
//   - Initial release

//
// i18next configuration
//
var i18nextOptions =
{
	// evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
    lng: navigator.language || navigator.userLanguage, 
	fallbackLng: 'en',
	load: 'currentOnly',
	backend:
	{
		// i18nextLoadPath must be declared as a global variable
		loadPath: i18nextLoadPath
    }
}

//
// i18next initialization
//
i18next.use( i18nextXHRBackend ).init( i18nextOptions , function(err, t)
{
	// For options see: https://github.com/i18next/jquery-i18next#initialize-the-plugin
	jqueryI18next.init( i18next , $ );

	// Start localizing, details: https://github.com/i18next/jquery-i18next#usage-of-selector-function
	$( 'head, body' ).localize();
});
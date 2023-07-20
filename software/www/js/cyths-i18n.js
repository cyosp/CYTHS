//
// Author: CYOSP
// Created: 2016-10-21
// Version: 1.2.1
//

// 2016-11-04 V 1.2.1
//   - Manage language more than 2 characters
//     (Safari on iOS for example)
// 2016-10-27 V 1.2.0
//   - Execute cythsBeforeLocalize function (if it exists)
//     before internationalization 
// 2016-10-22 V 1.1.0
//   - Execute cythsInit function (if it exists)
//     after internationalization 
// 2016-10-21 V 1.0.0
//   - Initial release

var cythsI18n =
{
	// Return language on 2 characters
	getLanguage : function()
	{
		// Get language
		var language = navigator.language || navigator.userLanguage;
		
		// If language is more than 2 characters, reduce it to the first 2 ones
		if( language.length > 2 )	language = language.substring( 0 , 2 );
		
		return language;
	}
}

//
// i18next configuration
//
var i18nextOptions =
{
	// evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
    lng: cythsI18n.getLanguage(), 
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

	// Before internationalization is performed
	// Call CYTHS before localize if defined
	if( typeof cythsBeforeLocalize !== 'undefined' && $.isFunction( cythsBeforeLocalize ) )
	{
		cythsBeforeLocalize();
	}

	// Start localizing, details: https://github.com/i18next/jquery-i18next#usage-of-selector-function
	$( 'head, body' ).localize();

	// Internationalization is performed
	// Call CYTHS init function if defined
	if( typeof cythsInit !== 'undefined' && $.isFunction( cythsInit ) )
	{
		cythsInit();
	}
});

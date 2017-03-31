//
// Author: CYOSP
// Created: 2017-03-30
// Version: 1.0.1
//

// 2017-03-31 V 1.0.1
//  - Index is now starting 0 instead of 1
// 2017-03-30 V 1.0.0
//  - Initial release

// Parameters:
//  * process.argv[0]     <=> nodejs absolute binary path
//  * process.argv[1]     <=> nodejs absolute script path
//  * process.argv[2->..] <=> nodejs script arguments
function help()
{
	console.log( path.basename( process.argv[1] ) + " takes two arguments:" );
	console.log( " * Switch index, starting: 0" );
	console.log( " * Crontab index in switch, starting: 0" );
}

// Return:
// * 0 : Crontab condition is true
// * 1 : Crontab condition is false
// * 9 : Missing parameters

// Dependencies:
var path = require('path');
var jsonQuery = require('json-query');

//Test:
// * nodejs crontab-condition.js 0 0

// Exit code
var exitCode = 0;

// Check input arguments
if( process.argv.length != 4 )
{
	exitCode = 9;
	help();
}
else
{
	// Get switch index
	var switchIndex = process.argv[2];
	// Get crontab index
	var crontabIndex = process.argv[3];
	
	// Load configuration file
	var config = require( "../../../data/config.json" );
	
	// Define helper functions
	var helperFunctions =
	{
		// Equal
		eq: function( left , right )
		{
			return parseInt( left ) == parseInt( right );
		},
		
		// Not equal
		ne: function( left , right )
		{
			return parseInt( left ) != parseInt( right );
		},
			
		// Greater than
		gt: function( left , right )
		{
			return parseInt( left ) > parseInt( right );
		},
	
		// Greater than or equal
		ge: function( left , right )
		{
			return parseInt( left ) >= parseInt( right );
		},
		
		// Lesser than
		lt: function( left , right )
		{
			return parseInt( left ) < parseInt( right );
		},
	
		// Lesser than or equal
		le: function( left , right )
		{
			return parseInt( left ) <= parseInt( right );
		}
	}
	
	// Retrieve crontab condition
	var crontabCondition = config.switchesList[switchIndex].crontab[crontabIndex].condition;
	
	// Evaluate crontab condition
	var crontabConditionEvaluated = jsonQuery( crontabCondition ,
	{
		data: config,
		locals : helperFunctions
	});
	
	// Update exit code following crontab condition evaluated
	if( ! crontabConditionEvaluated.value ) exitCode = 1;
}

// End script with exit code
process.exit( exitCode );

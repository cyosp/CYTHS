var pageVersion = "1.4.0";

// 2016-10-30 V 1.4.0
//   - Enable crontab to be modified without saving modification
// 2016-10-29 V 1.3.3
//   - Use now one line per crontab
// 2016-10-29 V 1.3.2
//   - States are displayed as jqCron
// 2016-10-28 V 1.3.1
//   - Optimize code
// 2016-10-28 V 1.3.0
//   - Add crontab translation
// 2016-10-28 V 1.2.1
//   - Crontab are padded with zero
// 2016-10-27 V 1.2.0
//   - Use cythsBeforeLocalize instead of init
//   - Localize "on" and "off" crontab states
// 2016-10-26 V 1.1.0
//   - Use jqCron library instead of cronwtf
// 2016-10-10 V 1.0.2
//   - Manage cronwtf library
// 2016-10-08 V 1.0.1
//   - Manage new crontab format
// 2016-10-06 V 1.0.0
//   - Initial release

function cythsBeforeLocalize()
{
	// Load jqCron translation
	jQuery.ajax(
	{
	    url: "../../js/jqCron/jqCron." + (navigator.language || navigator.userLanguage) + ".js",
	    dataType: 'script',
		async: false
	});

	//
	// Get JSON configuration file
	//
	$.ajax(
	{
	  url: "../../data/config.json",
	  dataType: 'json',
	  async: false,
	  cache: false,
	  success: function( root )
	  {
		var crontabsListToAdd = '';

		//
		// For each switch configured
		//
		$.each( root.switchesList , function( index , switchToDrive )
		{
			// Switch is displayed only if there is a crontab associated
			if( switchToDrive.crontab )
			{
				//
				// Compute piece of HTML to insert
				//
				crontabsListToAdd += '<div class="col-xs-12 col-lg-3 switch">';
				crontabsListToAdd += '  <h2 class="h4">' + switchToDrive.label + '</h2>';
				crontabsListToAdd += '   <ul>';

				$.each( switchToDrive.crontab , function( index , entry )
				{
					// Add entry in HTML page
					crontabsListToAdd += '    <li>';
					crontabsListToAdd += '        <span class="jqCron-container"><span class="jqCron-selector jqCron-selector-1"><span class="jqCron-selector-title cyths-crontab-state"><span data-i18n="crontab.state.' +  entry.state + '">' + entry.state + '</span></span><ul class="jqCron-selector-list cyths-crontab-state-list" style="display: none;"><li><span data-i18n="crontab.state.on">on</span></li><li><span data-i18n="crontab.state.off">off</span></li></ul></span></span> ';
					crontabsListToAdd += '        <span class="lowercase"><input value="' + entry.cron + '" class="cyths-crontab" type="hidden"></input></span><span class="jqCron-container disable"></span>';
					crontabsListToAdd += '    </li><br/>';
				});

				// End of piece of HTML
				crontabsListToAdd += '   </ul>';
				crontabsListToAdd += '</div>';
	  		}
		});

		// Insert piece of HTML
		$( crontabsListToAdd ).insertAfter( ".row" );

		//
		// Initialize jqCron
		//
		$( '.cyths-crontab' ).jqCron(
		{
			enabled_minute: true,
			multiple_dom: true,
			multiple_month: true,
			multiple_mins: true,
			multiple_dow: true,
			multiple_time_hours: true,
			multiple_time_minutes: true,
			default_period: 'week',
			no_reset_button: true,
			disable: false,
			numeric_zero_pad: true,
			lang: navigator.language || navigator.userLanguage
		});

		// Display/hide available states 
		$( '.cyths-crontab-state' ).click( function()
		{
			// Get selected state tag
			$(this).next( ".cyths-crontab-state-list" ).toggle();
		});

		// Manage selected state
		$( '.cyths-crontab-state-list li' ).click( function()
		{
			// Get selected state tag
			var stateTagSelected = $(this).html();
			
			// Update crontab state
			$(this).parent().prev( ".jqCron-selector-title" ).html( stateTagSelected );

			// Hide list of states
			$(this).parent().hide();
		});
	  },
	  error: function(xhr, textStatus, error)
	  {
		  alert( textStatus + ": " + error );
	  }
	});
}


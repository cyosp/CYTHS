var pageVersion = "1.1.0";

// 2016-10-26 V 1.1.0
//   - Use jqCron library instead of cronwtf
// 2016-10-10 V 1.0.2
//   - Manage cronwtf library
// 2016-10-08 V 1.0.1
//   - Manage new crontab format
// 2016-10-06 V 1.0.0
//   - Initial release

$( document ).ready(function()
{
	init();
});

function init()
{
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
				var crontabsListToAdd = '<div class="col-xs-12 col-lg-3 switch">';
				crontabsListToAdd += '  <h2 class="h4">' + switchToDrive.label + '</h2>';
				crontabsListToAdd += '   <ul>';

				var pos = 0;
				$.each( switchToDrive.crontab , function( index , entry )
				{
					// Compute id for jqCron
					var crontabId = switchToDrive.rcId + "-" + switchToDrive.channel + '-' + pos;
					
					// Add entry in HTML page
					crontabsListToAdd += '    <li>' + entry.state + '<div id="' + crontabId + '"></div></li>';
					
					// Update position
					pos++;
				});

				// End of piece of HTML
				crontabsListToAdd += '   </ul>';
				crontabsListToAdd += '</div>';

				// Insert piece of HTML
				$( crontabsListToAdd ).insertBefore( ".row" );

				//
				// Initialise jqCron
				//
				pos = 0;
				$.each( switchToDrive.crontab , function( index , entry )
				{
					// Compute id for jqCron
					var crontabId = switchToDrive.rcId + "-" + switchToDrive.channel + '-' + pos;

					// Initialise jqCron
					$( '#' + crontabId ).jqCron(
					{
						enabled_minute: true,
						multiple_dom: true,
						multiple_month: true,
						multiple_mins: true,
						multiple_dow: true,
						multiple_time_hours: true,
						multiple_time_minutes: true,
						default_period: 'week',
						default_value: entry.cron,
						no_reset_button: true,
						disable: true,
						lang: 'en'
					});

					pos++;
				});
	  		}
		});
	  },
	  error: function(xhr, textStatus, error)
	  {
		  alert( textStatus + ": " + error );
	  }
	});
}


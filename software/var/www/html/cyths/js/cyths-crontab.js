var pageVersion = "1.0.2";

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
				crontabsListToAdd += '  <p>';
				crontabsListToAdd += '   <ul>';
				$.each( switchToDrive.crontab , function( index , entry )
				{
					// Get cron string
					var cronString = entry.cron + ' ' + entry.state;
					// Convert cron as a human readable string
					var cronHumanString = CronWTF.entry( cronString );
					
					// Add entry in HTML page
					crontabsListToAdd += '    <li>' + cronString + '<br/>' + cronHumanString.message +'</li>';
				});
				crontabsListToAdd += '   </ul>';
				crontabsListToAdd += '  </p>';
				crontabsListToAdd += '</div>';
	  		}
		});
		
		// Insert piece of HTML
		$( crontabsListToAdd ).insertAfter( ".row" );
	  },
	  error: function(xhr, textStatus, error)
	  {
		  alert( textStatus + ": " + error );
	  }
	});
}
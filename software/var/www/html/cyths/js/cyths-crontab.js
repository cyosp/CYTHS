var pageVersion = "1.0.0";

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
				$.each( switchToDrive.crontab , function( index , cron )
				{
					crontabsListToAdd += '    <li>' + cron.entry + '</li>';
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
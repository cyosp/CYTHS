//
// Author: CYOSP
// Created: 2016-10-22
// Version: 1.0.0
//

// 2016-10-22 V 1.0.0
//   - Initial release

function cythsInit()
{
	//
	// Get JSON configuration file
	//
	$.ajax(
	{
	  url: "../data/config.json",
	  dataType: 'json',
	  async: false,
	  cache: false,
	  success: function( root )
	  {
		// Get sensor identifier provided in URL and stored by PHP in web page
		var sensorId = $( "#sensorId" ).attr( "sensorId" );

		// Check if there is a sensor identifier		
		if( sensorId != "" )
		{
			// Define suffix
			var suffix = " - ";

			// Search label associated to sensor identifier
			$.each( root.switchesList , function( index , switchConfigured )
			{
				// Association found => update suffix string
				if( switchConfigured.sensorId == sensorId )	suffix += switchConfigured.label;
			});

			// Update page title
			$(document).prop( 'title' , $(document).prop( 'title' ) + suffix );
			// Update "navbar-brand"
			$( "#sensorsTitle" ).text( $( "#sensorsTitle" ).text() + suffix );
		}

		var graphsListToAdd = '';

		//
		// For each switch configured
		//
		$.each( root.switchesList , function( index , switchConfigured )
		{
			// Check if switch has a sensor identifer configured
			if( switchConfigured.sensorId && switchConfigured.sensorId != "" )
			{	
				//
				// Compute piece of HTML to insert
				//

				// Add a break if there is something to display
				if( sensorId == "" || switchConfigured.sensorId == sensorId )	graphsListToAdd += '<br/>';

				// Display a title per sensor if all sensors must be displayed
				if( sensorId == "" )											graphsListToAdd += '<ul><li><h5>' + switchConfigured.label + '</h5></li></ul>';
		
				// Display sensor graph
				if( sensorId == "" || switchConfigured.sensorId == sensorId )
				{
					graphsListToAdd += '<div id="' + switchConfigured.sensorId + '" style="width: 98%;"></div>';
					graphsListToAdd += '<script type="text/javascript">';
					graphsListToAdd += '  g3 = new Dygraph(';
					graphsListToAdd += '        document.getElementById("' + switchConfigured.sensorId + '"),';
					graphsListToAdd += '        "../data/csv/' + switchConfigured.sensorId + '.rrd.csv",';
					graphsListToAdd += '	 {';
					graphsListToAdd += '		 rollPeriod: 7,';
					graphsListToAdd += '		 showRoller: true,';
					graphsListToAdd += '		 colors: ["#FF0000", "#0000FF"]';
					graphsListToAdd += '	 });';
					graphsListToAdd += '</script>';
				}
	  		}
		});
		
		// Insert piece of HTML
		$( graphsListToAdd ).insertAfter( ".row" );
	  },
	  error: function(xhr, textStatus, error)
	  {
		  alert( textStatus + ": " + error );
	  }
	});
}

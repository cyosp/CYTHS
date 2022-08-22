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

		var graphMarginLeft = "0px";
		var graphWidth = "98%";
		var graphsListToAdd = '';
		// Check if there is a sensor identifier		
		if( sensorId != "" )
		{
			// Define suffix
			var suffix = " - ";

			// Search label associated to sensor identifier
			$.each( root.switchesList , function( index , switchConfigured )
			{
				// Association found => update suffix string
				if( switchConfigured.sensor && switchConfigured.sensor.id == sensorId )	suffix += switchConfigured.label;
			});

			// Update page title
			$(document).prop( 'title' , $(document).prop( 'title' ) + suffix );
			// Update "navbar-brand"
			$( "#sensorsTitle" ).text( $( "#sensorsTitle" ).text() + suffix );

			graphsListToAdd += '<br/>';
		} else if ($(window).height() > $(window).width()) {
			graphMarginLeft = "30px";
			graphWidth = "82%";
		}

		//
		// For each switch configured
		//
		$.each( root.switchesList , function( index , switchConfigured )
		{
			// Check if switch has a sensor identifier configured
			if( switchConfigured.sensor && switchConfigured.sensor.id && switchConfigured.sensor.id != "" )
			{	
				//
				// Compute piece of HTML to insert
				//

				// Display a title per sensor if all sensors must be displayed
				if( sensorId == "" ) graphsListToAdd += '<center><h5>' + switchConfigured.label + '</h5></center>';
		
				// Display sensor graph
				if( sensorId == "" || switchConfigured.sensor.id == sensorId )
				{
					graphsListToAdd += '<div id="' + switchConfigured.sensor.id + '" style="margin-left:' + graphMarginLeft + '; width: ' + graphWidth + ';"></div><br/>';
					graphsListToAdd += '<script type="text/javascript">';
					graphsListToAdd += '  g3 = new Dygraph(';
					graphsListToAdd += '        document.getElementById("' + switchConfigured.sensor.id + '"),';
					graphsListToAdd += '        "../data/csv/' + switchConfigured.sensor.id + '.rrd.csv",';
					graphsListToAdd += '	 {';
					graphsListToAdd += '		 showRoller: true,';
					graphsListToAdd += '		 colors: ["#FF0000", "#0000FF", "#FF8000"]';
					graphsListToAdd += '	 });';
					graphsListToAdd += '</script>';
				}
	  		}
		});
		
		// Insert piece of HTML
		$( graphsListToAdd ).insertAfter( "#sensorId" );
	  },
	  error: function(xhr, textStatus, error)
	  {
		  alert( textStatus + ": " + error );
	  }
	});
}

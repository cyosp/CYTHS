var emitterWiringPiNumber = -1;
var projectVersion = "1.3.0";

// 2016-10-21 V 1.3.0
//- Add internationalization
// 2016-10-02 V 1.2.1
//  - Fix: call to "switch" URL API
// 2016-09-28 V 1.2.0
//   - Disable switch if remote command
//     identifier and channel are empty
// 2016-07-10 V 1.1.0
//   - Add a graphic link to each sensor
// 2016-07-07 V 1.0.0
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
	  url: "data/config.json",
	  dataType: 'json',
	  async: false,
	  cache: false,
	  success: function( root )
	  {
		// Store transmitter wiringPi number
		emitterWiringPiNumber = root.emitterWiringPiNumber;
		 
		// Set page titles
		$(document).prop( 'title' , $(document).prop( 'title' ) + " - " + projectVersion );
		$( "div.container h1").text( root.pageTitle );
		  
		var switchesListToAdd = '';
		
		//
		// For each switch configured
		//
		$.each( root.switchesList , function( index , switchToDrive )
		{
			// Define switch id
			var switchId = "switch-" + switchToDrive.channel + "-" + switchToDrive.rcId;
			
			//
			// Compute piece of HTML to insert
			//
			switchesListToAdd += '<div class="col-xs-6 col-lg-3 switch">';
			switchesListToAdd += '  <h2 class="h4">' + switchToDrive.label + '</h2>';
			switchesListToAdd += '  <p>';
			switchesListToAdd += '    <input id="' + switchId + '" name="' + switchId + '" rcId="' + switchToDrive.rcId + '" channel="' + switchToDrive.channel + '" type="checkbox" data-on-color="info" data-off-color="warning" data-size="normal" data-handle-width="50" ';
			// START : Manage switch state
			if( switchToDrive.state == "on" )
			{
				switchesListToAdd += "checked";
			}
			else if( switchToDrive.state == "off" )
			{
				// Nothing to do
			}
			else	switchesListToAdd += 'data-indeterminate="true"';
			// END : Manage switch state
			// Disable switch if remote command identifier and channel are empty
			if( switchToDrive.rcId == "" && switchToDrive.channel == "" )	switchesListToAdd += ' disabled';
			switchesListToAdd += '>';
			switchesListToAdd += '  </p>';
			switchesListToAdd += '  <h2 class="h6">';
			if( switchToDrive.info )
			{
				if( switchToDrive.sensorId )	switchesListToAdd += '<a href="sensors/?id=' + switchToDrive.sensorId + '">' + switchToDrive.info + '</a>';
				else							switchesListToAdd += switchToDrive.info;
			}
			switchesListToAdd += '  </h2>';
			switchesListToAdd += '</div>';
		});
		
		// Insert piece of HTML
		$( switchesListToAdd ).insertAfter( ".row" );
		
		// Register switch change
		$( 'input' ).on( 'switchChange.bootstrapSwitch', function( event , state )
		{
			// Get switch 'object'
			var switchObj = $( '#' + $(this).attr( "id" ) );

			// Disable switch until post answer
			switchObj.bootstrapSwitch( 'disabled' , true );
			
			$.post( 'API/set/switch/' ,
			{
				emitterWiringPiNumber	: emitterWiringPiNumber,
				rcId    				: $(this).attr("rcId"),
				channel					: $(this).attr("channel"),
				state					: (state ? "on" : "off")
			}).done(function( data )
			{
				// Get JSON object
				var response = jQuery.parseJSON( data );
				
				// Manage error case
				if( response.result == "error")
				{
					var msg = "ERROR\n";
					msg += response.cmd + "\n";
					msg += response.message;
					
					// Display command executed and error to the user
					alert( msg );

					// Enable switch to be able to toggle state
					switchObj.bootstrapSwitch( 'disabled' , false );
					// Restore previous switch state with no event called
					switchObj.bootstrapSwitch( 'toggleState' , true );
				}
			}).fail(function(jqxhr, textStatus, error)
			{
				// Alert user
				alert( textStatus + ": " + error );
			}).always(function()
			{
				// Enable switch in all cases
				switchObj.bootstrapSwitch( 'disabled' , false );
			});
		});
	  },
	  error: function(xhr, textStatus, error)
	  {
		  alert( textStatus + ": " + error );
	  }
	});
}
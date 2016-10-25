var emitterWiringPiNumber = -1;
var projectVersion = "1.5.0";

var uiDisplayedToUser = true;
var refreshEachMilliSeconds = 5000;

// 2016-10-25 V 1.5.0
//  - Add an automatic refresh each 5 seconds
//  - Manage switch state "indeterminate" in refresh UI
// 2016-10-25 V 1.4.1
//  - Fix: Refresh UI on mobile browser 
// 2016-10-24 V 1.4.0
//  - UI is now refreshed when page has focus
// 2016-10-21 V 1.3.0
//  - Add internationalization
// 2016-10-02 V 1.2.1
//  - Fix: call to "switch" URL API
// 2016-09-28 V 1.2.0
//   - Disable switch if remote command
//     identifier and channel are empty
// 2016-07-10 V 1.1.0
//   - Add a graphic link to each sensor
// 2016-07-07 V 1.0.0
//   - Initial release

//
// Refresh UI when page is visible to user.
// It manages:
//  * Mobile browser displayed on screen:
//     - After phone unlock and mobile browser is app displayed
//     - When switching between apps to display mobile browser
//
document.addEventListener( 'visibilitychange' , function()
{
    if( document.hidden )	uiDisplayedToUser = false;
	else
	{
		uiDisplayedToUser = true;
		loadUI();
	}
});

//
// Refresh UI when page has focus.
// It manages:
//  * Desktop browser version
//  * Mobile browser switch tab
//
$(window).on("blur focus", function(e)
{
    var prevType = $(this).data("prevType");

	//  Reduce double fire issues
    if (prevType != e.type)
	{   
        switch (e.type)
		{
            case "blur":
				uiDisplayedToUser = false;
                break;
            case "focus":
				uiDisplayedToUser = true;
                loadUI();
                break;
        }
    }

    $(this).data("prevType", e.type);
});


$( document ).ready( function()
{
	// Set page title
	$(document).prop( 'title' , $(document).prop( 'title' ) + " - " + projectVersion );

	loadUI();
});

function addSwitch( switchToDrive )
{
	// Define switch id
	var switchId = "switch-" + switchToDrive.channel + "-" + switchToDrive.rcId;
	var infoId = switchId + "-info";

	// Add switch if it doesn't exist in the page
	if( $( '#' + switchId ).length == 0 )
	{
		//
		// Compute piece of HTML to insert
		//
		var switchesListToAdd = '<div class="col-xs-6 col-lg-3 switch">';
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
			var infoTag = '<span id="' + infoId + '">' + switchToDrive.info + '</span>';
			if( switchToDrive.sensorId )	switchesListToAdd += '<a href="sensors/?id=' + switchToDrive.sensorId + '">' + infoTag + '</a>';
			else							switchesListToAdd += infoTag;
		}
		switchesListToAdd += '  </h2>';
		switchesListToAdd += '</div>';

		// Insert piece of HTML
		$( switchesListToAdd ).insertBefore( ".row" );

		// Register switch change
		$( '#' + switchId ).on( 'switchChange.bootstrapSwitch', function( event , state )
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
	}
	else
	{
		// Get switch
		var switchObj = $( '#' + switchId );
		// Get switch state
		var switchState = ( switchObj.bootstrapSwitch( "state" ) ? "on" : "off" );
		if( switchObj.bootstrapSwitch( "indeterminate" ) )	switchState = "indeterminate";

		//
		// Update switch state if needed
		//
		if( switchState != switchToDrive.state )
		{
			switch( switchToDrive.state )
			{
				case "on" :
					switchObj.bootstrapSwitch( "state" , true , true );		
				break;
				case "off" :
					switchObj.bootstrapSwitch( "state" , false , true );
				break;
				default :
					switchObj.bootstrapSwitch( "indeterminate" , true );
				break;
			}
		}	

		// Get switch info
		var switchInfoObj = $( '#' + infoId );
		// Get switch info value
		var switchInfo = switchInfoObj.text();

		// Update switch info if needed
		if( switchInfo != switchToDrive.info )	switchInfoObj.text( switchToDrive.info );
	}
}

function loadUI()
{
	// Load UI only if displayed to user
	if( uiDisplayedToUser )
	{
		// Program a new UI refresh
		setTimeout( loadUI , refreshEachMilliSeconds );

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

			//
			// Add each switch configured
			//
			$.each( root.switchesList , function( index , switchToDrive )
			{
				addSwitch( switchToDrive );
			});
		  },
		  error: function(xhr, textStatus, error)
		  {
			  alert( textStatus + ": " + error );
		  }
		});
	}
}

var gpioController = "/dev/null";
var controllerOffset = -1;
var projectVersion = "3.0.0";

var uiDisplayedToUser = true;
var refreshEachMilliSeconds = 5000;

// Default switch info field
var defaultSwitchInfo = '<span data-i18n="switch.info.default">No sensor</span>';

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


function cythsBeforeLocalize()
{
	// Add version in page title
	$(document).prop( 'title' , $(document).prop( 'title' ) + " - " + projectVersion );
	// Add version in navigation bar
	$( "#cythsTitle" ).text( $( "#cythsTitle" ).text() + " - " + projectVersion );
	// Load user interface
	loadUI();
}

function htmlBatteryIndicator(switchToDrive) {
	var battery = switchToDrive.sensor.data.battery;

	var batteryIndicator;
	switch (true) {
		case (battery == 0):
			batteryIndicator = "alarm";
			break;
		case (battery < 50):
			batteryIndicator = "warning";
			break;
		default:
			batteryIndicator = "ok";
			break;
	}
	return '<span class="battery-' + batteryIndicator + '">•</span>';
}

function addSwitch( switchToDrive )
{
	//
	// Define switch id
	//
	var switchId = "switch-";
	// There is no switch to drive, only a sensor attached
	if( switchToDrive.channel == "" && switchToDrive.rcId == "" )	switchId += "sensor-" + switchToDrive.sensor.id;
	else															switchId += switchToDrive.channel + "-" + switchToDrive.rcId;

	// Check switch info exists and is not empty
	if( switchToDrive.info )
	{
		//
		// Resolve switch info variables
		//
		if( switchToDrive.sensor && switchToDrive.sensor.data )
		{
			if( switchToDrive.sensor.data.date )		switchToDrive.info = switchToDrive.info.replace( /\${sensor.data.date}/g        , switchToDrive.sensor.data.date        );
			if( switchToDrive.sensor.data.time )		switchToDrive.info = switchToDrive.info.replace( /\${sensor.data.time}/g        , switchToDrive.sensor.data.time        );
			if( switchToDrive.sensor.data.temperature )	switchToDrive.info = switchToDrive.info.replace( /\${sensor.data.temperature}/g , switchToDrive.sensor.data.temperature );
			if( switchToDrive.sensor.data.humidity )	switchToDrive.info = switchToDrive.info.replace( /\${sensor.data.humidity}/g    , switchToDrive.sensor.data.humidity    );
			if( switchToDrive.sensor.data.battery )
			{
				switchToDrive.info = switchToDrive.info.replace( /\${sensor.data.battery}/g           , switchToDrive.sensor.data.battery   );
				switchToDrive.info = switchToDrive.info.replace( /\${sensor.data.battery:indicator}/g , htmlBatteryIndicator(switchToDrive)   );
			}
		}
	}
	else switchToDrive.info = defaultSwitchInfo;

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
		// START : Manage info field
		var infoTag = '<span id="' + infoId + '">' + switchToDrive.info + '</span>';
		if( switchToDrive.sensor && switchToDrive.sensor.id )	switchesListToAdd += '<a href="sensors/?id=' + switchToDrive.sensor.id + '">' + infoTag + '</a>';
		else													switchesListToAdd += infoTag;
		// END : Manage info field
		switchesListToAdd += '  </h2>';
		switchesListToAdd += '</div>';

		// Insert piece of HTML
		$( switchesListToAdd ).insertBefore( ".row" );

		// Get switch
        var switchObj = $( '#' + switchId );

        // Initialize it <=> update UI display
        switchObj.bootstrapSwitch();

		// Register switch change
        switchObj.on( 'switchChange.bootstrapSwitch', function( event , state )
		{
			// Get switch 'object'
			var switchObj = $( '#' + $(this).attr( "id" ) );

			// Disable switch until post answer
			switchObj.bootstrapSwitch( 'disabled' , true );

			$.post( 'API/set/switch/' ,
			{
				gpioController	        : gpioController,
				controllerOffset	    : controllerOffset,
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

		var switchInfoObj = $('#' + infoId);
		if (switchInfoObj) switchInfoObj.html(switchToDrive.info);
	}
}

function loadUI()
{
	// Load UI only if displayed to user
	if( uiDisplayedToUser )
	{
		//
		// Get JSON configuration file
		//
		$.ajax(
		{
		  url: "data/config.json",
		  dataType: 'json',
		  cache: false,
		  success: function( root )
		  {
			// Hide footer used for error message
			$( '#footer' ).fadeOut( 150 );

			// Store transmitter info
			if (root.gpioController != undefined)
				gpioController = root.gpioController;
			if (root.controllerOffset != undefined)
				controllerOffset = root.controllerOffset;

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
		  	var msgTag = $( '#footer .container' );

			// Set error message
			if( error )
			{
				switch( error )
				{
					case "Not Found" :
                        msgTag.html( '<span data-i18n="error.configurationNotFound">Configuration file not found</span>' );
                        break;
                    case "Unauthorized" :
                        msgTag.html( '<span data-i18n="error.unAuthorized">Unauthorized access</span>' );
                        break;
					default :
                        msgTag.html( '<p>' + textStatus + ": " + error + '</p>' );
				}
            }
			else
                msgTag.html( '<span data-i18n="error.serverCommunication">Server communication error</span>' );

			// Force localization
			msgTag.localize();

			// Display it to user
			$( '#footer' ).fadeIn( 150 );
		  },
		  complete: function(xhr, textStatus)
          {
          	 // Program a new UI refresh
             setTimeout( loadUI , refreshEachMilliSeconds );
          }
		});
	}
}

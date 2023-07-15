var gpioController = "/dev/null";
var controllerOffset = -1;
var projectVersion = "5.0.0";
var sensorsPageVersion = "1.4.0";

var uiDisplayedToUser = true;
var refreshEachMilliSeconds = 5000;

let previousConfig = {
	"switchesList": []
};

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
	// Set version in page title
	$(document).prop( 'title' , projectVersion );
	// Add version in navigation bar
	$( "#cythsTitle" ).text( $( "#cythsTitle" ).text() + " #" + projectVersion );
	// Load user interface
	loadUI();
}

function htmlBatteryIndicator(switchToDrive, outdatedSensorDataClass) {
	let batteryIndicatorClass = "";
	if (outdatedSensorDataClass === "") {
		batteryIndicatorClass += "battery-";
		let battery = switchToDrive.sensor.data.battery;
		switch (true) {
			case (battery === 0):
				batteryIndicatorClass += "alarm";
				break;
			case (battery < 50):
				batteryIndicatorClass += "warning";
				break;
			default:
				batteryIndicatorClass += "ok";
				break;
		}
	}
	return '<span class="' + batteryIndicatorClass + '">•</span>';
}

function trend(switchToDrive, previousSwitchToDrive, type) {
	if (switchToDrive && switchToDrive.sensor && switchToDrive.sensor.data
		&& previousSwitchToDrive && previousSwitchToDrive.sensor && previousSwitchToDrive.sensor.data) {
		let trendClass = type + "-" + switchToDrive.sensor.id;
		let trend = "➙";
		let sensorDate = new Date(switchToDrive.sensor.data.date + 'T' + switchToDrive.sensor.data.time);
		let previousSensorDate = new Date(previousSwitchToDrive.sensor.data.date + 'T' + previousSwitchToDrive.sensor.data.time);
		if (sensorDate > previousSensorDate) {
			let previous = parseFloat(eval("previousSwitchToDrive.sensor.data." + type));
			let current = parseFloat(eval("switchToDrive.sensor.data." + type));
			if (current > previous) {
				trend = "➚";
			} else if (current < previous) {
				trend = "➘";
			}
		} else {
			let trendText = $("." + trendClass).text();
			if (trendText) {
				trend = trendText;
			}
		}
		return '<span class="' + trendClass + '">' + trend + '</span>';
	} else {
		return "";
	}
}

const allInOneViewMode = "allInOneViewMode";
const sensorViewMode = "sensorViewMode";
const switchViewMode = "switchViewMode";

function addSwitch(switchToDrive, previousSwitchToDrive, viewMode) {
	//
	// Define switch id
	//
	var switchId = "switch-";
	// There is no switch to drive, only a sensor attached
	if( switchToDrive.channel == "" && switchToDrive.rcId == "" )	switchId += "sensor-" + switchToDrive.sensor.id;
	else															switchId += switchToDrive.channel + "-" + switchToDrive.rcId;

	let hasSwitchSensor = false;
	let outdatedSensorDataClass = "";
	if (switchToDrive.sensor) {
		hasSwitchSensor = true;
		if (switchToDrive.sensor.data) {
			let currentDate = new Date();
			let sensorDataDate = new Date(switchToDrive.sensor.data.date + 'T' + switchToDrive.sensor.data.time);
			let outdatedSensorDataInMinutes = (currentDate - sensorDataDate) / (60 * 1000);
			if (outdatedSensorDataInMinutes < 6) {
				// Nothing to do : use default empty value
			} else if ( outdatedSensorDataInMinutes < 11) {
				outdatedSensorDataClass = "sensor-data-outdated-level-1";
			} else if (outdatedSensorDataInMinutes < 16) {
				outdatedSensorDataClass = "sensor-data-outdated-level-2";
			} else if (outdatedSensorDataInMinutes < 21) {
				outdatedSensorDataClass = "sensor-data-outdated-level-3";
			} else if (outdatedSensorDataInMinutes < 36) {
				outdatedSensorDataClass = "sensor-data-outdated-level-4";
			} else {
				outdatedSensorDataClass = "sensor-data-outdated-level-last";
			}
		}
	}

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
			if (switchToDrive.sensor.data.temperature) {
				switchToDrive.info = switchToDrive.info.replace(/\${sensor.data.temperature}/g, switchToDrive.sensor.data.temperature);
				switchToDrive.info = switchToDrive.info.replace(/\${sensor.data.temperature:trend}/g, trend(switchToDrive, previousSwitchToDrive, "temperature"));

			}
			if( switchToDrive.sensor.data.humidity ) {
				switchToDrive.info = switchToDrive.info.replace(/\${sensor.data.humidity}/g, switchToDrive.sensor.data.humidity);
				switchToDrive.info = switchToDrive.info.replace(/\${sensor.data.humidity:trend}/g, trend(switchToDrive, previousSwitchToDrive, "humidity"));
			}
			if( switchToDrive.sensor.data.battery )
			{
				switchToDrive.info = switchToDrive.info.replace( /\${sensor.data.battery}/g           , switchToDrive.sensor.data.battery   );
				switchToDrive.info = switchToDrive.info.replace(/\${sensor.data.battery:indicator}/g, htmlBatteryIndicator(switchToDrive, outdatedSensorDataClass));
			}
		}
	}
	else {
		switchToDrive.info = $('#switch-info-default').text();
	}

	var infoId = switchId + "-info-" + viewMode;

	let state;
	let hasSwitchState = true;
	if (switchToDrive.state === "on") {
		state = 'checked';
	} else if (switchToDrive.state === "off") {
		state = '';
	} else {
		state = 'data-indeterminate="true"';
		hasSwitchState = false;
	}

	let switchViewClass;
	if (hasSwitchState && hasSwitchSensor) {
		switchViewClass = sensorViewMode + " " + switchViewMode;
	} else if (hasSwitchSensor) {
		switchViewClass = sensorViewMode;
	} else if (hasSwitchState) {
		switchViewClass = switchViewMode;
	}

	const allInOneView = viewMode === allInOneViewMode;
	const sensorView = viewMode === sensorViewMode && !hasSwitchState && hasSwitchSensor;
	const switchView = viewMode === switchViewMode && hasSwitchState && !hasSwitchSensor;

	var switchObj = $('#' + switchId);
	var switchInfoObj = $('#' + infoId);

	// Add switch if it doesn't exist in the page and following view mode
	if (switchObj.length === 0 && switchInfoObj.length === 0 && (allInOneView || sensorView || switchView)) {
		//
		// Compute piece of HTML to insert
		//
		var switchesListToAdd = '<div class="col-xs-6 col-lg-3 switch ' + switchViewClass + '">';
		switchesListToAdd += '  <h2 class="h4">' + switchToDrive.label + '</h2>';
		switchesListToAdd += '  <p>';
		if (allInOneView || switchView) {
			switchesListToAdd += '    <input id="' + switchId + '"';
			switchesListToAdd += ' name="' + switchId + '" rcId="' + switchToDrive.rcId + '" channel="' + switchToDrive.channel + '" type="checkbox" data-on-color="info" data-off-color="warning" data-size="normal" data-handle-width="50" ';
			switchesListToAdd += state;
			// Disable switch if remote command identifier and channel are empty
			if (switchToDrive.rcId === "" && switchToDrive.channel === "") switchesListToAdd += ' disabled';
			switchesListToAdd += '>';
		}
		switchesListToAdd += '  </p>';
		if (allInOneView || sensorView) {
			switchesListToAdd += '  <h2 class="h6">';
			// START : Manage info field
			var infoTag = '<span id="' + infoId + '">' + switchToDrive.info + '</span>';
			if (switchToDrive.sensor && switchToDrive.sensor.id) {
				switchesListToAdd += '<a class="' + outdatedSensorDataClass + '" href="sensors/?id=' + switchToDrive.sensor.id + '&v=' + sensorsPageVersion + '">' + infoTag + '</a>';
			} else switchesListToAdd += infoTag;
			// END : Manage info field
			switchesListToAdd += '  </h2>';
		}
		switchesListToAdd += '</div>';

		// Insert piece of HTML
		$(switchesListToAdd).insertBefore(".row");

		switchObj = $('#' + switchId);

		// Initialize it <=> update UI display
		switchObj.bootstrapSwitch();

		// Register switch change
		switchObj.on('switchChange.bootstrapSwitch', function (event, state) {
			// Get switch 'object'
			var switchObj = $('#' + $(this).attr("id"));

			// Disable switch until post answer
			switchObj.bootstrapSwitch('disabled', true);

			$.post('API/set/switch/',
				{
					gpioController: gpioController,
					controllerOffset: controllerOffset,
					rcId: $(this).attr("rcId"),
					channel: $(this).attr("channel"),
					state: (state ? "on" : "off")
				}).done(function (data) {
				// Get JSON object
				var response = jQuery.parseJSON(data);

				// Manage error case
				if (response.result == "error") {
					var msg = "ERROR\n";
					msg += response.cmd + "\n";
					msg += response.message;

					// Display command executed and error to the user
					alert(msg);

					// Enable switch to be able to toggle state
					switchObj.bootstrapSwitch('disabled', false);
					// Restore previous switch state with no event called
					switchObj.bootstrapSwitch('toggleState', true);
				}
			}).fail(function (jqxhr, textStatus, error) {
				// Alert user
				alert(textStatus + ": " + error);
			}).always(function () {
				// Enable switch in all cases
				switchObj.bootstrapSwitch('disabled', false);
			});
		});
	} else if (switchObj.length !== 0 && (allInOneView || switchView)
		|| switchInfoObj.length !== 0 && (allInOneView || sensorView)) {
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

		if(switchInfoObj) {
			let parent = switchInfoObj.parent('a');
			if(parent) {
				parent.removeClass();
				parent.addClass(outdatedSensorDataClass);
			}
			switchInfoObj.html(switchToDrive.info);
		}
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
			  if (root.view === undefined || root.view.splitMode === undefined || root.view.splitMode === false) {
				  $.each(root.switchesList, function (index, switchToDrive) {
					  addSwitch(switchToDrive, previousConfig.switchesList[index], allInOneViewMode);
				  });
			  } else {
				  $.each(root.switchesList, function (index, switchToDrive) {
					  addSwitch(switchToDrive, previousConfig.switchesList[index], sensorViewMode);
				  });
				  const delimiter = "delimiter";
				  if ($('.' + sensorViewMode).length > 0 && $('#' + delimiter).length === 0) {
					  $('<div id="' + delimiter + '" class="col-xs-12 col-lg-12"/>').insertBefore(".row");
				  }
				  $.each(root.switchesList, function (index, switchToDrive) {
					  addSwitch(switchToDrive, previousConfig.switchesList[index], switchViewMode);
				  });
			  }
			  previousConfig = root;
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

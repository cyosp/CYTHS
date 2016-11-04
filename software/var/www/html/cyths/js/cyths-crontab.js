var pageVersion = "1.6.1";

// 2016-11-04 V 1.6.1
//   - Use cythsI18n.getLanguage() to get language on 2 characters
// 2016-11-01 V 1.6.0
//   - User can now update a crontab configuration
// 2016-10-31 V 1.5.0
//   - Detect crontab user change
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
	    url: "../../js/jqCron/jqCron." + cythsI18n.getLanguage() + ".js",
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
				crontabsListToAdd += ' <h2 class="h4" rcId="' + switchToDrive.rcId + '" channel="' + switchToDrive.channel + '">' + switchToDrive.label + '</h2>';
				crontabsListToAdd += ' <ul>';

				$.each( switchToDrive.crontab , function( index , entry )
				{
					crontabsListToAdd += '  <li class="cyths-crontab" conf-cron="' + entry.cron + '" conf-state="' + entry.state + '">';

					// Manage state
					crontabsListToAdd += '   <span class="jqCron-container">';
					crontabsListToAdd += '    <span class="jqCron-selector jqCron-selector-1">';
					crontabsListToAdd += '     <span class="jqCron-selector-title cyths-crontab-state">';
					crontabsListToAdd += '      <span data-i18n="crontab.state.' +  entry.state + '" crontab-state="' + entry.state + '">' + entry.state;
					crontabsListToAdd += '      </span>';
					crontabsListToAdd += '     </span>';
					crontabsListToAdd += '     <ul class="jqCron-selector-list cyths-crontab-state-list" style="display: none;">';
					crontabsListToAdd += '      <li><span data-i18n="crontab.state.on" crontab-state="on">on</span></li>';
					crontabsListToAdd += '      <li><span data-i18n="crontab.state.off" crontab-state="off">off</span></li>';
					crontabsListToAdd += '     </ul>';
					crontabsListToAdd += '    </span>';
					crontabsListToAdd += '   </span> ';

					// Manage jqCron
					crontabsListToAdd += '   <span class="lowercase">';
					crontabsListToAdd += '    <input value="' + entry.cron + '" class="cyths-crontab-jqcron" type="hidden"></input>';
					crontabsListToAdd += '   </span>';

					// Manage modified configuration
					crontabsListToAdd += '   <span class="jqCron-container">';
					crontabsListToAdd += '    <span class="jqCron-cross update-cyths-crontab" style="display: none;">✔</span>';
					crontabsListToAdd += '   </span>';

					crontabsListToAdd += '  </li><br/>';
				});

				// End of piece of HTML
				crontabsListToAdd += ' </ul>';
				crontabsListToAdd += '</div>';
	  		}
		});

		// Insert piece of HTML
		$( crontabsListToAdd ).insertAfter( ".row" );

		//
		// Initialize jqCron
		//
		$( '.cyths-crontab-jqcron' ).jqCron(
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
			lang: cythsI18n.getLanguage(),
			bind_method:
			{
				// User has set a value of jqCron
				set: function( $element , cron )
				{
					// Update hidden input
					$element.val( cron );

					// Get CYTHS crontab tag
					var cythsCrontab = $element.parents( ".cyths-crontab" );

					// Get current state
					var state = cythsCrontab.find( ".cyths-crontab-state span" ).attr( "crontab-state" );

					// Get cron and state configured
					var cythsCrontabConfCron  = cythsCrontab.attr( "conf-cron" );
					var cythsCrontabConfState = cythsCrontab.attr( "conf-state" );

					//
					// Hide/display update CYTHS crontab
					//
					var updateCythsCrontab = cythsCrontab.find( ".update-cyths-crontab" );
					if( cron != cythsCrontabConfCron || state != cythsCrontabConfState )	updateCythsCrontab.show();
					else																	updateCythsCrontab.hide();
				}
			}
		});

		// Display/hide available states 
		$( '.cyths-crontab-state' ).click( function()
		{
			$(this).next( ".cyths-crontab-state-list" ).toggle();
		});

		// Manage selected state
		$( '.cyths-crontab-state-list li' ).click( function()
		{
			// Get selected state tag content
			var stateTagSelected = $(this).html();

			// Get selected state
			var state = $(this).children( "span" ).attr( "crontab-state" );

			// Get CYTHS crontab tag
			var cythsCrontab = $(this).parents( ".cyths-crontab" );

			// Get current cron
			var cron = cythsCrontab.find( ".cyths-crontab-jqcron" ).val();

			// Get cron and state configured
			var cythsCrontabConfCron = cythsCrontab.attr( "conf-cron" );
			var cythsCrontabConfState = cythsCrontab.attr( "conf-state" );
			
			// Update UI with state selected
			$(this).parent().prev( ".cyths-crontab-state" ).html( stateTagSelected );

			// Hide state list
			$(this).parent().hide();

			//
			// Hide/display update CYTHS crontab
			//
			var updateCythsCrontab = cythsCrontab.find( ".update-cyths-crontab" );
			if( cron != cythsCrontabConfCron || state != cythsCrontabConfState )	updateCythsCrontab.show();
			else																	updateCythsCrontab.hide();
		});

		// Manage CYTHS crontab update
		$( '.update-cyths-crontab' ).click( function()
		{
			// Get reference to current tag
			var updateCythsCrontabTag = $(this);

			// Hide tag to user
			updateCythsCrontabTag.fadeOut( 200 );

			// Get switch tag
			var switchTag = $(this).parents( "ul" ).prev( "h2" );

			// Get switch remote identifier and channel
			var rcId = switchTag.attr( "rcId" );
			var channel = switchTag.attr( "channel" );

			// Get CYTHS crontab tag
			var cythsCrontab = $(this).parents( ".cyths-crontab" );

			// Get configured cron and state
			var cythsCrontabConfCron  = cythsCrontab.attr( "conf-cron" );
			var cythsCrontabConfState = cythsCrontab.attr( "conf-state" );

			// Get user cron and state
			var userCrontabCron  = cythsCrontab.find( ".cyths-crontab-jqcron" ).val();
			var userCrontabState = cythsCrontab.find( ".cyths-crontab-state span" ).attr( "crontab-state" );
			
			//alert( "Feature not yet implemented.\nRemote identifier: " + rcId + "\nChannel: " + channel + "\nConfigured: " + cythsCrontabConfCron + " " + cythsCrontabConfState + "\nSelected: " + userCrontabCron + " " + userCrontabState );

			// Ask server to change crontab configuration
			$.post( '../../API/set/crontab/' ,
			{
				rcId    		: rcId,
				channel			: channel,
				currentCron		: cythsCrontabConfCron,
				currentState	: cythsCrontabConfState,
				newCron			: userCrontabCron,
				newState		: userCrontabState
			}).done(function( data )
			{
				// Get JSON object
				var response = jQuery.parseJSON( data );
			
				// Manage error case
				if( response.result == "error")
				{
					var msg = "ERROR\n";
					msg += response.message;
				
					// Display error to the user
					alert( msg );
				}
				else
				{
					// Update CYTHS crontab configuration
					// It's to detect a new change performed by user on this crontab
					cythsCrontab.attr( "conf-cron" , userCrontabCron );
					cythsCrontabConfState = cythsCrontab.attr( "conf-state" , userCrontabState );
				}

			}).fail(function(jqxhr, textStatus, error)
			{
				// Allow user to try again
				updateCythsCrontabTag.fadeIn( 0 );

				// Alert user
				alert( textStatus + ": " + error );
			});
		});
	  },
	  error: function(xhr, textStatus, error)
	  {
		  alert( textStatus + ": " + error );
	  }
	});
}


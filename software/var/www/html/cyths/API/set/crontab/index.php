<?php

//
// Author: CYOSP
// Version: 1.0.0
//
// Post arguments:
//  - <rcId> : Remote command identifier (0 -> 67108863)
//  - <channel> : Channel (0 -> 16)
//  - <currentCron> : Cron configured in format: * * * * *
//  - <currentState> : State configured (on|off)
//  - <newCron> : New cron in format: * * * * *
//  - <newState> : New state (on|off)
//
// 2016-11-01 V 1.0.0
//  - First release
//

// Get parameters
$rcId = $_POST['rcId'];
$channel = $_POST['channel'];
$currentCron = $_POST['currentCron'];
$currentState = $_POST['currentState'];
$newCron = $_POST['newCron'];
$newState = $_POST['newState'];

// Check input arguments
if( $rcId != "" && $channel != "" && $currentCron != "" && $currentState != "" && $newCron != "" && $newState != "" )
{
	//
	// Update JSON configuration file
	//
	
	// Get a file pointer to the lock file
	$fp = fopen( "/tmp/cyths.config.sync.lock" , "c" );
	// Lock file for synchronisation
	if( flock( $fp , LOCK_EX ) )
	{	
		// Define path of file to update
		$configFile="../../../data/config.json";
		
		// Get and parse JSON file
		$data = json_decode( file_get_contents( $configFile ) , true );

		// Pause 5 seconds to prove that race condition doesn't exist
		//sleep( 5 );

		//
		// Search switch to update
		//
		foreach( $data['switchesList'] as $switchKey => $switch )
		{
			// Switch to update found
			if( $switch['channel'] == $channel &&  $switch['rcId'] == $rcId )
			{
				foreach( $switch['crontab'] as $crontabKey => $crontab )
				{
					// Crontab to update found
					if( $crontab['cron'] == $currentCron &&  $crontab['state'] == $currentState )
					{
						$data['switchesList'][$switchKey]['crontab'][$crontabKey]['cron'] = $newCron;
						$data['switchesList'][$switchKey]['crontab'][$crontabKey]['state'] = $newState;
					}
				}
			}
		}

		// Update JSON file
		file_put_contents( $configFile , json_encode( $data , JSON_PRETTY_PRINT ) );

		// Release lock file
		flock( $fp , LOCK_UN );
		// Close the lock file
		fclose( $fp );
	}
	else
	{
		$json['result'] = "error";
		$json['message'] = "Fail to lock synchronisation file";
	}

	$json['result'] = "";
	$json['message'] = "";
	
}
else
{
	$json['result'] = "error";
	$json['message'] = "Invalid argument(s)";
}

echo json_encode( $json );

?>

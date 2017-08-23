<?php

//
// Author: CYOSP
// Version: 1.2.0
//
// Post arguments:
//  - <rcId> : Remote command identifier (0 -> 67108863)
//  - <channel> : Channel (0 -> 16)
//  - <emitterWiringPiNumber> : WiringPi transmitter pin number
//  - <state> : Switch state to set (on|off|unknown)
//  - [repeat] : How many times the command must be repeated
//
// 2017-08-23 V 1.2.0
//  - Add optional repeat argument
// 2016-09-30 V 1.1.0
//  - Move possibility to set info field to /API/set/info/
//  - Manage "unknown" state
//    In that case, rc-rsl command is not called
// 2016-07-07 V 1.0.0
//  - First release
//

// Get parameters
$emitterWiringPiNumber = $_POST['emitterWiringPiNumber'];
$rcId = $_POST['rcId'];
$channel = $_POST['channel'];
$state = $_POST['state'];
$repeat = $_POST['repeat'];

// Check input arguments
if( $rcId != "" && $channel != "" && $emitterWiringPiNumber != "" && $state != "" )
{
	if( $state != "unknown" )
	{
		// Define rc-rsl command to execute
		$json['cmd'] = "sudo rc-rsl " . $emitterWiringPiNumber . " " . $rcId . " " . $channel . " " . $state;
        if( $repeat != "" ) $json['cmd'] .= " " . $repeat;

		// Execute command
		$output = shell_exec( $json['cmd'] );
	}
	else	// => $state == "unknown" 
	{
		$json['cmd'] = "";
		$output = "Done\n";
	}
	
	// Execution is ok
	if( strcmp( $output , "Done\n" ) == 0 )
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
			// Search entry to update
			//
			$found = false;
			foreach( $data['switchesList'] as $key => $entry )
			{
				// Entry to update found
				if( $entry['channel'] == $channel &&  $entry['rcId'] == $rcId )
				{
					$found = true;
					$data['switchesList'][$key]['state'] = $state;
				}
			}

			// Add an entry if no one found
			if( ! $found )
			{
				$newValue['label'] = "Unknown";
				$newValue['channel'] = $channel;
				$newValue['rcId'] = $rcId;
				$newValue['state'] = $state;
				$newValue['info'] = "";

				// Add new entry
				array_push( $data['switchesList'] , $newValue );
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
		$json['message'] = $output;
	}
}
else
{
	$json['cmd'] = "";
	$json['result'] = "error";
	$json['message'] = "Invalid argument(s)";
}

echo json_encode( $json );

?>

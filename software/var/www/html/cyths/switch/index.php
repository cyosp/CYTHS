<?php

//
// Author: CYOSP
//
// Post arguments:
//  - <rcId> : Remote command identifier (0 -> 67108863)
//  - <channel> : Channel (0 -> 16)
//  - <emitterWiringPiNumber + state | info>
//     - emitterWiringPiNumber : WiringPi transmitter pin number
//     - state : Switch state to set (on|off)
//     - info : Switch additional info to set (a not empty string)
//
// 2016/07/01 V 1.0.0
//  - First release
//

// Get parameters
$emitterWiringPiNumber = $_POST['emitterWiringPiNumber'];
$rcId = $_POST['rcId'];
$channel = $_POST['channel'];
$state = $_POST['state'];
$info = $_POST['info'];

// Check input arguments
if( $rcId != "" && $channel != "" && ( $emitterWiringPiNumber != "" && $state != "" || $info != "" ) )
{
	// Manage switch state to set
	if( $emitterWiringPiNumber != "" && $state != "" )
	{
		// Define rc-rsl command to execute
		$json['cmd'] = "sudo rc-rsl " . $emitterWiringPiNumber . " " . $rcId . " " . $channel . " " . $state;

		// Execute command
		$output = shell_exec( $json['cmd'] );
	}
	else	// => $info != "" 
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
		$fp = fopen( "/tmp/cyths.switch" , "c" );
		// Lock file for synchronisation
		if( flock( $fp , LOCK_EX ) )
		{	
			// Define path of file to update
			$configFile="../data/config.json";
			
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

					// Update state if needed
					if( $state != "" )	$data['switchesList'][$key]['state'] = $state;
					// Update info if needed
					if( $info != "" )	$data['switchesList'][$key]['info'] = $info;
				}
			}

			// Add an entry if no one found
			if( ! $found )
			{
				$newValue['channel'] = $channel;
				$newValue['rcId'] = $rcId;
				$newValue['state'] = $state;
				$newValue['info'] = $info;

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

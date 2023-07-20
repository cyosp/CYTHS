<?php

//
// Author: CYOSP
// Version: 1.0.1
//
// Post arguments:
//  - <sensorId> : Sensor identifier (1->127)
//  - <info> : Switch additional info to set (a not empty string)
//
// 2017-03-23 V 1.0.1
//  - Update following new configuration file structure
// 2016-09-30 V 1.0.0
//  - First release
//

// Get parameters
$sensorId = $_POST['sensorId'];
$info = $_POST['info'];

// Check input arguments
if( $sensorId != "" && $info != "" )
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
			if( $entry['sensor']['id'] == $sensorId )
			{
				$found = true;
				$data['switchesList'][$key]['info'] = $info;
			}
		}

		// Add an entry if no one found
		if( ! $found )
		{
			// Sub level
			$sensor['id'] = $sensorId;
			// Main level
			$newValue['label'] = "Unknown";
			$newValue['channel'] = "";
			$newValue['rcId'] = "";
			$newValue['state'] = "unknown";
			$newValue['sensor'] = $sensor;
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
	$json['message'] = "Invalid argument(s)";
}

echo json_encode( $json );

?>

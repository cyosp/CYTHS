<?php

//
// Author: CYOSP
// Version: 1.1.0
//
// Post arguments:
//  - <sensorId> : Sensor identifier (1->127)
//  - <date> : Sensor data receiving date (format: YYYY-MM-DD)
//  - <time> : Sensor data receiving time (format: HH:MM:SS)
//  - <temperature> : Sensor temperature (-40.0->62.4)
//  - <humidity> : Sensor humidity (0->100)
//  - [battery] : Sensor battery percentage (0->100)

//
// 2019-01-20 V 1.1.0
//  - Set battery percentage
// 2017-03-24 V 1.0.0
//  - First release
//

// TEST
//  * curl -i --silent --data "sensorId=123&date=2017-03-24&time=22:00:00&temperature=20.0&humidity=60&battery=33" "http://localhost/cyths/API/set/sensor/data/"

// Get parameters
$sensorId = $_POST['sensorId'];
$date = $_POST['date'];
$time = $_POST['time'];
$temperature = $_POST['temperature'];
$humidity = $_POST['humidity'];
$battery = $_POST['battery'];

// Check input arguments
if( $sensorId != "" && $date != "" && $time != "" && $temperature != "" && $humidity != "" )
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
		$configFile="../../../../data/config.json";
		
		// Get and parse JSON file
		$data = json_decode( file_get_contents( $configFile ) , true );

		// Pause 5 seconds to prove that race condition doesn't exist
		//sleep( 5 );

		//
		// Define data to add/update
		//
		$sensorData['date'] = $date;
		$sensorData['time'] = $time;
		$sensorData['temperature'] = $temperature;
		$sensorData['humidity'] = $humidity;
		$sensorData['battery'] = $battery;

		//
		// Search entry to update
		//
		$found = false;
		foreach( $data['switchesList'] as $key => $entry )
		{
			// Entry to update found
			if( $entry['sensor']['id'] == $sensorId )
			{
				// Sensor found
				$found = true;

				// Add/update data
				$sensor['id'] = $sensorId;
				$sensor['data'] = $sensorData;
				$data['switchesList'][$key]['sensor'] = $sensor;
			}
		}

		// Add an entry if no one found
		if( ! $found )
		{
			// Sub level
			$sensor['id'] = $sensorId;
			$sensor['data'] = $sensorData;
			// Main level
			$newValue['label'] = "Unknown";
			$newValue['channel'] = "";
			$newValue['rcId'] = "";
			$newValue['state'] = "unknown";
			$newValue['sensor'] = $sensor;
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
	$json['message'] = "Invalid argument(s)";
}

echo json_encode( $json );

?>

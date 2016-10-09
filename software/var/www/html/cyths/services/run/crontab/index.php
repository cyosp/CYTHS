<?php

//
// Author: CYOSP
// Version: 1.0.0
// Dependencies:
//  - php_curl (sudo apt-get install php5-curl)
//
// 2016-10-09 V 1.0.0
//  - First release
//

// Require CronExpression
// Order is important
require_once '../../../src/Cron/FieldInterface.php';
require_once '../../../src/Cron/AbstractField.php';
require_once '../../../src/Cron/CronExpression.php';
require_once '../../../src/Cron/DayOfMonthField.php';
require_once '../../../src/Cron/DayOfWeekField.php';
require_once '../../../src/Cron/FieldFactory.php';
require_once '../../../src/Cron/HoursField.php';
require_once '../../../src/Cron/MinutesField.php';
require_once '../../../src/Cron/MonthField.php';
require_once '../../../src/Cron/YearField.php';

// Get and parse JSON configuration file
$data = json_decode( file_get_contents( "../../../data/config.json" ) , true );
// Get WiringPi pin number
$emitterWiringPiNumber=$data['emitterWiringPiNumber'];

echo "emitterWiringPiNumber: ".$emitterWiringPiNumber."<br/>";

//
// For each switch
//
foreach( $data['switchesList'] as $i => $switch )
{
	// Check there is a crontab entry
	if( array_key_exists( 'crontab' , $switch ) )
	{
		//
		// For each crontab entry
		//
		foreach( $switch['crontab'] as $j => $cronEntry )
		{
			echo $switch['label'].' - rcId='.$switch['rcId'].', channel='.$switch['channel'].' : '.$cronEntry['cron'].' '. $cronEntry['state'].'<br/>';

			// Setup CronExpression
			$cron = Cron\CronExpression::factory( $cronEntry['cron'] );

			// Cron state must be applied
			if( $cron->isDue() )
			{
				// POST data
				$postData = 'emitterWiringPiNumber='.$emitterWiringPiNumber.'&rcId='.$switch['rcId'].'&channel='.$switch['channel'].'&state='.$cronEntry['state'];

				// Init cURL
				$ch = curl_init( 'http://localhost'.dirname($_SERVER['SCRIPT_NAME']).'/../../../API/set/switch/' );
				curl_setopt( $ch , CURLOPT_POST           , 1         );
				curl_setopt( $ch , CURLOPT_POSTFIELDS     , $postData );
				curl_setopt( $ch , CURLOPT_HEADER         , 0         );
				curl_setopt( $ch , CURLOPT_RETURNTRANSFER , 1         );

				// Execute POST request
				$response = curl_exec( $ch );

				// Display response
				echo $response."<br/>";
			}
		}
	}
}
?>

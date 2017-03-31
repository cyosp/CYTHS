<?php

//
// Author: CYOSP
// Version: 1.2.1
//
// Dependencies:
//  - php_curl (sudo apt-get install php5-curl)
//
// 2017-03-31 V 1.2.1
//  - Fix: PHP parse error
// 2017-03-29 V 1.2.0
//  - Manage crontab condition
// 2016-12-27 V 1.1.0
//  - Manage new crontab disabled state
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

			// There is a state to manage
			if( $cronEntry['state'] != "disabled" )
			{
				// Setup CronExpression
				$cron = Cron\CronExpression::factory( $cronEntry['cron'] );

				// Cron state must be applied
				if( $cron->isDue() )
				{
					// By default crontab condition is assuming true
					// It allows to execute crontab when there is no condition
					$cronCondition = true;

					// Check there is a crontab condition
					if( array_key_exists( 'condition' , $cronEntry ) && $cronEntry['condition'] != "" )
					{
						// Execute node.js script to verify crontab condition
						$output = shell_exec( 'export NODE_PATH="$(npm root -g)"; nodejs crontab-condition.js ' . $i . " " . $j ." 2>&1 >/dev/null; echo $?" );

						// Analyze execution to know crontab condition value
						if( strcmp( $output , "0\n" ) != 0 )	$cronCondition = false;
					}

					if( $cronCondition )
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
	}
}
?>

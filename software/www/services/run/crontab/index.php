<?php
// Dependencies:
//  - php_curl (sudo apt install php8-curl)

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

require_once '../../../src/JSONPath/load.php';

use Flow\JSONPath\JSONPath;

// Get and parse JSON configuration file
$data = json_decode(file_get_contents("../../../data/config.json"), true);
// Get transmitter info
$gpioController = $data['gpioController'];
$controllerOffset = $data['controllerOffset'];

echo date('Y-m-d H:i:s') . " " . $gpioController . "#" . $controllerOffset . "<br/>";

//
// For each switch
//
foreach ($data['switchesList'] as $i => $switch) {
    // Check there is a crontab entry
    if (array_key_exists('crontab', $switch)) {
        //
        // For each crontab entry
        //
        foreach ($switch['crontab'] as $j => $cronEntry) {
            echo " * " . $switch['label'] . ' - rcId=' . $switch['rcId'] . ', channel=' . $switch['channel'] . ' : ' . $cronEntry['cron'] . ' ' . $cronEntry['state'] . '<br/>';

            // There is a state to manage
            if ($cronEntry['state'] != "disabled") {
                // Setup CronExpression
                $cron = Cron\CronExpression::factory($cronEntry['cron']);

                // Cron state must be applied
                if ($cron->isDue()) {
                    // By default crontab condition is assuming true
                    // It allows to execute crontab when there is no condition
                    $cronCondition = true;

                    // Check there is a crontab condition
                    if (array_key_exists('condition', $cronEntry) && $cronEntry['condition'] != "") {
                        $condition = explode(":", $cronEntry['condition']);

                        $leftCondition = $condition[0];
                        $leftConditionEvaluated = (new JSONPath($data))->find($leftCondition)->getData()['0'];

                        $rightCondition = $condition[1];
                        $conditionToEvaluate = $leftConditionEvaluated . $rightCondition;

                        $conditionEvaluation = eval("return " . $conditionToEvaluate . ";");
                        if ($conditionEvaluation != 1) {
                            $conditionValue = false;
                        }
                    }

                    if ($cronCondition) {
                        // POST data
                        $postData = 'gpioController=' . $gpioController . '&controllerOffset=' . $controllerOffset . '&rcId=' . $switch['rcId'] . '&channel=' . $switch['channel'] . '&state=' . $cronEntry['state'];

                        // Init cURL
                        $ch = curl_init('http://localhost' . dirname($_SERVER['SCRIPT_NAME']) . '/../../../API/set/switch/');
                        curl_setopt($ch, CURLOPT_POST, 1);
                        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
                        curl_setopt($ch, CURLOPT_HEADER, 0);
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

                        // Execute POST request
                        $response = curl_exec($ch);

                        // Display response
                        echo $response . "<br/>";
                    }
                }
            }
        }
        echo "<br/>";
    }
}
?>

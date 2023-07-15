<!DOCTYPE html>
<body>
<center>
    <h2>Crontab condition test</h2>
    <table border="1">
        <tr>
            <th>Test</th>
            <th>Value</th>
        </tr>
        <?php
        $data = json_decode('{"switchesList":[{"sensor":{"id":"71","data":{"humidity":"76"}}},{"crontab":[{"condition":"$..switchesList[*][?(@.id==71)].data.humidity : > 75"}]}]}', true);
        $cronEntry = $data['switchesList'][1]['crontab'][0];
        echo "<tr><td>Condition</td><td>" . $cronEntry['condition'] . "</td></tr>";

        $conditionValue = true;

        require_once '../../../../cyths/src/JSONPath/load.php';

        use Flow\JSONPath\JSONPath;

        $condition = explode(":", $cronEntry['condition']);

        $leftCondition = $condition[0];
        echo "<tr><td>Left condition</td><td>" . $leftCondition . "</td></tr>";

        $leftConditionEvaluated = (new JSONPath($data))->find($leftCondition)->getData()['0'];
        echo "<tr><td>Left condition evaluated</td><td>" . $leftConditionEvaluated . "</td></tr>";

        $rightCondition = $condition[1];
        $conditionToEvaluate = $leftConditionEvaluated . $rightCondition;
        echo "<tr><td>Condition to evaluate</td><td>" . $conditionToEvaluate . "</td></tr>";

        $conditionEvaluation = eval("return " . $conditionToEvaluate . ";");
        if ($conditionEvaluation != 1) {
            $conditionValue = false;
        }
        echo "<tr><td>Condition value</td><td>" . ($conditionValue ? "true" : "false") . "</td></tr>";
        ?>
    </table>
</center>
</body>

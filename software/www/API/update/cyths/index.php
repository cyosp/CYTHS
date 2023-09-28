<?php
// TEST
//  * curl -X POST "http://localhost/API/update/cyths?code=2409803382&updatedAt=2023-07-21T10:53:34"

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    parse_str(parse_url("http://localhost/$_SERVER[REQUEST_URI]")['query'], $query);

    $codes = explode(",", $query['code']);
    $dates = explode(",", $query['updatedAt']);
    $sizeOfCodes = sizeof($codes);
    if ($sizeOfCodes == sizeof($dates)) {
        $badRequest = false;
        for ($i = 0; $i < $sizeOfCodes; $i++) {
            if ($codes[$i] == "" || $dates[$i] == "") {
                $badRequest = true;
            }
        }

        if ($badRequest) {
            http_response_code(400);
            $json['result'] = "error";
            $json['message'] = "Empty value not allowed";
        } else {
            $hasError = false;
            $errorMessage = "";
            for ($i = 0; $i < $sizeOfCodes; $i++) {
                $output = shell_exec("cyths-update " . $codes[$i] . " " . $dates[$i] . " 2>&1; echo $?");
                if ($output != 0) {
                    $hasError = true;
                    if (empty($errorMessage)) {
                        $errorMessage = $output;
                    } else {
                        $errorMessage .= " " . $output;
                    }
                }
            }

            if ($hasError) {
                http_response_code(500);
                $json['result'] = "error";
                $json['message'] = $errorMessage;
            } else {
                $json['result'] = 'OK';
            }
        }
    } else {
        http_response_code(400);
        $json['result'] = "error";
        $json['message'] = "Mismatch between size of lists";
    }
} else {
    http_response_code(400);
    $json['result'] = "error";
    $json['message'] = "Bad request";
}

echo json_encode($json);

?>

<?php
// TEST
//  * curl -X POST "http://localhost/API/update/cyths?code=2409803382&updatedAt=2023-07-21T10:53:34"

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    parse_str(parse_url("http://localhost/$_SERVER[REQUEST_URI]")['query'], $query);

    $code = $query['code'];
    $updatedAt = $query['updatedAt'];
    if ($code != "" && $updatedAt != "") {
        $output = shell_exec("cyths-update " . $code . " " . $updatedAt . " 2>&1; echo $?");
        if ($output == 0) {
            $json['result'] = 'OK';
        } else {
            http_response_code(500);
            $json['result'] = "error";
            $json['message'] = $output;
        }
    } else {
        http_response_code(400);
        $json['result'] = "error";
        $json['message'] = "Invalid argument(s)";
    }
} else {
    http_response_code(400);
    $json['result'] = "error";
    $json['message'] = "Bad request";
}

echo json_encode($json);

?>

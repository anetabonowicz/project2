<?php

    ini_set("display_errors", "On");
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    include "config.php";

    header("Content-Type: application/json; charset=UTF-8");


    $conn = new mysqli(
        $cd_host,
        $cd_user,
        $cd_password,
        $cd_dbname,
        $cd_port,
        $cd_socket
    );

    if (mysqli_connect_errno()) {

        $output["status"]["code"] = "300";
        $output["status"]["name"] = "failure";
        $output["status"]["description"] = "database unavailable";
        $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output["data"] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit();

    }

    $query = $conn->prepare('SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, 
                            d.name as department, l.name as location 
                            FROM personnel p 
                            LEFT JOIN department d ON (p.departmentID = d.id) 
                            LEFT JOIN location l ON (d.locationID = l.id)
                            WHERE d.id = ? OR l.id = ?');


    $query->bind_param("ii", $_REQUEST['department'], $_REQUEST['location']);

    $query->execute();

    if(false === $query) {

        $output["status"]["code"] = "400";
        $output["status"]["name"] = "executed";
        $output["status"]["description"] = "query failed";
        $output["data"] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit();

    }

    $result = $query->get_result();

    $personnel = [];


    while ($row = mysqli_fetch_assoc($result)) {
        array_push($personnel, $row);
    }

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output["data"]["personnel"] = $personnel;

    mysqli_close($conn);

    echo json_encode($output);

?>
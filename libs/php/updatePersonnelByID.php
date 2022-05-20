
<?php
    
	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$connection = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($connection);

		echo json_encode($output);

		exit;

	}	

	$query = $connection->prepare('UPDATE personnel SET firstName = ?, lastName = ?, email = ?, jobTitle = ?, departmentID = ? WHERE id = ?');

	$query->bind_param("ssssii", $_REQUEST['firstName'], $_REQUEST['lastName'], $_REQUEST['email'], $_REQUEST['jobTitle'], $_REQUEST['department'], $_REQUEST['id']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($connection);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($connection);

	echo json_encode($output); 

    /*
    $executionStartTime = microtime(true);

    header('Content-Type: application/json; charset=UTF-8');

    include("config.php");

    $connection = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($connection);

        echo json_encode($output);

        exit;

    }	

    $id = $_POST['id'];
    $lastName = $_POST['lastName'];
    $firstName = $_POST['firstName'];
    $jobTitle = $_POST['jobTitle'];
    $email = $_POST['email'];
    #$department = $_POST['department'];

    $query = "UPDATE personnel SET lastName='$lastName', firstName='$firstName', jobTitle='$jobTitle', email='$email' WHERE id='$id'";


    $result = $connection->query($query);

    
	if (!$result) {

        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";	
        $output['data'] = [];

        mysqli_close($connection);

        echo json_encode($output); 

        exit;

    }
  

    //$result = $query->get_result();
  

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($connection);

    echo json_encode($output); 
*/
?>
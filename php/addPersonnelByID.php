
<?php

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

	if ($_SERVER["REQUEST_METHOD"] == "POST") {

		if (empty($_POST["firstName"])) {
			$err = "This field is required";
		  } else {
			$firstName = $_POST['firstName'];
		  }

		if (empty($_POST["lastName"])) {
			$err = "This field is required";
		  } else {
			$lastName = $_POST['lastName'];
		  }

		if (empty($_POST["email"])) {
			$err = "This field is required";
		} else {
			$email = $_POST['email'];
		}
		
		
		$jobTitle = $_POST['jobTitle'];
		$department = $_POST['department'];
	}

	$query = 'INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES ("' . $firstName . '", "' . $lastName . '", "' . $jobTitle . '", "' . $email . '", "' . $department . '")';
 
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

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($connection);

	echo json_encode($output); 

?>
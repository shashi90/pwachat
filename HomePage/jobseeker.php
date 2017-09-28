<?php
	if ($_SERVER['REQUEST_METHOD']=='GET' || !isset($_SERVER['HTTP_REFERER'])) {
		echo 'Permission Denied';
		die( 'Permission Denied' );
	}
	$con = mysql_connect('localhost', 'fnbusers', 'Agent47!');
	if(!$con) {
		echo "con" + mysql_error();
		die('Could not connect: ' . mysql_error());
	}

	$db = mysql_select_db("F&B", $con);
	if(!$db) {
		echo mysql_error();
		die('Could not connect: ' . mysql_error());
	}
	$firstName = $_POST['firstName'];
	$lastName = $_POST['lastName'];
	$email = $_POST['email'];
	$phone = $_POST['phone'];
	$gender = $_POST['gender'];
	$preferredJobs = implode(",", $_POST['preferredJobs']);
	$currentSalary = $_POST['currentSalary'];
	$desiredSalary = $_POST['desiredSalary'];
	$educationLevel = $_POST['highestEducation'];
	$course = $_POST['course'];
	$preferredLocations = implode(",", $_POST['preferredLocations']);
	
	$query = "INSERT INTO JobSeekers (firstName, lastName, gender, email, phoneNo, preferredJobs, currentSalary, desiredSalary, educationLevel, course, preferredLocation) VALUES ('$firstName', '$lastName', '$gender', '$email', '$phone', '$preferredJobs', '$currentSalary', '$desiredSalary', '$educationLevel', '$course', '$preferredLocations')";
	
	$result = mysql_query($query);
	if(!$result) {
		echo mysql_error();
		die('Could not connect: ' . mysql_error());
	} else {
		echo "Inserted Successfully";
	}
	mysql_close($con);
?>
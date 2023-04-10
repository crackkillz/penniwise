<?php
// Replace this with your database credentials
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "database_name";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get the form data
$campaign_balance = $_POST['campaign_balance'];
$user_id = $_POST['user_id'];

// Update the campaign balance in the database
$sql = "UPDATE users SET campaign_balance = '$campaign_balance' WHERE id = '$user_id'";
if ($conn->query($sql) === TRUE) {
  echo "Campaign balance updated successfully.";
} else {
  echo "Error updating campaign balance: " . $conn->error;
}

$conn->close();
?>

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

// Query the database for the campaign balance
$sql = "SELECT campaign_balance FROM users WHERE id = 1"; // Replace "users" with your table name and "id" with the user ID of the currently logged in user
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // Output the campaign balance value
  $row = $result->fetch_assoc();
  $campaign_balance = $row["campaign_balance"];
  echo "<script>var balance = " . $campaign_balance . ";</script>";
} else {
  echo "No campaign balance found.";
}

$conn->close();
?>

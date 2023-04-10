<?php

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['song'])) {

  // Define some constants for file upload
  define('UPLOAD_DIR', 'path/to/upload/directory/');
  define('MAX_FILE_SIZE', 10000000); // 10MB

  // Get the uploaded file information
  $file_name = $_FILES['song']['name'];
  $file_size = $_FILES['song']['size'];
  $file_tmp = $_FILES['song']['tmp_name'];
  $file_type = $_FILES['song']['type'];

  // Check if the file is of an allowed type
  $allowed_types = array('audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/x-pn-wav', 'audio/ogg');
  if (!in_array($file_type, $allowed_types)) {
    echo 'Sorry, only MP3, WAV, and OGG files are allowed.';
    exit();
  }

  // Check if the file size is within the allowed limit
  if ($file_size > MAX_FILE_SIZE) {
    echo 'Sorry, the file size must be less than 10MB.';
    exit();
  }

  // Generate a unique file name for the uploaded file
  $file_name_parts = explode('.', $file_name);
  $file_ext = end($file_name_parts);
  $file_name = uniqid('song_') . '.' . $file_ext;

  // Upload the file to the server
  $upload_path = UPLOAD_DIR . $file_name;
  if (!move_uploaded_file($file_tmp, $upload_path))

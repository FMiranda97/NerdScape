<?php
session_start();

$result = array('error' => array(), 'status' => "Success");

if (!isset($_SESSION['username'])) {
    array_push($result['error'], "Not logged in.");
}

if (!isset($_POST['level_name'])) {
    array_push($result['error'], "No name argument.");
}

if (!isset($_POST['level_info'])) {
    array_push($result['error'], "No level info.");
}

if (count($result['error']) == 0) {
    $db = mysqli_connect('localhost', 'root', '', 'registration');
    $level_name = mysqli_real_escape_string($db, $_POST['level_name']);
    $level_info = mysqli_real_escape_string($db, $_POST['level_info']);
    $username = mysqli_real_escape_string($db, $_SESSION['username']);

    $check_query = "SELECT * FROM levels WHERE name='$level_name' AND user_name='$username' LIMIT 1";
    $query_result = mysqli_query($db, $check_query);
    if ($row = $query_result->fetch_row()) {
        array_push($result['error'], "User already has a level with this name.");
    }
}

if (count($result['error']) == 0) {
    $insert_query = "INSERT INTO levels(name, level_info, user_name) values ('$level_name', '$level_info', '$username')";
    mysqli_query($db, $insert_query);
} elseif (count($result['error']) == 1 && $row && isset($_POST['overwrite']) && $_POST['overwrite'] == 'ok') {
    $replace_query = "UPDATE levels SET level_info = '$level_info' WHERE name='$level_name' AND user_name='$username'";
    mysqli_query($db, $replace_query);
} elseif (count($result['error']) == 1 && $row && isset($_POST['overwrite']) && $_POST['overwrite'] == 'unchecked') {
    $result['status'] = "NeedConfirmation";
} else {
    $result['status'] = "Failed";
}

echo json_encode($result);
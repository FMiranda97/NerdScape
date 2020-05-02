<?php

$results = array('status' => 'success', 'level_data' => '');

$db = mysqli_connect('localhost', 'root', '', 'registration');
$query = "SELECT level_info, id from levels where name = 'Main Game Level $_POST[level]' and user_name = 'Admin'";
$qr = mysqli_query($db, $query);

if($row = $qr->fetch_assoc()){
    $results['level_data'] = $row['level_info'];
    $results['id'] = $row['id'];
}else{
    $results['status'] = "failure";
}

echo json_encode($results);
<?php

$results = array('status' => 'success', 'level_data' => '');

include("connect.php");
if($db){
    $query = "SELECT level_info, id from levels where name = 'Main Game Level $_POST[level]' and user_name = 'Admin'";
    $qr = mysqli_query($db, $query);
    if($qr){
        if($row = $qr->fetch_assoc()){
            $results['level_data'] = $row['level_info'];
            $results['id'] = $row['id'];
        }else{
            $results['status'] = "failure";
        }
    }
}else{
    $results['status'] = "Failure";
}

echo json_encode($results);
<?php
session_start();
$result = array('status'=>'Success', 'sprites'=>array());
$db = mysqli_connect('localhost','root', '', 'registration');
$query = "SELECT image_name FROM sprite WHERE user_name = '$_SESSION[username]' AND type = '$_POST[type]'";
$query_result = mysqli_query($db, $query);
if($query_result){
    while($row = $query_result->fetch_assoc()){
        array_push($result['sprites'], $row['image_name']);
    }
}else{
    $result['status'] = 'Failed';
}

echo json_encode($result);
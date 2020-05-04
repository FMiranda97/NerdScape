<?php


session_start();
$db = mysqli_connect('localhost', 'root', '', 'registration');
$response = array("status"=>"Success", "save"=>"");

if(isset($_SESSION['username'])){
    $username = mysqli_real_escape_string($db, $_SESSION['username']);
    $query = "SELECT save_game FROM users WHERE username = '$username'";
    $result = mysqli_query($db, $query);
    if($result){
        $row = $result->fetch_assoc();
        $response['save'] = $row['save_game'];
    }else {
        $response['status'] = "Failure";
    }
}else{
    $response['status'] = "Failure";
}

echo json_encode($response);
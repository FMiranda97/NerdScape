<?php


session_start();
include("connect.php");

if($db && isset($_SESSION['username']) && isset($_POST['save'])){
    $username = mysqli_real_escape_string($db, $_SESSION['username']);
    $save = mysqli_real_escape_string($db, $_POST['save']);
    $query = "UPDATE users SET save_game = '$save' WHERE username = '$username'";
    if(mysqli_query($db, $query)) {
        echo json_encode("Failure");
    }else {
        echo json_encode("Success");
    };
}else{
    echo json_encode("Failure");
}
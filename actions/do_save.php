<?php


session_start();
$db = mysqli_connect("localhost", "root", "", "registration");

if(isset($_SESSION['username']) && isset($_POST['save'])){
    $username = mysqli_real_escape_string($db, $_SESSION['username']);
    $save = mysqli_real_escape_string($db, $_POST['save']);
    $query = "UPDATE users SET save_game = '$save' WHERE username = '$username'";
    mysqli_query($db, $query);
    echo json_encode("Success");
}else{
    echo json_encode("Failure");
}
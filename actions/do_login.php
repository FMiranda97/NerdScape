<?php
session_start();
// initializing variables
$username = "";
$email = "";
$errors = array();

// connect to the database
include("connect.php");

if(!$db){
    array_push($errors, "Server unreachable. Try again later.");
    return;
}

if (isset($_POST['login_user'])) {
    $username = mysqli_real_escape_string($db, $_POST['username']);
    $password = mysqli_real_escape_string($db, $_POST['password']);

    if (empty($username)) {
        array_push($errors, "Username is required");
    }
    if (empty($password)) {
        array_push($errors, "Password is required");
    }

    if (count($errors) == 0) {
        $password = md5($password);
        $query = "SELECT * FROM users WHERE (username='$username' OR email ='$username') AND password_hash='$password'";
        $results = mysqli_query($db, $query);
        if (mysqli_num_rows($results) == 1) {
            $_SESSION['username'] = $username;
            $_SESSION['success'] = "You are now logged in";
            header('location: NerdScape.php');
        } else {
            array_push($errors, "Wrong username/password combination");
        }
    }
}

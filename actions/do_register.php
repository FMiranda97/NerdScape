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

// REGISTER USER
if (isset($_POST['reg_user'])) {
    //prepare variables for use with SQL
    $username = mysqli_real_escape_string($db, $_POST['username']);
    $email = mysqli_real_escape_string($db, $_POST['email']);
    $password_1 = mysqli_real_escape_string($db, $_POST['password']);
    $password_2 = mysqli_real_escape_string($db, $_POST['cpassword']);

    // check for empty fields
    if (empty($username)) {
        array_push($errors, "Username is required");
    }
    if (empty($email)) {
        array_push($errors, "Email is required");
    }
    if (empty($password_1)) {
        array_push($errors, "Password is required");
    }
    if ($password_1 != $password_2) {
        array_push($errors, "The two passwords do not match");
    }

    // check if user exists in database
    $user_check_query = "SELECT * FROM users WHERE username='$username' OR email='$email' LIMIT 1";
    $result = mysqli_query($db, $user_check_query);

    if ($result) { // if user exists
        $user = mysqli_fetch_assoc($result);
        if ($user && $user['username'] === $username) {
            array_push($errors, "Username already exists");
        }

        if ($user && $user['email'] === $email) {
            array_push($errors, "email already exists");
        }
    }

    // register user if there are no errors in the form
    if (count($errors) == 0) {
        $password = md5($password_1);//hash the password before saving in the database

        $query = "INSERT INTO users (username, email, password_hash) VALUES('$username', '$email', '$password')";
        if(mysqli_query($db, $query)){
            $_SESSION['username'] = $username;
            $_SESSION['success'] = "You are now logged in";
            header('location: NerdScape.php');
        }else{
            array_push($errors, "Failed to register. Try again later.");
        }
    }
}
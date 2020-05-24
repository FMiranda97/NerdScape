<?php

$db = mysqli_connect('localhost', 'root', '', 'registration');
//check if must vote
if($db && isset($_GET['up']) || isset($_GET['down'])){
    $username = mysqli_real_escape_string($db, $_SESSION['username']);
    if(isset($_GET['up'])){
        $vote = 1;
        $level = $_GET['up'];
    }else {
        $vote = -1;
        $level = $_GET['down'];
    }
    //check if vote already in place
    $query = "SELECT * from votes where user_name = '$username' AND level_id = $level";
    $result = mysqli_query($db, $query);
    if($result && $result->fetch_assoc()){
        $query = "UPDATE votes SET vote = $vote WHERE user_name = '$username' AND level_id = $level";
    }else{
        $query = "INSERT INTO votes(user_name,level_id, vote) values('$username', $level, $vote)";
    }
    if($result){
        mysqli_query($db, $query);
    }
}

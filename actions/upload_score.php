<?php
session_start();
include("connect.php");
if(!$db){
    return;
}
$time = $_POST['beat_time'];
$money =  $_POST['money'];
$kills = $_POST['body_count'];
$level = $_POST['level_id'];
$username = mysqli_real_escape_string($db, $_SESSION['username']);

$query = "INSERT INTO score(completion_time, collected_coins, enemies_killed, level_id, user_name) VALUES ($time, $money, $kills, $level, '$username')";
$result = mysqli_query($db, $query);
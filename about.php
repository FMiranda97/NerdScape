<?php
include('actions/check_login.php');
include('actions/do_logout.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>NerdScape - About</title>

    <meta charset="utf-8">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/navbar.css">
    <link rel="stylesheet" type="text/css" href="css/table.css">
</head>


<body>
    <div class="topnav">
        <a href="NerdScape.php">Main Game</a>
        <a href="levelDesigner.php">Level Designer</a>
        <a href="levelExplorer.php">Level Explorer</a>
        <a href="scoreboards.php">Scoreboards</a>
        <a class="active">About</a>
        <a class="logout" href="?logout='1'">Log out</a>
    </div>
    <br>
    Some content here
</body>
</html>

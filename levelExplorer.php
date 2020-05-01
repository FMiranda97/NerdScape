<?php
include('actions/check_login.php');
include('actions/do_logout.php')
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>NerdScape</title>

    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/navbar.css">
</head>


<body>
    <div class="topnav">
        <a href="NerdScape.php">Main Game</a>
        <a href="levelDesigner.php">Level Designer</a>
        <a class="active">Level Explorer</a>
        <a href="#scoreboard">Scoreboards</a>
        <a href="#about">About</a>
        <a class="logout" href="?logout='1'">Log out</a>
    </div>
    <br>

    <canvas id="canvas" width="800" height="450" style="display: block; margin: auto; background: #dddddd"></canvas>
    <audio id = "music" autoplay loop>
        <source src="resources/sounds/tricana.mp3">
    </audio>
    <br>

<!--TODO get proper table CSS-->
    <table style="width: 100%">
        <tr>
            <th>Level name</th>
            <th>Creator</th>
            <th>Upvotes</th>
            <th>Downvotes</th>
        </tr>
    </table>
</body>
</html>
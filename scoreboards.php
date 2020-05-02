<?php
include('actions/check_login.php');
include('actions/do_logout.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>NerdScape - Scoreboards</title>

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
        <a class="active">Scoreboards</a>
        <a href="#about">About</a>
        <a class="logout" href="?logout='1'">Log out</a>
    </div>
    <br>

    <!--    level explorer filters-->
    <form method="get">
        <label>Search:
            <input type="text" name="search">
        </label>
        <label>
            <input type="radio" name = "param" value="Name" checked>
            Name
        </label>
        <label>
            <input type="radio" name = "param" value="Creator">
            Creator
        </label>
        <label>
            <input type="radio" name = "param" value="Player">
            Player
        </label>
        <input type="submit" value="Search">
    </form>

    <form action="scoreboards.php" method="get" id="level_selector" name="select">
        <table>
            <tr>
                <th><a href="?sort=name">Level name</a></th>
                <th><a href="?sort=creator">Creator</a></th>
                <th><a href="?sort=player">Player</a></th>
                <th><a href="?sort=time">Time</a></th>
                <th><a href="?sort=money">Money</a></th>
                <th><a href="?sort=kills">Kills</a></th>
            </tr>
            <?php include("page_complements/scores_table.php") ?>
        </table>
    </form>
</body>
</html>
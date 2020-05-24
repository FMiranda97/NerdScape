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
    <div class = "instrucoes">
        Instructions:<br>
        Before you start make sure to enter the shop and buy jumping as your first skill.<br>
        In game, move with AWD or arrow keys.<br>
        As you unlock skills you may be able to interact with in-game objects pressing F.<br>
        Once you learn to use your lantern you can shoot it by pointing and clicking with your mouse.<br>
        The game will auto-save whenever you finish a level.<br>
        You can save your settings anytime by clicking the save button in the main menu.<br>
        Have fun and stay the **** home.
    </div>

    <div class = "footer">
        NerdScape
        <br>
        Multimédia 2019/2020<br>
        <br>
        Autors:<br>
        Francisco Miranda<br>
        Diogo Cruz<br>
        Inês Mendes<br>
    </div>

</body>
</html>

<?php
include('actions/check_login.php');
include('actions/do_logout.php');
if(isset($_GET['edit'])){header('location: levelDesigner.php?edit=' . $_GET['edit']);}
?>

<!--TODO define AJAX on error-->

<!DOCTYPE html>
<html lang="en">
<head>
    <title>NerdScape</title>

    <meta charset="utf-8">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

    <link rel="stylesheet" type="text/css" href="css/navbar.css">
    <!--	components-->
    <script type="text/javascript" src="js/components/Component.js" defer></script>
    <script type="text/javascript" src="js/components/Flag.js" defer></script>
    <script type="text/javascript" src="js/components/Portal.js" defer></script>
    <script type="text/javascript" src="js/components/Coin.js" defer></script>
    <script type="text/javascript" src="js/components/Chest.js" defer></script>

    <!--	enemies-->
    <script type="text/javascript" src="js/enemies/Enemy.js" defer></script>
    <script type="text/javascript" src="js/enemies/Sniper.js" defer></script>
    <script type="text/javascript" src="js/enemies/Repeater.js" defer></script>
    <script type="text/javascript" src="js/enemies/Randomizer.js" defer></script>
    <script type="text/javascript" src="js/enemies/Projectile.js" defer></script>
    <script type="text/javascript" src="js/enemies/Movement.js" defer></script>

    <!--	player-->
    <script type="text/javascript" src="js/components/Player.js" defer></script>

    <!--	menus-->
    <script type="text/javascript" src="js/menus/MenuComponent.js" defer></script>
    <script type="text/javascript" src="js/menus/MainMenu.js" defer></script>
    <script type="text/javascript" src="js/menus/LevelStartMenu.js" defer></script>
    <script type="text/javascript" src="js/menus/LevelOverMenu.js" defer></script>
    <script type="text/javascript" src="js/menus/LevelSelectionMenu.js" defer></script>
    <script type="text/javascript" src="js/menus/OptionsMenu.js" defer></script>
    <script type="text/javascript" src="js/menus/ShopMenu.js" defer></script>
    <script type="text/javascript" src="js/menus/ShopSkill.js" defer></script>

    <!--	engines-->
    <script type="text/javascript" src="js/engines/Engine.js" defer></script>
    <script type="text/javascript" src="js/engines/NerdScape.js" defer></script>
    <script type="text/javascript" src="js/engines/User.js" defer></script>
    <script type="text/javascript" src="js/engines/Level.js" defer></script>
    <script type="text/javascript" src="js/engines/Editor.js" defer></script>
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
    <audio id="music" autoplay loop>
        <source src="resources/sounds/tricana.mp3">
    </audio>
    <br>

    <form action="levelExplorer.php" method = "get" id = "level_selector" name = "select">
        <!--TODO get proper table CSS-->
        <!--TODO assign action to button presses-->
        <table style="width: 100%; text-align: center">
            <tr>
                <th>Level name</th>
                <th>Creator</th>
                <th>Upvotes</th>
                <th>Downvotes</th>
                <th>Actions</th>
            </tr>
            <?php include("page_complements/levels_table.php") ?>
        </table>
    </form>
</body>
</html>
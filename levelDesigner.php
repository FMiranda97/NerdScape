<?php
include('actions/check_login.php');
include('actions/do_logout.php')
?>

<!DOCTYPE html>

<html lang="en">

<head>
    <title>NerdScape - Level Designer</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

    <meta charset="utf-8">
    <script type="text/javascript" src="js/engines/Engine.js" defer></script>
    <script type="text/javascript" src="js/engines/levelDesigner.js" defer></script>
    <script type="text/javascript" src="js/components/Component.js" defer></script>
    <script type="text/javascript" src="js/enemies/Enemy.js" defer></script>
    <script type="text/javascript" src="js/enemies/Sniper.js" defer></script>
    <script type="text/javascript" src="js/enemies/Repeater.js" defer></script>
    <script type="text/javascript" src="js/enemies/Randomizer.js" defer></script>
    <script type="text/javascript" src="js/enemies/Projectile.js" defer></script>
    <script type="text/javascript" src="js/components/Player.js" defer></script>
    <script type="text/javascript" src="js/components/Flag.js" defer></script>
    <script type="text/javascript" src="js/components/Portal.js" defer></script>
    <script type="text/javascript" src="js/components/Coin.js" defer></script>
    <script type="text/javascript" src="js/engines/Level.js" defer></script>
    <script type="text/javascript" src="js/engines/Editor.js" defer></script>
    <script type="text/javascript" src="js/enemies/Movement.js" defer></script>
    <script type="text/javascript" src="js/components/Chest.js" defer></script>

    <link rel="stylesheet" type="text/css" href="css/common.css">
    <link rel="stylesheet" type="text/css" href="css/levelDesigner.css">
    <link rel="stylesheet" type="text/css" href="css/navbar.css">

</head>


<body>
    <nav class="topnav">
        <a href="NerdScape.php">Main Game</a>
        <a class="active" href="levelDesigner.php">Level Designer</a>
        <a href="levelExplorer.php">Level Explorer</a>
        <a href="scoreboards.php">Scoreboards</a>
        <a href="about.php">About</a>
        <a class="logout" href="?logout='1'">Log out</a>
    </nav>
    <br>

    <canvas id="canvas" width="800" height="450" style="display: block; margin: auto; background: #dddddd"></canvas>
    <br>
    <form action="levelDesigner.php" method="post" enctype="multipart/form-data">
        <input type="file" name="file" id="file">
        <label>
            <input type="radio" name="sprite_type" value="Background" checked>
            Background
        </label>
        <label>
            <input type="radio" name="sprite_type" value="Static">
            Static
        </label>
        <label>
            <input type="radio" name="sprite_type" value="Randomizer">
            Sniper
        </label>
        <label>
            <input type="radio" name="sprite_type" value="Repeater">
            Repeater
        </label>
        <label>
            <input type="radio" name="sprite_type" value="Sniper">
            Randomizer
        </label>
        <label>
            <input type="radio" name="sprite_type" value="Player">
            Player
        </label>
        <label>
            <input type="radio" name="sprite_type" value="Flag">
            Flag
        </label>
        <label>
            <input type="radio" name="sprite_type" value="Portal">
            Portal
        </label>
        <label>
            <input type="radio" name="sprite_type" value="Coin">
            Coin
        </label>
        <button type="submit" value="Upload Sprite" name="upload">Upload</button>
    </form>
    <?php include("actions/upload_sprite.php") ?>
    <div id="selectors">
        <button id="preview">Preview Movement</button>
        <figure id="backgroundContainer">
            <p>Backgrounds</p>
        </figure>
        <figure id="staticContainer">
            <p>Static elements</p>
        </figure>
        <figure id="enemyContainer">
            <p>Enemies</p>
        </figure>
        <figure id="uniqueContainer">
            <p>Unique elements</p>
        </figure>

        <figure>
            <form id="createLevelbtn" method="post">
                <label>
                    Level name:
                    <input type="text" name="name" value="my level">
                </label>
                <input type="submit" value="Upload">
            </form>


            Instructions <br>
            <label>
                1 - Select an element to pop on canvas. You may only select 1 player and 1 flag.<br>
                2 - Drag elements to desired positions with left mouse.<br>
                3 - While dragging used wasd or arrow keys to redimension your element.<br>
                4 - Right click elements to edit their properties<br>
                5 - Name your level and upload it to make it available for everyone.
            </label>
        </figure>
    </div>

    <div id="Editor">
        <p>Editor</p>
        <button id="remove">Remove Element</button>
        <br><br>
        <label>x =
            <textarea id="x"></textarea>
        </label>
        <label>y =
            <textarea id="y"></textarea>
        </label>
        <label>w =
            <textarea id="w"></textarea>
        </label>
        <label>h =

            <textarea id="h"></textarea>
        </label>
        <label id="angle_container">angle º =
            <textarea id="angle"></textarea>
        </label>
        <br>
        <section id="enemyEditor">
            <button id="insertMovement">Insert Movement</button>
            <button id="previewMovement">Preview Movement</button>
            <br>
            <label class="a">SpeedX SpeedY AccelerationX AccelerationY Duration(ms) ActionFrequency</label>
            <section id="movements"></section>
        </section>
        <section id="portalEditor">
            <label>destination id =
                <textarea id="dest_id"></textarea>
            </label>
        </section>
        <section id="flagEditor">
            <label>level reward =
                <textarea id="reward"></textarea>
            </label>
        </section>
        <section id="coinEditor">
            <label>coin value =
                <textarea id="value"></textarea>
            </label>
        </section>
    </div>
</body>

</html>
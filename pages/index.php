<?php

//$_SESSION['username'] = "TEST USER"; //TODO remove this line

include('../actions/check_login.php');
include('../actions/do_logout.php')
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" type="text/css" href="../css/navbar.css">
    <title>Home</title>
</head>

<body>
    <div class="topnav">
        <a class="active" href="#home">Main Game</a>
        <a href="#designer">Level Designer</a>
        <a href="#scoreboard">Scoreboards</a>
        <a href="#about">About</a>
        <a class="logout" href="index.php?logout='1'">Log out</a>
    </div>

    <div class="content">
        <!-- notification message -->
        <?php if (isset($_SESSION['success'])) : ?>
            <div class="error success">
                <h3>
                    <?php
                    echo $_SESSION['success'];
                    unset($_SESSION['success']);
                    ?>
                </h3>
            </div>
        <?php endif ?>

        <!-- logged in user information -->
        <?php if (isset($_SESSION['username'])) : ?>
            <p>Welcome <strong><?php echo $_SESSION['username']; ?></strong></p>
        <?php endif ?>
    </div>

</body>
</html>